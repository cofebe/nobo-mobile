import { environment } from '../environments/environment';
import { Auth } from 'aws-amplify';

export class BaseService {
  getHeaders(others: { [key: string]: string } | null | undefined): { [key: string]: string } {
    const storage: any = window.localStorage.getItem('persistedState');
    const user = (storage ? JSON.parse(storage) : undefined);

    const headers: { [key: string]: string } = {
    };

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

    headers['Authorization'] =  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2Y1NzExZDQ4ZmNmYmQxZTY2NWZkZjMiLCJlbWFpbCI6ImNocmlzQGNvZmViZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE2Nzc3ODkzMDQsInJlZnJlc2giOjE2NzcxODU0MDQsImlhdCI6MTY3NzE4NDUwNH0.aqRaKJwNgQCrpDmAyBhFB21L78QgANimoFOiCzGsxKE";

    return await fetch(url, {
      method,
      cache: 'no-cache',
      headers: this.getHeaders(headers),
      body,
    });
  }
}
