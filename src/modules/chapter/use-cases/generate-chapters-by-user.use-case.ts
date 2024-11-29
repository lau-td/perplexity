import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDocumentChapterRepository,
  IDocumentRepository,
  IUserRepository,
  IYoutubeRepository,
} from 'src/core/repository';
import { GenerateChaptersByUserInputDto } from '../dtos';
import { OpenAIService } from 'src/modules/llm-task/openai.service';

export class GenerateChaptersByUserCommand implements ICommand {
  constructor(public readonly input: GenerateChaptersByUserInputDto) {}
}

const PROMPT_TEMPLATE = `
To complete this task, you need to create an organized chapter structure from the provided transcript of a YouTube video. Each chapter should have a title and a timestamp.

Here are the steps to follow:

1. Read through the entire transcript carefully to understand the main topics and flow of the video content.

2. Identify natural breaking points or transitions between different topics in the content.

3. Create meaningful chapter titles that accurately reflect the content of each section. Titles should be:
   - Concise and clear
   - Descriptive of the section's content
   - Easy to understand at a glance

4. Each chapter should:
   - Have a clear beginning and end
   - Cover a distinct topic or subtopic
   - Be logically organized in relation to other chapters
   - Include the timestamp where the chapter begins
   - The content should be a meaningful description of what this chapter covers and long enough to be useful (not just a few words - at least 20 words)

5. Ensure the chapters:
   - Follow a logical progression
   - Are balanced in length when possible
   - Cover all major topics discussed in the video
   - Don't overlap in content

Remember, the goal is to create a chapter structure that helps viewers easily navigate and understand the video's content.

# Template for the Chapters
[
  {
    title: "Introduction to Topic",
    subtitle: "0:00",
    content: "Meaningful description of what this chapter covers ... (long enough to be useful)",
    position: 1,
  },
  {
    title: "First Major Topic",
    subtitle: "2:30",
    content: "Meaningful description of what this chapter covers ... (long enough to be useful)",
    position: 2,
  }
]

Based on the above template and instructions, here is the transcript and information of the YouTube video:

`;

@CommandHandler(GenerateChaptersByUserCommand)
export class GenerateChaptersByUserCommandHandler
  implements ICommandHandler<GenerateChaptersByUserCommand, void>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CHAPTER_REPOSITORY)
    private readonly chapterRepository: IDocumentChapterRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    private readonly openAIService: OpenAIService,
  ) {}

  async execute(command: GenerateChaptersByUserCommand) {
    const { userId, documentId } = command.input;

    const [user, document] = await Promise.all([
      this.userRepository.findOne({ id: userId }),
      this.documentRepository.findOne({ id: documentId }),
    ]);

    if (!user || !document) {
      throw new NotFoundException('User or document not found');
    }

    if (document.userId !== user.id) {
      throw new ForbiddenException(
        'User does not have access to this document',
      );
    }

    const existChapters = await this.chapterRepository.find({
      documentId,
    });

    if (existChapters.length > 0) {
      throw new ConflictException('Chapters already exist');
    }

    const youtubeInfo = await this.youtubeRepository.findOne({
      id: document.youtubeId,
    });

    if (!youtubeInfo) {
      throw new NotFoundException('Youtube info not found');
    }

    const youtubeTranscript = youtubeInfo.metadata.text;
    const youtubeTitle = youtubeInfo.name;
    const youtubeDescription = youtubeInfo.metadata.description;

    const prompt = `${PROMPT_TEMPLATE} 
    Title: ${youtubeTitle}
    Description: ${youtubeDescription}
    Transcript: ${youtubeTranscript}`;

    const response = await this.openAIService.generateCompletion(prompt);
    const chaptersJson = this.extractJsonContent(response);

    await this.chapterRepository.createMany(
      JSON.parse(chaptersJson).map((chapter) => ({
        title: chapter.title,
        subtitle: chapter.subtitle,
        content: chapter.content,
        position: chapter.position,
        documentId,
      })),
    );
  }

  extractJsonContent(input: string): string {
    const patterns = {
      withBackticks: /```json\n([\s\S]*?)```/,
      withoutBackticks: /(\{[\s\S]*\})/,
    };

    return (
      patterns.withBackticks.exec(input)?.[1]?.trim() ?? // Try with backticks first
      patterns.withoutBackticks.exec(input)?.[1]?.trim() ?? // Then without backticks
      ''
    );
  }
}
