import { environment } from '../environments/environment';
import { Auth } from 'aws-amplify';

export class BaseService {
  getHeaders(others: { [key: string]: string } | null | undefined): { [key: string]: string } {
    const storage: any = window.localStorage.getItem('persistedState');
    const user = (storage ? JSON.parse(storage) : undefined);

    const headers: { [key: string]: string } = {
    };
    if (user) {
      headers['X-URP-UserId'] = user.user['user_id'];
    } else {
      headers['X-URP-UserId'] = '1';
    }
    return Object.assign(headers, others || {});
  }

  async fetch(method: string, path: string, data?: any, headers?: { [key: string]: string } | null | undefined) {
    const url = `${environment.serverUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    headers = headers || {};
    let body: any = undefined;
    if (data !== undefined  && data !== null) {
      if (data instanceof FormData) {
        body = data;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }
    }

    const storage: any = window.localStorage.getItem('persistedState');
    const user = (storage ? JSON.parse(storage) : undefined);
    if (user) {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      headers['Authorization'] =  accessToken;
    }

    return await fetch(url, {
      method,
      cache: 'no-cache',
      headers: this.getHeaders(headers),
      body,
    });
  }
}
