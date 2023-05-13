import { BaseService } from './BaseService';

export class ExploreService extends BaseService {
 async search(data = {}, page: number) {
  return await super.fetch('POST', `/explore?page=${page}`, data);
 }
}
