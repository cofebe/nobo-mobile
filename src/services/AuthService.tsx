import { environment } from "../environments/environment";
import { Auth } from "aws-amplify";

const API_URL = environment.serverUrl + "/auth";
const API_URL_USER = environment.serverUrl + "/user";

export class AuthService {
  getUserType() {
    let user: any;
    if (window.localStorage.getItem("persistedState")) {
      let storage: any = window.localStorage.getItem("persistedState");
      user = JSON.parse(storage);
    }

    if (user) return user.user["user_type"];
    return "athlete";
  }

  getUserID() {
    let user: any;
    if (window.localStorage.getItem("persistedState")) {
      let storage: any = window.localStorage.getItem("persistedState");
      user = JSON.parse(storage);
    }

    return user.user["user_id"];
  }

  getUserData() {
    let user: any;
    if (window.localStorage.getItem("persistedState")) {
      let storage: any = window.localStorage.getItem("persistedState");
      user = JSON.parse(storage);
    }
    //console.log("getUserData: ", user);

    if (user) return user;
    return "";
  }

  setUserData(data: any) {
    window.localStorage["persistedState"] = JSON.stringify({
      user: data,
    });
  }

  async login(data = {}) {
    const response = await fetch(API_URL + "/login", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.log("Unauthorized");
      throw response;
    }

    return response;
  }

  async logout() {
    console.log("Logging user out");
    try {
      await Auth.signOut();
      console.log("Logging user out");
      if (window.localStorage.getItem("persistedState")) {
        console.log("Found storage");
        window.localStorage.removeItem("persistedState");
      }
    } catch (error) {
      console.log("error signing out: ", error);
    }
    return true;
  }

  async signUp(data = {}) {
    const response = await fetch(API_URL + "/signup", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      console.log("Account already created");
      throw response;
    }

    return response;
  }

  async signUpAthlete(data = {}, userID: any) {
    const response = await fetch(API_URL_USER + `/${userID}/athlete`, {
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

  async signUpCoach(data = {}, userID: any) {
    const response = await fetch(API_URL_USER + `/${userID}/coach`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async signUpTrainer(data = {}, userID: any) {
    const response = await fetch(API_URL_USER + `/${userID}/trainer`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async resetPassword(data = {}) {
    const response = await fetch(API_URL + `/password-reset`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }
}
