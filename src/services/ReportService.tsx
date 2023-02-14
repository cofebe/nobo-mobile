import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
const API_URL = environment.serverUrl + '/report';

export class ReportService extends BaseService {
  async reportPost(data = {}) {
    const response = await fetch(API_URL + `/post`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }
  async reportUser(data = {}) {
    const response = await fetch(API_URL + `/user`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }
}
