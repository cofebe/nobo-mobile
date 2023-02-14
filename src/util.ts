import { FeedItem } from './data/athlete-feed';
import { LoadingOptions } from '@ionic/react';

export const loadingOptions: LoadingOptions = {
  spinner: 'bubbles',
  //showBackdrop: false,
  cssClass: 'loading-indicator',
};

export function getMessagePhotos(msg: FeedItem) {
  if (msg?.photo_url) {
    try {
      let photosStr = msg.photo_url
        .replace('[', '')
        .replace(']', '')
        .split("'")
        .join('');
      let photos = photosStr.split(',');
      if (photosStr && photos.length > 0) {
        return photos;
      }
    } catch {
      console.log('error extracting the post photos');
    }
  }
  return [];
}

export function viewUser(history: any, userId: number, accountType: string, postId?: number) {
  const storage: any = window.localStorage.getItem('persistedState');
  const user = (storage ? JSON.parse(storage) : undefined);

    console.log(`viewUser(${userId}, ${accountType})`);

  if (user) {
    console.log(`viewUser(${userId}, ${accountType})`, user.user['user_id']);
    if (!userId || userId === user.user['user_id']) {
      console.log('Skip going to own profile.');
      return;
    }
  }

  const historyState = {
    referrer: history.location.pathname,
    postId: postId,
  };

  if (accountType === 'athlete') {
    history.push({
      pathname: `/home/athlete-profile/${userId}`,
      state: historyState,
    });
  } else if (accountType === 'coach') {
    history.push({
      pathname: `/home/coach-profile/${userId}`,
      state: historyState,
    });
  } else if (accountType === 'trainer') {
    history.push({
      pathname: `/home/trainer-profile/${userId}`,
      state: historyState,
    });
  } else {
    history.push({
      pathname: `/home/organization-profile/${userId}`,
      state: historyState,
    });
  }
}

export function normalizeSportGender(sport: any) {
  let normSport = sport;
  if (normSport) {
    normSport = normSport
      .replace('wbasketball', 'basketball')
      .replace('mbasketball', 'basketball')
      .replace('wvolleyball', 'volleyball')
      .replace('mvolleyball', 'volleyball')
      .replace('mlacrosse', 'lacrosse')
      .replace('wlacrosse', 'lacrosse')
      .replace('wsoccer', 'soccer')
      .replace('msoccer', 'soccer');
  }
  return normSport;
}

export const DATE_FORMAT = 'h:mmaaa MMM d, yyyy';
