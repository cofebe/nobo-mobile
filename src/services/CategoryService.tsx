import { BaseService } from './BaseService';
import { CategoriesResponse } from '../models';

export class CategoryService extends BaseService {
  async getAllCategories(): Promise<CategoriesResponse> {
    const response = await super.fetch('GET', `/api/categories/all?limit=500`);
    const json: CategoriesResponse = await response.json();
    return json;
  }
}
