import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
import { AuthService } from './AuthService';

const API_URL = environment.serverUrl + '/api';

export class UserService extends BaseService {
  getUserCache() {
    let user: any = {};
    if (window.localStorage.getItem('persistedState')) {
      let storage: any = window.localStorage.getItem('persistedState');
      user = JSON.parse(storage);
    }

    return user;
  }

  async getMe(): Promise<User> {
    const res = await super.fetch('GET', '/api/users/me');
    const json: LoginResponse = await res.json();

    if (json.token) {
      const authService = new AuthService();
      authService.setUserToken(json.token);
      authService.setUserId(json.user._id);
    }

    return json.user;
  }

  async getProfile(userId: any) {
    return await super.fetch('GET', `/api/users/${userId}/profile`);
  }

  async getProducts(userId: any, productType: string) {
    userId = "61e9e3cde9d5a06abb991653";

    let perPage = 100;
    let page = 1;
    let filter = {"active": true, "sold": {"$in": [true, false]}, "retailPrice": {"$gt": 0}, "action": productType, "vendor": "61e9e3cde9d5a06abb991653"};
    let sort = {"createdAt": -1};

    let queryParams = new URLSearchParams({
      perPage: perPage.toString(),
      page: page.toString(),
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort)
    }).toString();

    return await super.fetch('GET', `api/products/all?${queryParams}`);
  }

  async updateProfile(data = {}, userId: number) {
    const response = await fetch(API_URL + `/${userId}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async setUserDeviceToken(userId: number, data: any) {
    const response = await fetch(API_URL + `/${userId}/device/token`, {
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

  async savePersonalTrainers(userId: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/personalTrainer`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async removePersonalTrainer(userID: number, personalTrainerID: number) {
    const response = await fetch(
      API_URL + `/${userID}/personalTrainer/${personalTrainerID}`,
      {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );
    return response;
  }

  async getPersonalTrainers(userId: number) {
    return await super.fetch('GET', `/user/${userId}/personalTrainer`);
  }

  async updatePersonalTrainer(
    userId: number,
    personalTrainerID: number,
    data = {}
  ) {
    const response = await fetch(
      API_URL + `/${userId}/personalTrainer/${personalTrainerID}`,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    return response;
  }

  async saveArticles(userId: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/article`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async removeArticle(userID: number, articleID: number) {
    const response = await fetch(API_URL + `/${userID}/article/${articleID}`, {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return response;
  }

  async getArticles(userId: number) {
    return await super.fetch('GET', `/user/${userId}/article`);
  }

  async updateArticle(userId: number, articleID: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/article/${articleID}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async saveNilDeals(userId: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/nil`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateNilDeal(userId: number, nilID: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/nil/${nilID}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async removeNilDeal(userID: number, nilID: number) {
    const response = await fetch(API_URL + `/${userID}/nil/${nilID}`, {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return response;
  }

  async saveGame(userId: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/game`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateGame(userId: number, gameID: number, data = {}) {
    const response = await fetch(API_URL + `/${userId}/game/${gameID}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async removeGame(userID: number, gameID: number) {
    const response = await fetch(API_URL + `/${userID}/game/${gameID}`, {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return response;
  }

  async deleteAccount(userID: string|number, data = {}) {
    const response = await fetch(API_URL + `/delete/${userID}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async getGameSchedule(userId: number) {
    return await super.fetch('GET', `/user/${userId}/games`);
  }

  async getNILDeals(userId: number) {
    return await super.fetch('GET', `/user/${userId}/nil`);
  }

  async getWatchlist(userId: number) {
    return await super.fetch('GET', `/user/${userId}/watchlist`);
  }

  async addToWatchlist(userId: number, data = {}) {
    return await super.fetch('POST', `/user/${userId}/watchlist`, data);
  }

  async removeFromWatchlist(userId: number) {
    return await super.fetch('DELETE', `/user/${userId}/watchlist`, {});
  }

  async followUser(userId: number) {
    return await super.fetch('POST', `/user/${userId}/follow`, {});
  }

  async removeFollowUser(userId: number) {
    return await super.fetch('DELETE', `/user/${userId}/follow`, {});
  }

  async getUserPraise(userId: number) {
    return await super.fetch('GET', `/user/${userId}/praise`);
  }

  async postPraise(userId: number, req: any) {
    return await super.fetch('POST', `/user/${userId}/praise`, req);
  }

  async recordProfileVisit(userId: number, location: any) {
    console.log('recordProfileVisit', userId, location);

    const data: any = location?.state || {};

    return await super.fetch('POST', `/user/${userId}/visit`, data);
  }

  async getProfileInsights(userId: number, age: number) {
    return await super.fetch('GET', `/user/${userId}/insights?age=${age}`);
  }

  async login(email: string, password: string): Promise<User> {
    const res = await super.fetch('POST', '/api/users/login', { email, password });
    //console.log('res', res);
    const json: LoginResponse = await res.json();
    //console.log('json', json);

    if (res.status === 404) {
      console.log('404', json.error);
      throw json.error;
    }

    if (json.token) {
      const authService = new AuthService();
      authService.setUserToken(json.token);
      authService.setUserId(json.user._id);
    }

    return json.user;
  }
}

export interface LoginResponse {
  token: string;
  user: User;
  error: string;
}

export interface User {
  _id: string;
  avatar: string;
  blocked: boolean;
  blurbText: string;
  cart: ShoppingCart;
  createdAt: string;
  displayName: string;
  email: string;
  emailVerified: string;
  experiencePreferences: string;
  favoriteBrands: string[];
  favorites: string[];
  firstName: string;
  followers: string[];
  following: string[];
  lastName: string;
  memberSince: string;
  notifications: string[];
  profileBg: string;
  rating: number;
  reviews: string[];
  role: string;
  salesSchedule: string[];
  sellCloset: number;
  shippingAddress: string[];
  tradeCloset: number;
  unfinishedOnboardActivity: string;
  updatedAt: string;
}

export interface ShoppingCart {
  _id: string;
  products: string[];
}

