import { IsNotEmpty } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class UploadDocumentDto {
  @IsNotEmpty()
  @IsFile()
  file: MemoryStoredFile;
}
