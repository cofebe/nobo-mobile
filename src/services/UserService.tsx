import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
import { AuthService } from './AuthService';
import {
  Address,
  AddressRequest,
  BrandsResponse,
  Conversation,
  CreateShippingAddressResponse,
  ExperienceResponse,
  FullOrder,
  LoginResponse,
  Notification,
  OfferedStatus,
  OrderResponse,
  OrdersResponse,
  PaymentMethodsResponse,
  ProductsResponse,
  ProfilPicResponse,
  RewardsResponse,
  SignUpResponse,
  SignUpType,
  SuccessResponse,
  TradesResponse,
  UnreadNotificationCountResponse,
  User,
  UserAccData,
  deleteCommentResponse,
} from '../models';

const API_URL = environment.serverUrl + '/api';

export interface ProductSearchOptions {
  //filter?: string;
  page?: number;
  perPage?: number;
  active?: boolean;
  sold?: boolean[];
  sort?: string;
  sortDirection?: number;
}

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

function isTokenExpired(token: string) {
  const decodedToken = parseJwt(token);
  const currentTime = Date.now().valueOf() / 1000;

  if (decodedToken.exp < currentTime) {
    return true;
  }
  return false;
}

export class UserService extends BaseService {
  async getMe(): Promise<User> {
    try {
      const res = await super.fetch('GET', '/api/users/me');
      const json: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (isTokenExpired(json.token)) {
        const authService = new AuthService();
        authService.setUserToken(json.token);
        authService.setUserId(json.user._id);
        authService.setUserDisplayName(json.user.displayName);
      }

      return json.user;
    } catch (error) {
      console.error(`There was an error fetching the user: ${error}`);
      throw error;
    }
  }

  async getProfile(userId: any) {
    return await super.fetch('GET', `/api/users/${userId}/profile`);
  }

  async getBuyer(userId: any) {
    const res = await super.fetch('GET', `/api/users/${userId}/profile`);
    return res.json();
  }

  async getMyProducts(
    productType: string,
    options?: ProductSearchOptions
  ): Promise<ProductsResponse> {
    const authService = new AuthService();
    return this.getProducts(authService.getUserId(), productType, options);
  }

  async getNotifications(): Promise<Notification[]> {
    const res = await super.fetch('GET', '/api/notifications/my');
    const json: Notification[] = await res.json();
    return json;
  }

  async markNotificationsAsRead(noteIds: string[]) {
    /*const res =*/ await super.fetch('POST', '/api/notifications/update/status', { noteIds });
    return true;
  }

  async deleteNotifications(noteIds: string[]) {
    /*const res =*/ await super.fetch('POST', '/api/notifications/remove', { noteIds });
    return true;
  }

  async getMyConversations(): Promise<Conversation[]> {
    const res = await super.fetch('GET', '/api/messages/my-convos');
    const json: Conversation[] = await res.json();
    return json;
  }

  async getUnreadNotificationCount() {
    const res = await super.fetch('GET', '/api/notifications/unread-count');
    const json: UnreadNotificationCountResponse = await res.json();

    if (json.token) {
      const authService = new AuthService();
      authService.setUserToken(json.token);
    }

    return json.unread;
  }

  async getConversation(conversationId: string): Promise<Conversation | undefined> {
    const res = await super.fetch('GET', '/api/messages/my-convos');
    const json: Conversation[] = await res.json();
    return json.find(c => c._id === conversationId);
  }

  async sendReply(convoId: string, message: string): Promise<Conversation> {
    const res = await super.fetch('POST', '/api/messages/reply', {
      convoId,
      message,
    });
    const json: Conversation = await res.json();
    return json;
  }

  async newConversation(
    orderId: string | null,
    productId: string | null,
    message: string
  ): Promise<Conversation> {
    const res = await super.fetch('POST', '/api/messages/new-conv', {
      message,
      orderId,
      productId,
      ref: orderId ? 'order' : 'product',
    });
    const json: Conversation = await res.json();
    return json;
  }

  async getMyPendingProducts(
    productType: string,
    options: ProductSearchOptions = {}
  ): Promise<ProductsResponse> {
    const authService = new AuthService();
    options.active = false;
    return this.getProducts(authService.getUserId(), productType, options);
  }

