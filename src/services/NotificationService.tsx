import { BaseService } from './BaseService';
import { environment } from "../environments/environment";

const API_URL = environment.serverUrl + "/notifications";

export class NotificationService extends BaseService {

  async getNotifications(userID: any) {
    const response = await fetch(API_URL + `/${userID}`, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log("getNotifications res: ", response);
    return response;
  }

  async SendNotification(userID: any, sendToUserID: any) {
    const response = await fetch(API_URL + `/${userID}/${sendToUserID}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
  }

  getNotifcationCount() {
    let count = window.localStorage.getItem("notificationCount");
    if (count !== null) {
        return parseInt(count)
    }
    return 0;
  }

  incrementNotifcationCount() {
    let currentCount = window.localStorage.getItem("notificationCount")

    if ( currentCount !== null) {
        window.localStorage["notificationCount"] =  parseInt(currentCount) + 1;
    } else {
        window.localStorage["notificationCount"] =  1;
    }
  }

  resetNotifcationCount() {
    window.localStorage["notificationCount"] =  0;
  }
}