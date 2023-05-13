import { BaseService } from './BaseService';

export class ConnectionService extends BaseService {
 async getConnections() {
  const response = await super.fetch('GET', `/connections?connection_type=connected`);

  if (response.status === 401) {
   console.log('Unauthorized');
   throw response;
  }

  return response;
 }

 async getPendingConnections() {
  const response = await super.fetch('GET', `/connections?connection_type=pending`);

  if (response.status === 401) {
   console.log('Unauthorized');
   throw response;
  }

  return response;
 }

 async createConnection(requesteeID: number) {
  const response = await super.fetch('POST', '/connections', { requestee: requesteeID });

  if (response.status === 401) {
   console.log('Unauthorized');
   throw response;
  }

  return response;
 }

 async acceptConnection(connectionID: number) {
  const response = await super.fetch('POST', `/connections/${connectionID}`, {
   new_status: 'connected',
  });

  if (response.status === 401) {
   console.log('Unauthorized');
   throw response;
  }

  return response;
 }

 async rejectConnection(connectionID: number) {
  const response = await super.fetch('POST', `/connections/${connectionID}`, {
   new_status: 'rejected',
  });

  if (response.status === 401) {
   console.log('Unauthorized');
   throw response;
  }

  return response;
 }

 async removeConnection(connectionID: number) {
  const response = await super.fetch('POST', `/connections/${connectionID}`, {
   new_status: 'removed',
  });

  if (response.status === 401) {
   console.log('Unauthorized');
   throw response;
  }

  return response;
 }
}