  async getProducts(
    userId: any,
    productType: string,
    options?: ProductSearchOptions
  ): Promise<ProductsResponse> {
    let perPage = 100;
    let page = 1;
    const filter: any = {
      active: true,
      sold: {
        $in: [true, false],
      },
      retailPrice: {
        $gt: 0,
      },
      action: productType,
      vendor: userId,
    };
    const sort: any = {
      createdAt: -1,
    };

    if (options) {
      if (options.perPage !== undefined) {
        perPage = options.perPage;
      }
      if (options.page !== undefined) {
        page = options.page;
      }
      if (options.active !== undefined) {
        if (options.active === null) {
          delete filter.active;
        } else {
          filter.active = options.active;
        }
      }
      if (options.sold !== undefined) {
        if (options.sold === null) {
          delete filter.sold;
        } else {
          filter.sold.$in = options.sold;
        }
      }
      if (options.sort !== null) {
        if (options.sort === null) {
          delete sort.createdAt;
        } else {
          sort[options.sort!] = options.sortDirection || -1;
        }
      }
    }

    const queryParams = new URLSearchParams({
      perPage: perPage.toString(),
      page: page.toString(),
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    }).toString();

    const res = await super.fetch('GET', `api/products/all?${queryParams}`);
    const json: ProductsResponse = await res.json();
    return json;
  }

