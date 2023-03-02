import { environment } from '../environments/environment';
import { AuthService } from './AuthService';

export class BaseService {
  authService: AuthService = new AuthService();

  getHeaders(others: { [key: string]: string } | null | undefined): { [key: string]: string } {
    const headers: { [key: string]: string } = {
    };

    const token = this.authService.getUserToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
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

    return await fetch(url, {
      method,
      cache: 'no-cache',
      headers: this.getHeaders(headers),
      body,
    });
  }
}
