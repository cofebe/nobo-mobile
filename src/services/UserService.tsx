import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
import { AuthService } from './AuthService';
import {
  AddressRequest,
  CreateShippingAddressResponse,
  LoginResponse,
  PaymentMethodsResponse,
  SuccessResponse,
  User,
  FullOrder,
  OrderResponse,
  OrdersResponse,
} from '../models';

const API_URL = environment.serverUrl + '/api';

export class UserService extends BaseService {
  async getMe(): Promise<User> {
    const res = await super.fetch('GET', '/api/users/me');
    const json: LoginResponse = await res.json();

    if (json.token) {
      const authService = new AuthService();
      authService.setUserToken(json.token);
      authService.setUserId(json.user._id);
      authService.setUserDisplayName(json.user.displayName);
    }

    return json.user;
  }

  async getProfile(userId: any) {
    return await super.fetch('GET', `/api/users/${userId}/profile`);
  }

  async getProducts(userId: any, productType: string) {
    const perPage = 100;
    const page = 1;
    const filter = {"active": true, "sold": {"$in": [true, false]}, "retailPrice": {"$gt": 0}, "action": productType, "vendor": userId};
    const sort = {"createdAt": -1};

    const queryParams = new URLSearchParams({
      perPage: perPage.toString(),
      page: page.toString(),
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort)
    }).toString();

    return await super.fetch('GET', `api/products/all?${queryParams}`);
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
      authService.setUserDisplayName(json.user.displayName);
    }

    return json.user;
  }

  async addShippingAddress(data: AddressRequest): Promise<User> {
    const body = {
      action: 'add',
      address: data,
    };
    const res = await super.fetch('POST', '/api/users/shipping-address', body);
    const json: CreateShippingAddressResponse = await res.json();
    return json.currentUser;
  }

  async setDefaultShippingAddress(index: number): Promise<User> {
    const body = {
      action: 'default',
      index,
    };
    const res = await super.fetch('POST', '/api/users/shipping-address', body);
    const json: CreateShippingAddressResponse = await res.json();
    return json.currentUser;
  }

  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    const res = await super.fetch('GET', '/api/orders/payment-methods');
    const json: PaymentMethodsResponse = await res.json();
    return json;
  }

  async addPaymentMethod(data: any): Promise<boolean> {
    const res = await super.fetch('POST', '/api/orders/add-payment-method', data);
    const json: SuccessResponse = await res.json();
    return json.success;
  }

  async setDefaultPaymentMethod(id: string): Promise<boolean> {
    const body = {
      cardID: id,
    };
    const res = await super.fetch('POST', '/api/orders/default-payment-method', body);
    const json: SuccessResponse = await res.json();
    return json.success;
  }

  async getOrders(): Promise<OrdersResponse> {
    const res = await super.fetch('GET', '/api/orders/my-purchases');
    const json: OrdersResponse = await res.json();
    return json;
  }

  async getOrder(id: string): Promise<FullOrder> {
    const res = await super.fetch('GET', `/api/orders/my-purchases/${id}`);
    const json: OrderResponse = await res.json();
    return json.order;
  }

  // From URP /////////////////////////////////////////////////////////////////
  getUserCache() {
    let user: any = {};
    if (window.localStorage.getItem('persistedState')) {
      let storage: any = window.localStorage.getItem('persistedState');
      user = JSON.parse(storage);
    }

    return user;
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

  async getWatchlist(userId: number) {
    return await super.fetch('GET', `/user/${userId}/watchlist`);
  }

  async addToWatchlist(userId: number, data = {}) {
    return await super.fetch('POST', `/user/${userId}/watchlist`, data);
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

  async getProfileInsights(userId: number, age: number) {
    return await super.fetch('GET', `/user/${userId}/insights?age=${age}`);
  }
}
