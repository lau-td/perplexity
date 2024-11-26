import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  GenerateYoutubeSummaryInputDto,
  GenerateYoutubeSummaryResponseDto,
} from '../dtos';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { Inject, NotFoundException } from '@nestjs/common';
import { IYoutubeRepository } from 'src/core/repository';
import { OpenAIService } from '../openai.service';

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

export class GenerateYoutubeSummaryCommand implements ICommand {
  constructor(public readonly input: GenerateYoutubeSummaryInputDto) {}
}

@CommandHandler(GenerateYoutubeSummaryCommand)
export class GenerateYoutubeSummaryCommandHandler
  implements
    ICommandHandler<
      GenerateYoutubeSummaryCommand,
      GenerateYoutubeSummaryResponseDto
    >
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    private readonly openaiService: OpenAIService,
  ) {}

  async execute(command: GenerateYoutubeSummaryCommand) {
    const { input } = command;

    try {
      const youtubeInfo = await this.youtubeRepository.findOne({
        videoId: input.videoId,
      });

      if (!youtubeInfo) {
        throw new NotFoundException('Youtube info not found');
      }

      const prompt =
        PROMPT_TEMPLATE +
        youtubeInfo.metadata.transcript +
        '\n\n' +
        JSON.stringify(youtubeInfo.metadata);

      const summary = await this.openaiService.generateCompletion(prompt);

      return {
        result: summary,
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
}
