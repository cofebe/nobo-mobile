import FeedListItem from '../components/FeedListItem';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import {
  IonCol,
  IonContent,
  IonFab,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  useIonLoading,
  useIonViewWillEnter,
} from '@ionic/react';
import './Feed.scss';
import './StyleFeed.scss';
import ExploreListItem from '../components/ExploreListItem';

import { AuthService } from '../services/AuthService';
import { FeedService } from '../services/FeedService';
import { ExploreService } from '../services/ExploreService';
import { UserService } from '../services/UserService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { loadingOptions } from '../util';
import { isPlatform } from '@ionic/react';

import ImageZoom from '../components/ImageZoom';
import { Profile } from '../data/profile';

interface FeedItem {
  likes: any[];
  images: { url: string; originalName: string }[];
  _id: string;
  user: {
    _id: string;
    avatar: string;
    displayName: string;
    tradeCloset: number;
    sellCloset: number;
  };
  template: string;
  feedText: string;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const StyleFeed: React.FC = () => {
  let [profileMessages, setProfileMessages] = useState<Profile[]>([]);
  const exploreService = new ExploreService();
  const authService = new AuthService();
  const userService = new UserService();
  const feedService = new FeedService();
  const history = useHistory();
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const [messages, setMessages] = useState<FeedItem[]>([]);
  //const [filter, setFilter] = useState<string>();
  const [imageZoom, setImageZoom] = useState('');
  let [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  let [page, setPage] = useState<number>(0);
  let atBottomOfFeedListElem: HTMLElement | null;

  useIonViewWillEnter(() => {
    profileMessages = [];
    setProfileMessages(profileMessages);
    page = 0;
    setPage(0);
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    if (!atBottomOfFeedListElem) {
      atBottomOfFeedListElem = document.querySelector('#atBottomOfFeedList');
    }

    loadPosts(0);
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      loadPosts(0);
    }, 500);
  };

  function scroll(e: any) {
    if (atBottomOfFeedListElem) {
      const elemBounds = atBottomOfFeedListElem.getBoundingClientRect();
      const parentBounds = e.target.getBoundingClientRect();
      const isVisible = elemBounds.top >= parentBounds.top && elemBounds.top < parentBounds.bottom;
      if (isVisible) {
        console.log('loading next page');
        loadPosts(page + 1);
      }
    }
  }

  function loadPosts(pg: number) {
    if (isLoading) {
      console.warn('Skipping loading page; already loading!');
      return;
    }
    let myUserId = authService.getUserId();
    // myUserId = "61e9e3cde9d5a06abb991653"

    page = pg;
    setPage(page);

    if (!page && atBottomOfFeedListElem) {
      atBottomOfFeedListElem.style.display = 'block';
    }

    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    let state = '';
    let sport = '';

    presentLoading(loadingOptions);
    isLoading = true;
    setIsLoading(isLoading);
    console.log('FeedService.getProfileFeed userId: ', myUserId);
    feedService
      .getProfileFeed(myUserId || '')
      .then(res => res.json())
      .then(data => {
        console.log('Feed: ', data);
        setFeed(data.feed.feed);
        setMessages(data.feed.feed);
        if (page > 0) {
          // setMessages((messages || []).concat(data.FeedItems));
        } else {
          // setMessages(data.FeedItems);
        }

        atBottomOfFeedListElem = document.querySelector('#atBottomOfFeedList');

        if ((data.FeedItems || []).length < data.page_size && atBottomOfFeedListElem) {
          atBottomOfFeedListElem.style.display = 'none';
        }

        isLoading = false;
        setIsLoading(isLoading);
        dismissLoading();
      })
      .catch(() => {
        isLoading = false;
        setIsLoading(isLoading);
        dismissLoading();
      });
  }

  //function post() {
  //  console.log("Posting!!!");
  //  let storage: any = window.localStorage.getItem("persistedState");
  //  let user = JSON.parse(storage);

  //  let req = {
  //    user_id: user.user["user_id"],
  //    Data: "This is a new post!",
  //  };
  //  feedService
  //    .post(req, user.user["user_id"])
  //    .then((res) => res.json())
  //    .then((data) => {
  //      console.log("Feed: ", data);
  //    });
  //  loadPosts(0);
  //}

  // const Popover = () => (
  //   <IonContent className="nobo-filter">
  //     <IonSelectOption className="" onClick={ (e) => { e.preventDefault(); setFilter("sports"); filterFeed("sports"); dismiss(); }}>By Sports</IonSelectOption>
  //     <IonContent className="ion-padding" onClick={ (e) => { e.preventDefault(); setFilter("coaches"); filterFeed("coaches"); dismiss(); }}>Coaches</IonContent>
  //     <IonContent className="ion-padding" onClick={ (e) => { e.preventDefault(); setFilter("athletes"); filterFeed("athletes"); dismiss(); }}>Athletes</IonContent>
  //   </IonContent>
  // );

  // const [present, dismiss] = useIonPopover(Popover, {
  //   onDismiss: (data: any, role: string) => dismiss()
  // });

  //function filterFeed() {
  //  console.log("FilterFeed: ", filter);
  //  loadPosts(0);
  //}
  return (
    <IonPage className="home-page">
      <ImageZoom
        show={!!imageZoom}
        imageUrl={imageZoom}
        onClose={() => setImageZoom('')}
      ></ImageZoom>
      <IonContent
        className="home-content"
        style={{ backgroundColor: '#FEFCF7' }}
        scrollY={false}
        scrollEvents={true}
        onIonScrollEnd={e => scroll(e)}
        fullscreen
      >
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="profile-banner-container" style={{ backgroundColor: '#FEFCF7' }}>
          <img className="style-feed-nobo-logo" src="/assets/images/style-feed-nobo-logo.png" />
        </div>
        <div
          onClick={e => {
            e.preventDefault();
            history.push(`/home/my-profile`);
          }}
          className="profile-header-container"
          style={{ backgroundImage: `url('assets/images/style-feed-header.svg')` }}
        ></div>
        <div
          className="profile-create-post"
          onClick={e => {
            e.preventDefault();
            history.push('/home/post-create');
          }}
        >
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_1150_5872)">
              <path
                d="M30.5 36C30.5 32.9624 32.9624 30.5 36 30.5H42.157H45H47.843H54C57.0376 30.5 59.5 32.9624 59.5 36V54C59.5 57.0376 57.0376 59.5 54 59.5H45H36C32.9624 59.5 30.5 57.0376 30.5 54V36Z"
                stroke="black"
                shape-rendering="crispEdges"
              />
            </g>
            <path
              d="M52.0625 45.0312C52.0625 45.5835 51.6148 46.0357 51.0625 46.0357H46.0357V51.0625C46.0357 51.6148 45.5835 52.0625 45.0312 52.0625C44.479 52.0625 44.0268 51.6148 44.0268 51.0625V46.0357H39C38.4477 46.0357 38 45.5835 38 45.0312C38 44.479 38.4477 44.0268 39 44.0268H44.0268V39C44.0268 38.4477 44.479 38 45.0312 38C45.5835 38 46.0357 38.4477 46.0357 39V44.0268H51.0625C51.6148 44.0268 52.0625 44.479 52.0625 45.0312Z"
              fill="black"
            />
            <defs>
              <filter
                id="filter0_d_1150_5872"
                x="0"
                y="0"
                width="90"
                height="90"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="15" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.87451 0 0 0 0 0.87451 0 0 0 0 0.87451 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1150_5872"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1150_5872"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        <IonRow className="style-feed-list-container">
          <IonCol style={{ padding: '0' }}>
            {messages?.length ? (
              <IonList
                lines="none"
                className="nobo-list-background"
                style={{ paddingBottom: '2em', paddingLeft: '64px', paddingRight: '64px' }}
              >
                {messages.map(m => {
                  return (
                    <FeedListItem
                      refreshFeed={() => loadPosts(0)}
                      message={m}
                      zoomAction={(i: number) => {
                        try {
                          if (m && m.images && m.images.length > 0) {
                            let targetIndex = i;
                            let zoomImageUrl = (m.images[0].url || '')
                              .replace('[', '')
                              .replace(']', '')
                              .split("'")
                              .join('')
                              .split(',')[targetIndex];
                            setImageZoom(zoomImageUrl);
                          }
                        } catch (exZoomPicNoExist) {}
                      }}
                    />
                  );
                })}
                <IonItem
                  id="atBottomOfFeedList"
                  style={{ '--background': 'rgb(254, 252, 247)' }}
                  key="bottom"
                  lines="none"
                >
                  <IonRow>
                    <IonCol>Loading...</IonCol>
                  </IonRow>
                </IonItem>
              </IonList>
            ) : (
              // <div>
              //   <div className="no-feed-items-container">
              //     <h3>
              //       It looks like you haven't followed any users yet. Here are
              //       some suggestions for users to follow
              //     </h3>
              //   </div>
              //   {profileMessages.map((m) => (
              //     <ExploreListItem key={m.user_id} profile={m} />
              //   ))}
              // </div>
              <>
                <div
                  className="no-feed-items-container"
                  onClick={e => {
                    e.preventDefault();
                    document.location = '/home/explore';
                  }}
                  key="none"
                ></div>
                {profileMessages.map(m => (
                  <ExploreListItem key={m.user_id} profile={m} />
                ))}
              </>
            )}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default StyleFeed;
