import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
const API_URL = environment.serverUrl;

export class FeedService extends BaseService {
  async getProfileFeed(userID: string) {
    return await super.fetch('GET', `api/feed/${userID}`);
  }

  async getFeed(userID: number, page: number, filter?: string) {
    return await super.fetch(
      'GET',
      `/feed?filter=${encodeURIComponent(filter || '')}&page=${page}`
    );
  }

  async getUserFeed(userID: number, userType: string, page: number, filter?: string) {
    return await super.fetch(
      'GET',
      `/feed/${userType}/${userID}?filter=${encodeURIComponent(filter || '')}&page=${page}`
    );
  }

  async getPost(userID: any, postID: number) {
    const response = await fetch(API_URL + `/${userID}/post/${postID}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('getPost res: ', response);
    return response;
  }

  async getPostLikes(userID: any, postID: number) {
    const response = await fetch(API_URL + `/${userID}/post/${postID}/like`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('getPostLikes res: ', response);
    return response;
  }

  async getPostComments(postID: any) {
    const response = await fetch(API_URL + `/${postID}/comment`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('getPostComments res: ', response);
    return response;
  }

  async post(data = {}) {
    return await super.fetch('POST', `api/feed/create-item`, data);
  }

  async removePost(postID: any) {
    const response = await super.fetch('POST', `api/feed/remove/${postID}`);
    return response;
  }

  async postComment(data: any) {
    return await super.fetch('POST', `api/feed/comment`, data);
  }

  async likeComment(data: any) {
    return await super.fetch('POST', `api/feed/like/comment`, data);
  }

  async likePost(data: any) {
    const response = await super.fetch('POST', '/api/feed/like/feed-item', data, {
      'Content-Type': 'application/json',
    });
    return response;
  }

  async removeLikePost(userID: number, postID: number) {
    const response = await fetch(API_URL + `/${userID}/post/${postID}/like`, {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return response;
  }

  async uploadImage(data: any) {
    return await super.fetch('POST', 'api/files/upload', data)
  }

  async comment(data = {}) {
    const response = await fetch(API_URL + `/comment`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async promotePost(postID: number, duration: number, cost: number) {
    return await super.fetch('POST', `/feed/${postID}/featured`, {
      durationDays: duration,
      costCents: Math.round(cost * 100),
    });
  }

  async trackImpression(postID: number) {
    return await super.fetch('POST', `/feed/${postID}/impression`, {});
  }

  async getPostStats(postID: number, age: number) {
    return await super.fetch('GET', `/feed/${postID}/stats?age=${age}`);
  }
}
