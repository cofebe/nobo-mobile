import { BaseService } from './BaseService';
import { FileUploadResponse } from '../models';

export class FileService extends BaseService {
 async uploadFiles(formData: FormData): Promise<FileUploadResponse> {
  const response = await super.fetch('POST', `/api/files/upload`, formData);
  const json: FileUploadResponse = await response.json();
  return json;
 }
}
