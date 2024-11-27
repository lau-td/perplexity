import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ProcessStoreDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  documentId: string;
}
