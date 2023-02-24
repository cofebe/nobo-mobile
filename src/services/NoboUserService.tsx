import { environment } from '../environments/environment';
import { Auth } from 'aws-amplify';

const API_URL = environment.serverUrl + '/api/users';

export class NoboUserService {
  async login(data = {}) {
    const response = await fetch(API_URL + '/login', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.log('Unauthorized');
      throw response;
    }

    return response;
  }
}
