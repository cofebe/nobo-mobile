import FeedListItem from '../components/FeedListItem';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { FeedItem } from '../data/athlete-feed';
import { environment } from '../environments/environment';
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
//import SortWidget from '../components/SortWidget';
import ExploreListItem from '../components/ExploreListItem';

import { FeedService } from '../services/FeedService';
import { ExploreService } from '../services/ExploreService';
import { UserService } from '../services/UserService';
import { SubscriptionService } from '../services/SubscriptionService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import UrpHeader from '../components/UrpHeader';
import { loadingOptions } from '../util';
import { isPlatform } from '@ionic/react';

import ImageZoom from '../components/ImageZoom';
import { Profile } from '../data/profile';

const Feed: React.FC = () => {
  let [profileMessages, setProfileMessages] = useState<Profile[]>([]);
  const exploreService = new ExploreService();
  const userService = new UserService();
  const feedService = new FeedService();
  const history = useHistory();

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
    if (!environment.disableBrowser && isPlatform('ios')) {
      const subscriptionService = new SubscriptionService(new InAppPurchase2());
      subscriptionService.register();
    }
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    console.log('HomeAthlete User: ', user);
    console.log('HomeAthlete UserId: ', user.user['user_id']);

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
      const isVisible =
        elemBounds.top >= parentBounds.top &&
        elemBounds.top < parentBounds.bottom;
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
    feedService
      .getFeed(user.user['user_id'], page /*, filter*/)
      .then((res) => res.json())
      .then((data) => {
        console.log('Feed: ', data);
        if (page > 0) {
          setMessages((messages || []).concat(data.FeedItems));
        } else {
          setMessages(data.FeedItems);
        }

        atBottomOfFeedListElem = document.querySelector('#atBottomOfFeedList');

        if (
          (data.FeedItems || []).length < data.page_size &&
          atBottomOfFeedListElem
        ) {
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

    userService
      .getProfile(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        console.log('Profile: ', data);
        state = data.basic_user_profile.state
          ? data.basic_user_profile.state.String.replace(/"/g, '')
          : '';
        sport = data.athlete_user_profile.primary_sport
          ? data.athlete_user_profile.primary_sport.String
          : '';

        let userType = user.user['user_type'];
        userType = userType?.charAt(0).toUpperCase() + userType?.slice(1);
        let req = {
          user_id: user.user['user_id'],
          account_type: userType ? [userType] : ['Athlete'],
          search: '',
          state: [state],
          school: [''],
          country: [''],
          sport: [sport],
          position: [''],
          class: [''],
          rank: [''],
          awards: [''],
        };

        exploreService
          .search(req, 1)
          .then((res) => {
            if (res) {
              return res.json();
            } else {
              // showError(1)
            }
          })
          .then((data) => {
            console.log('here', data);

            data.users = data.users?.slice(0, 5);

            profileMessages = profileMessages.concat(data.users || []);

            setProfileMessages(profileMessages);
          })
          .catch((err) => {
            console.error('Error:', err);
          });
      })
      .catch((err) => {
        console.error('Error:', err);
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
      <UrpHeader></UrpHeader>
      <IonContent
        className="home-content"
        scrollY={true}
        scrollEvents={true}
        onIonScrollEnd={(e) => scroll(e)}
        fullscreen
      >
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonRow>
          <IonCol style={{ padding: '0' }}>
            {messages?.length ? (
              <IonList
                lines="none"
                className="nobo-list-background"
                style={{ paddingBottom: '2em' }}
              >
                {messages.map((m) => {
                  return (
                    <div key={m.post_id + (m.is_promoted ? 'p' : '')}>
                      <FeedListItem
                        message={m}
                        trackImpressions={m.is_promoted}
                        zoomAction={(i: number) => {
                          try {
                            if (m && m.photo_url && m.photo_url.length > 0) {
                              let targetIndex = i;
                              let zoomImageUrl = (m.photo_url || '')
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
                    </div>
                  );
                })}
                <IonItem id="atBottomOfFeedList" key="bottom" lines="none">
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
                  onClick={(e) => {
                    e.preventDefault();
                    document.location = '/home/explore';
                  }}
                  key="none"
                >
                  <div className="no-feed-items">
                    <h2>No feed items found.</h2>
                    <img
                      height={60}
                      src="assets/images/navigation/nav-explore.svg"
                      alt="Explore"
                    />
                    <div style={{ marginBottom: '8px' }} className="explore">
                      Here are some suggestions for users to follow in your area
                    </div>
                  </div>
                  {/* <div> */}
                  {/* <IonList> */}

                  {/* </IonList> */}
                  {/* </div> */}
                </div>
                {profileMessages.map((m) => (
                  <ExploreListItem key={m.user_id} profile={m} />
                ))}
              </>
            )}
          </IonCol>
          <IonCol className="nobo-desktop">
            <IonList lines="none" className="nobo-list-background">
              <div className="nobo-desktop-messages" key="messages">
                <h3>Messages</h3>
              </div>
              <div className="nobo-desktop-notifications" key="notifications">
                <h3>Notifications</h3>
              </div>
            </IonList>
          </IonCol>
        </IonRow>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonIcon
            onClick={(e) => {
              e.preventDefault();
              history.push('/home/post-create');
            }}
            className="floating-button"
            src="assets/images/create-post.svg"
          ></IonIcon>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
