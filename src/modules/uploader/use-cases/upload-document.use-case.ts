import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as pdf from 'pdf-parse';

export class UploadDocumentCommand implements ICommand {
  constructor(public readonly file: MemoryStoredFile) {}
}

@CommandHandler(UploadDocumentCommand)
export class UploadDocumentCommandHandler
  implements ICommandHandler<UploadDocumentCommand, void>
{
  constructor() {}

  async execute(command: UploadDocumentCommand) {
    const { file } = command;

    // Get file extension and mime type
    const fileExtension = file.originalName.split('.').pop()?.toLowerCase();
    console.log('File type:', fileExtension);
    console.log('Mime type:', file.mimetype);

    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        console.log('Number of pages:', data.numpages);
        return data.text;
      } else if (
        file.mimetype.startsWith('text/') ||
        ['json', 'csv', 'txt', 'md'].includes(fileExtension)
      ) {
        const fileContent = file.buffer.toString('utf-8');
        console.log('Text content:', fileContent);
        return fileContent;
      } else {
        console.log('Unsupported file type:', file.mimetype);
        throw new Error(`Unsupported file type: ${file.mimetype}`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
}
