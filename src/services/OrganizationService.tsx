import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
const API_URL = environment.serverUrl + '/organization';

export class OrganizationService extends BaseService {

  async getOrganizaiton(organizationID: number) {
    return await super.fetch('GET', `/organization/${organizationID}`);
  }

  async getOrganizaitonByUserID(ownerUserID: number) {
    return await super.fetch('GET', `/organization/user/${ownerUserID}`);
  }

  async signUpOrganization(data = {}, userID: any) {
    const response = await fetch(API_URL, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 500) {
      throw Error("Something went wrong");
    }
    return response;
  }

  async updateOrganizationID(data = {}, organizationID: number) {
    const response = await fetch(API_URL + `/${organizationID}`, {
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
