import { BaseService } from './BaseService';
import { environment } from '../environments/environment';
import { AuthService } from './AuthService';
import {
  AddressRequest,
  Conversation,
  CreateShippingAddressResponse,
  FullOrder,
  LoginResponse,
  Notification,
  OrderResponse,
  OrdersResponse,
  PaymentMethodsResponse,
  ProductsResponse,
  SignUpResponse,
  SignUpType,
  SuccessResponse,
  TradesResponse,
  User,
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

  async getMyProducts(productType: string, options?: ProductSearchOptions): Promise<ProductsResponse> {
    const authService = new AuthService();
    return this.getProducts(authService.getUserId(), productType, options);
  }

  async getNotifications(): Promise<Notification[]> {
    const res = await super.fetch('GET', '/api/notifications/my');
    const json: Notification[] = await res.json();
    return json;
  }

  async markNotificationsAsRead(noteIds: string[]) {
    /*const res =*/ await super.fetch('POST', '/api/notifications/update/status',
    { noteIds });
    return true;
  }

  async deleteNotifications(noteIds: string[]) {
    /*const res =*/ await super.fetch('POST', '/api/notifications/remove',
    { noteIds });
    return true;
  }

  async getMyConversations(): Promise<Conversation[]> {
    const res = await super.fetch('GET', '/api/messages/my-convos');
    const json: Conversation[] = await res.json();
    return json;
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

  async newConversation(orderId: string | null, productId: string | null, message: string): Promise<Conversation> {
    const res = await super.fetch('POST', '/api/messages/new-conv', {
      message,
      orderId,
      productId,
      ref: (orderId ? 'order' : 'product'),
    });
    const json: Conversation = await res.json();
    return json;
  }

  async getMyPendingProducts(productType: string, options: ProductSearchOptions = {}): Promise<ProductsResponse> {
    const authService = new AuthService();
    options.active = false;
    return this.getProducts(authService.getUserId(), productType, options);
  }

  async getProducts(userId: any, productType: string, options?: ProductSearchOptions): Promise<ProductsResponse> {
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
      sort: JSON.stringify(sort)
    }).toString();

    const res = await super.fetch('GET', `api/products/all?${queryParams}`);
    const json: ProductsResponse = await res.json();
    return json;
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

  async getMyTrades(): Promise<TradesResponse> {
    const res = await super.fetch('GET', '/api/trades/my-trades/all');
    const json: TradesResponse = await res.json();
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



  // signing up a user
  async signup(person: SignUpType) {
    const res = await fetch("https://thenobo.com/api/users/register",

      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: person.firstName,
          lastName: person.lastName,
          email: person.email,
          displayName: person.userName,
          password: person.password
        }),
      });

    if (res.status === 404) {
      console.log('404', res.json);
    }

    return res.json();

  }



  // experience
  async experience(experienceOption: string, token: string) {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ "experiencePreferences": experienceOption })
    }
    const res = await fetch(`https://thenobo.com/api/users/me`, config)

    if (res.status === 500) {
      console.log('500 ', res.json());
    }
    return res.json()


  }


  //upload profile photo
  async uploadProfileImg(token: string, data: any) {

    const url = 'https://thenobo.com/api/users/update-avatar'
    try {
      console.log({ info: "the userService section" })
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "imgUrl": data })

      }
      const response = await fetch(url, config)
      return response.json()
    } catch (error) {
      console.log("err from userService response", error)
    }

  }


  // get users
  async getUsers() {
    try {
      const response = await fetch("https://thenobo.com/api/users/q/term/a")
      return response.json()
    } catch (error) {
      console.log("err from userService response", error)
    }

  }




  // FOLLOW A USER 
  async followUserS(token: string, userToFollowId: string) {

    const url = 'https://thenobo.com/api/users/follow'
    try {
      console.log({ info: "the userService section" })
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "userId": userToFollowId })

      }
      const response = await fetch(url, config)
      return response.json()
    } catch (error) {
      console.log("err from userService response", error)
    }

  }


  // Get  a user profile
  async getUser(userId: string) {
    const response = await fetch(`https://thenobo.com/api/users/${userId}/profile`)
    // console.log(response)
    return response.json()

  }

  // Get brands
  async getBrands() {
    const response = await fetch("https://thenobo.com/api/brands/q/term/a")
    // console.log(response)
    return response.json()

  }


  // SELECT BRAND
  async selectBrand(token: string, brandId: string) {

    const url = 'https://thenobo.com/api/brands/add-favorite'
    try {
      console.log({ info: "the userService section", brandId })
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "brandId": brandId })

      }
      const response = await fetch(url, config)
      return response.json()
    } catch (error) {
      console.log("err from userService response", error)
    }

  }


//Creating  post request
  async createPost(token: string, postMessage: string) {
    const url = 'https://thenobo.com/api/users/set-onboard-activity'
    try {
      console.log({ info: "the userService section", postMessage })
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "activity": postMessage })

      }
      const response = await fetch(url, config)
      return response.json()
    } catch (error) {
      console.log("err from userService response", error)
    }

  }


  //Creating  post request
  async skipPost(token: string) {
   const  defaultPost = " Excited to be on TheNOBO\u0021" 
    const url = 'https://thenobo.com/api/users/set-onboard-activity'
    try {
      console.log({ info: "the userService section", token })
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "userMessage": defaultPost })

      }
      const response = await fetch(url, config)
      return response.json()
    } catch (error) {
      console.log("err from userService response", error)
    }

  }
    



















}