  async login(email: string, password: string): Promise<User> {
    const res = await super.fetch('POST', '/api/users/login', { email, password }, undefined, true);
    //console.log('res', res);
    const json: LoginResponse = await res.json();
    // console.log('json', json);

    if (res.status === 404) {
      // console.log('404', json.error);
      throw json.error;
    }
    if (res.status === 401) {
      // console.log('401', json.error);
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

  async forgotPassword(email: string) {
    const res = await super.fetch('POST', '/api/users/lostPassword', { email });
    return res.json();
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

  async updateShippingAddress(data: Address, index: number): Promise<User> {
    const body = {
      action: 'update',
      address: data,
      index,
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

  async removeShippingAddress(index: number): Promise<User> {
    const body = {
      action: 'remove',
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

  async removePaymentMethod(id: string): Promise<boolean> {
    const body = {
      cardID: id,
    };
    const res = await super.fetch('POST', '/api/orders/remove-payment-method', body);
    const json: SuccessResponse = await res.json();
    return json.success;
  }

  async getAccount() {
    const res = await super.fetch('GET', '/api/users/accountBalance');
    return res.json();
  }



  async transferFunds(paypal: string, email: string) {
    const res = await super.fetch('POST', '/api/users/transfer-funds', {
      payoutMethod: paypal,
      paypal: email,
    });
    return res.json();
  }

  async getSales(): Promise<OrdersResponse> {
    const res = await super.fetch('GET', '/api/orders/my-sales');
    const json: OrdersResponse = await res.json();
    return json;
  }

  async getSale(id: string): Promise<FullOrder> {
    const res = await super.fetch('GET', `/api/orders/my-sales/${id}`);
    const json: OrderResponse = await res.json();
    return json.order;
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

  async getMyTrades(): Promise<TradesResponse> {
    const res = await super.fetch('GET', '/api/trades/my-trades/all');
    const json: TradesResponse = await res.json();
    return json;
  }

  async getOffers(): Promise<OfferedStatus> {
    const res = await super.fetch('GET', '/api/offers/my-offers/all');
    const json: OfferedStatus = await res.json();
    return json;
  }

  async getReturns() {
    const res = await super.fetch('GET', '/api/returns/my');
    return res.json();
  }
  async requestReturns(reason:string, comments:string, prodId:string) {
    const res = await super.fetch('POST', '/api/returns/request-return', {reason, comments, prodId })
    return res.json();
  }

  async acceptOffer(offerid: string): Promise<OfferedStatus> {
    const res = await super.fetch('POST', '/api/offers/accept', { offerid });
    const json: OfferedStatus = await res.json();
    return json;
  }
  async denyOffer(offerid: string): Promise<OfferedStatus> {
    const res = await super.fetch('POST', '/api/offers/reject', { offerid });
    const json: OfferedStatus = await res.json();
    return json;
  }
  async acceptTradeOffer(tradeid: string): Promise<TradesResponse> {
    const res = await super.fetch('POST', '/api/trades/accept', { tradeid });
    const json: TradesResponse = await res.json();
    return json;
  }
  async denyTradeOffer(tradeid: string): Promise<TradesResponse> {
    const res = await super.fetch('POST', '/api/trades/reject', { tradeid });
    const json: TradesResponse = await res.json();
    return json;
  }
  async getRewards(): Promise<RewardsResponse> {
    const res = await super.fetch('GET', '/api/users/rewards');
    const json: RewardsResponse = await res.json();
    return json;
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

  async deleteAccount(userID: string | number, data = {}) {
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

  async followUser(userId: string) {
    return await super.fetch('POST', `/api/users/follow`, { userId });
  }

  async getFollowers(userId: string) {
    return await super.fetch('POST', `/api/users/get-follows`, { userId });
  }

  async removeFollowUser(userId: string) {
    return await super.fetch('POST', `/api/users/unfollow`, { userId });
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

  // checking if email already exist
  async checkExistingEmail(email: string) {
    const res = await fetch(` https://thenobo.com/api/users/exists/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 404) {
      console.log('404', res.json);
    }

    return res.json();
  }

  // SIGNUP
  async signup(person: SignUpType): Promise<User> {
    const response = await super.fetch('POST', '/api/users/register', {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      displayName: person.userName,
      password: person.password,
    });

    const json: SignUpResponse = await response.json();
    if (json.token) {
      const authService = new AuthService();
      authService.setUserToken(json.token);
      authService.setUserId(json.user._id);
      authService.setUserDisplayName(json.user.displayName);
    }

    return json.user;
  }

  // EXPERIENCE PREFERENCE
  async experience(experiencePreferences: string) {
    const response = await super.fetch('POST', '/api/users/me', { experiencePreferences });
    const json: ExperienceResponse = await response.json();
    return json.currentUser;
  }

  //UPLOAD PROFILE PICTURE
  async uploadProfileImg(imgUrl: any) {
    const response = await super.fetch('POST', '/api/users/update-avatar', { imgUrl });
    const json: ProfilPicResponse = await response.json();
    return json.url;
  }

  // GET EXISTING USERS
  async getUsers(query: string) {
    if (query !== '') {
      try {
        const response = await super.fetch('GET', `/api/users/q/term/${query}`);
        return response.json();
      } catch (error) {
        console.log('err from userService response', error);
      }
    } else {
      try {
        const response = await super.fetch('GET', `/api/users/q/term/a`);
        return response.json();
      } catch (error) {
        console.log('err from userService response', error);
      }
    }

  }

  // FOLLOW A USER
  async followUsers(userId: string): Promise<User> {
    console.log('res from server ', userId);
    const response = await super.fetch('POST', '/api/users/follow', { userId });
    return response.json();
  }

  // GET BRANDS
  async getBrands() {
    const response = await super.fetch('GET', 'api/brands/all');
    const json: BrandsResponse = await response.json();
    return json.brands;
  }

  // ADD FAVOURITE BRAND
  async addBrand(brandId: string) {
    const response = await super.fetch('POST', '/api/brands/add-favorite', { brandId });
    return response.json();
  }
  // REMOVE BRAND
  async deleteBrand(brandId: string) {
    const response = await super.fetch('POST', '/api/brands/remove-favorite', { brandId });
    return response.json();
  }

  //CREATE FIRST POST
  async createPost(userMessage: string) {
    const response = await super.fetch('POST', '/api/feed/create-item', { userMessage });
    return response.json();
  }
  //UPDATE USER ACCOUNT INFO
  async updateUserAccount(data: UserAccData) {
    const response = await super.fetch('POST', '/api/users/me', {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber,
      saleSchedule: [],
      experiencePreferences: data.experiencePreferences,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.json();
  }

  async updateProfileBackground(data: any) {
    const response = await super.fetch('POST', 'api/users/update-profile-bg', data);
    return response.json();
  }

  async updateAvatar(data: any) {
    const response = await super.fetch('POST', 'api/users/update-avatar', data);
    return response.json();
  }

  async updateBlurb(data: any) {
    const response = await super.fetch('POST', 'api/users/update-blurb', data);
    return response.json();
  }

  async addFavorite(data: any) {
    const response = await super.fetch('POST', 'api/users/favorites', data);
    return response.json();
  }
}
