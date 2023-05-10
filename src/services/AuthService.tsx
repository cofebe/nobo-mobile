import { environment } from '../environments/environment';

const API_URL = environment.serverUrl + '/auth';
const API_URL_USER = environment.serverUrl + '/user';

const USER_ID_KEY = 'appUserId';
const USER_NAME_KEY = 'appUsername';
const USER_TOKEN_KEY = 'appUserToken';

export class AuthService {
  getUserId() {
    const storage = window.localStorage.getItem(USER_ID_KEY);
    return storage;
  }

  setUserId(userId: string) {
    window.localStorage[USER_ID_KEY] = userId;
  }

  getUserDisplayName() {
    const storage = window.localStorage.getItem(USER_NAME_KEY);
    return storage;
  }

  setUserDisplayName(username: string) {
    window.localStorage[USER_NAME_KEY] = username;
  }

  getUserToken() {
    const storage = window.localStorage.getItem(USER_TOKEN_KEY);
    return storage;
  }

  setUserToken(tokenId: string) {
    window.localStorage[USER_TOKEN_KEY] = tokenId;
  }
 
  getUserData() {
    let user: any;
    if (window.localStorage.getItem('persistedState')) {
      let storage: any = window.localStorage.getItem('persistedState');
      user = JSON.parse(storage);
    }
    //console.log('getUserData: ', user);

    if (user) return user;
    return '';
  }

  setUserData(data: any) {
    window.localStorage['persistedState'] = JSON.stringify({
      user: data,
    });
  }

  async logout() {
    console.log('Logging user out');
    try {
      if (window.localStorage.getItem(USER_ID_KEY)) {
        window.localStorage.removeItem(USER_ID_KEY);
      }
      if (window.localStorage.getItem(USER_NAME_KEY)) {
        window.localStorage.removeItem(USER_NAME_KEY);
      }
      if (window.localStorage.getItem(USER_TOKEN_KEY)) {
        window.localStorage.removeItem(USER_TOKEN_KEY);
      }
    } catch (error) {
      console.log('error signing out: ', error);
    }
    return true;
  }

  async signUp(data = {}) {
    const response = await fetch(API_URL + '/signup', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      console.log('Account already created');
      throw response;
    }

    return response;
  }

  async signUpAthlete(data = {}, userID: any) {
    const response = await fetch(API_URL_USER + `/${userID}/athlete`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 500) {
      throw Error('Something went wrong');
    }
    return response;
  }

  async resetPassword(data = {}) {
    const response = await fetch(API_URL + `/password-reset`, {
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
