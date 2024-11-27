import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDocumentRepository,
  IDocumentSegmentRepository,
  IEmbeddingRepository,
  IYoutubeRepository,
} from 'src/core/repository';
import {
  convertTranscriptToJson,
  convertTranscriptToText,
  getYoutubeInfo,
  getYoutubeTranscript,
} from 'src/utils';

import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { ChunkingService } from 'src/modules/vector-store/chunking.service';
import { OpenAIService } from 'src/modules/llm-task/openai.service';

import { EmbeddingService } from 'src/modules/vector-store/embedding.service';

const PROMPT_TEMPLATE = `
# Instructions for Summarizing a YouTube Video Transcript

## 1. Preprocess the Transcript
- Read the entire transcript carefully to understand the flow of conversation or content
- Remove filler words, repetitions, and irrelevant small talk to focus on meaningful content
- Note down speaker names/roles when they first appear

## 2. Segment the Transcript into Topics
- Identify major themes or sections in the transcript. Common categories include:
  - Introduction: Briefly outline who is speaking (names/roles), the purpose of the video, or the context
  - Key Topics/Discussions: Break the transcript into sections based on different topics discussed
  - Anecdotes or Examples: Highlight any notable personal stories or examples
  - Advice or Insights: Extract actionable tips or lessons shared
  - Closing Remarks: Summarize the conclusion or key takeaways

## 3. Create a Clear Structure for the Summary
- Use headings for each major section or theme
- Write concise bullet points under each heading to summarize the content
- Attribute quotes and insights to specific speakers when possible

## 4. Focus on Key Points and Highlights
- Capture important numbers, facts, or milestones mentioned in the transcript
- Highlight memorable quotes or expressions (with speaker attribution)
- Include the emotions or reactions expressed by specific speakers, if relevant

## 5. Polish the Summary
- Ensure the summary is concise and logically flows from one section to another
- Use professional language, avoiding informal or conversational tone unless appropriate
- Maintain consistent speaker attribution throughout

---

# Template for the Summary

## [Video Title/Topic]

### Participants
- [Name/Role 1]: [Brief description or credentials]
- [Name/Role 2]: [Brief description or credentials]
- [Host/Moderator]: [If applicable]

### Introduction
- [Brief summary of the video's context, participants, or purpose.]
- [Host/Speaker Name]: [Opening remarks or context setting]

### Key Topics and Discussions
- [Topic 1]:
  - [Speaker Name]: [Main point discussed under this topic.]
  - [Speaker Name]: [Key insight or quote.]
- [Topic 2]:
  - [Speaker Name]: [Details of the second topic or theme.]
  - [Speaker Name]: [Additional information or examples.]

### Anecdotes or Examples
- [Speaker Name]: [Summarize any specific stories, analogies, or unique events shared.]

### Advice or Insights
- [Speaker Name]: [List actionable advice or key lessons shared.]
- [Speaker Name]: [Additional insights or recommendations.]

### Popular Moments or Milestones
- [Speaker Name]: [Highlight popular or viral moments]
- [Timestamp]: [Notable interaction or quote between speakers]

### Closing Remarks
- [Speaker Name]: [Wrap up with the main conclusion or takeaway]
- [Host/Moderator]: [Final thoughts or closing statements]

----
base on above instructions, write a summary for the following transcript and youtube info:
`;

export class YoutubeUrlsCommand implements ICommand {
  constructor(public readonly urls: string[]) {}
}

@CommandHandler(YoutubeUrlsCommand)
export class YoutubeUrlsCommandHandler
  implements ICommandHandler<YoutubeUrlsCommand, string>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_SEGMENT_REPOSITORY)
    private readonly documentSegmentRepository: IDocumentSegmentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.EMBEDDING_REPOSITORY)
    private readonly embeddingRepository: IEmbeddingRepository,

    private readonly chunkingService: ChunkingService,

    private readonly openaiService: OpenAIService,

    private readonly embeddingService: EmbeddingService,
  ) {}

  async execute(command: YoutubeUrlsCommand) {
    try {
      const { urls } = command;
      const [transcript, info] = await Promise.all([
        getYoutubeTranscript(urls[0]),
        getYoutubeInfo(urls[0]),
      ]);

      const existingYoutube = await this.youtubeRepository.findOne({
        videoId: info.videoId,
      });

      if (existingYoutube) {
        return existingYoutube.id;
      }

      const formattedTranscriptInJson = convertTranscriptToJson(transcript);
      const formattedTranscriptInText = convertTranscriptToText(transcript);

      const uuid = randomUUID();
      const filePath = `transcripts/${uuid}.txt`;

      // Ensure directory exists
      fs.mkdirSync('transcripts', { recursive: true });

      // Write transcript to file
      fs.writeFileSync(filePath, formattedTranscriptInText);

      const prompt =
        PROMPT_TEMPLATE +
        formattedTranscriptInText +
        '\n\n' +
        JSON.stringify(info);

      const [chunksResponse, summary] = await Promise.all([
        this.chunkingService.chunkDocument(filePath),
        this.openaiService.generateCompletion(prompt),
      ]);
      const chunksData = chunksResponse.chunks;

      // Delete file after processing
      fs.unlinkSync(filePath);

      // Create youtube
      const youtube = await this.youtubeRepository.create({
        name: info.title,
        url: info.videoUrl,
        videoId: info.videoId,
        metadata: {
          transcript: formattedTranscriptInJson,
          text: formattedTranscriptInText,
          ...info,
        },
        summary,
      });

      // Save the document to the database
      const document = await this.documentRepository.create({
        youtubeId: youtube.id,
      });

      // Save the chunks to the database
      const documentSegments = await Promise.all(
        chunksData.map((chunk, index) =>
          this.documentSegmentRepository.create({
            documentId: document.id,
            position: chunk.metadata.position || index,
            content: chunk.content,
            metadata: {
              ...chunk.metadata,
              documentId: document.id,
            },
          }),
        ),
      );

      // Generate embeddings
      const embeddings = await this.embeddingService.generateEmbeddings(
        chunksData.map((chunk) => chunk.content),
      );

      // Save the embeddings to the database
      await Promise.all(
        documentSegments.map((segment, index) =>
          this.embeddingRepository.create({
            documentSegmentId: segment.id,
            embedding: embeddings[index],
          }),
        ),
      );

      return youtube.id;
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      throw error;
    }
  }
}
