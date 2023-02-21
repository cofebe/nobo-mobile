import { useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonContent,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonViewWillEnter,
} from '@ionic/react';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import PromotePost from './pages/PromotePost';
import PostDetailLikes from './pages/PostDetailLikes';
import PostStats from './pages/PostStats';
import Roles from './pages/Roles';
import Logo from './pages/Logo';
import './pages/URP.css';
import ProfileAthletes from './pages/ProfileAthletes';
import ProfileCoaches from './pages/ProfileCoaches';
import Explore from './pages/Explore';
import ExploreList from './pages/ExploreList';
import ProfileTrainer from './pages/ProfileTrainer';
import ProfileOrganization from './pages/ProfileOrganization';
import PostCreate from './pages/PostCreate';
import Connections from './pages/Connections';
import PendingConnections from './pages/PendingConnections';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Watchlist from './pages/Watchlist';
import ProfileInsights from './pages/ProfileInsights';
import { isPlatform } from '@ionic/react';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports.js';
import SignUpAthlete from './pages/SignUpAthlete';
import { environment } from './environments/environment';
import SignUpCoach from './pages/SignUpCoach';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { NotificationService } from './services/NotificationService';
import SignUpTrainer from './pages/SignUpTrainer';

import { viewUser } from './util';
import SignUpOrganization from './pages/SignUpOrganization';
import AllOrganizations from './pages/AllOrganizations';
import NoboHomePage from './pages/NoboHomePage';

Amplify.configure(awsconfig);

const Home: React.FC = () => {
  const history = useHistory();
  const authService = new AuthService();
  const userService = new UserService();
  const notificationService = new NotificationService();
  const [appMode, setAppMode] = useState('home');
  let [userType, setUserType] = useState<string>();
  let [profileURL, setProfileURL] = useState<string>();

  const isDesktop = isPlatform('desktop');
  const isMobileWeb = isPlatform('mobileweb');
  let isBrowser = isDesktop || isMobileWeb;
  if (environment.disableBrowser) {
    isBrowser = false;
  }
  const navbarLocation = isDesktop ? 'top' : 'bottom';

  if (!isDesktop && !isMobileWeb) {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        console.log('Push Granted');
        PushNotifications.register();
      } else {
        console.log('Push Denied');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      let user = userService.getUserCache();
      let req = {
        device_token: token.value,
      };
      try {
        userService
          .setUserDeviceToken(user.user.user_id, req)
          .then((res) => res.json())
          .then((data) => {
            console.log('Success setUserDeviceToken');
          });
      } catch (err) {
        console.log('Error: ', err);
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        notificationService.incrementNotifcationCount();
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const data = notification.notification.data;
        if (
          data !== undefined &&
          data.FromUserId !== undefined &&
          data.FromUserType !== undefined
        ) {
          viewUser(history, data.FromUserId, data.FromUserType);
        }
      }
    );

    PushNotifications.removeAllDeliveredNotifications();
  }

  function isPublic(pathname: string) {
    return (
      pathname.startsWith('/home/athlete-profile/') ||
      pathname.startsWith('/home/coach-profile/') ||
      pathname.startsWith('/home/trainer-profile/') ||
      pathname.startsWith('/home/explore') ||
      pathname.startsWith('/home/post-detail') ||
      pathname === '/'
    );
  }

  // Auth.currentAuthenticatedUser({
  //   bypassCache: false,
  // }).catch((err) => {
  //   console.log('Error getting current authenticated user:', err);
  //   if (isBrowser && isPublic(window.location.pathname)) {
  //     // do nothing; allow anonymous access
  //     return;
  //   }
  //   window.location.href = '/login';
  // });

  function setActiveTab(name: string, ev?: Event) {
    console.log('setActiveTab', name);
    setAppMode(name);
    if (ev) {
      ev.preventDefault();
    }
  }

  function getProfileURL(userType: string | undefined) {
    if (userType === 'athlete') {
      return '/home/my-athlete-profile';
    } else if (userType === 'coach') {
      return '/home/my-coach-profile';
    } else if (userType === 'trainer') {
      return '/home/my-trainer-profile';
    }
  }

  useIonViewWillEnter(() => {
    const user = authService.getUserData();
    let userId = 0;
    if (user?.user) {
      userType = user.user['user_type'];
      setUserType(userType);

      userId = user.user['user_id'];
    }

    const url = getProfileURL(userType);
    //console.log('ionViewWillEnter', 'url', url, 'userId', userId, 'userType', userType);
    if (url) {
      setProfileURL(url);
    } else if (userId) {
      // we have to load the user to get the type
      userService
        .getProfile(userId)
        .then((res) => res.json())
        .then((data) => {
          const userData = {
            user_id: data.user_id,
            user_type: data.user_type.String,
          };
          authService.setUserData(userData);

          userType = data.user_type;
          setUserType(userType);

          profileURL = getProfileURL(userType);
          setProfileURL(profileURL);
        });
    }

    console.log('ionViewWillEnter', history.location.pathname);
    if (history.location.pathname.includes('explore')) {
      setActiveTab('explore');
    } else if (
      history.location.pathname === '/home/messages' ||
      history.location.pathname.startsWith('/home/chat/')
    ) {
      setActiveTab('messages');
    } else if (
      history.location.pathname === '/home/connections' ||
      history.location.pathname === '/home/watchlist'
    ) {
      setActiveTab('connections');
    } else if (
      history.location.pathname.match('home/my-athlete-profile$') ||
      history.location.pathname.match('home/my-coach-profile$') ||
      history.location.pathname.match('home/my-trainer-profile$')
    ) {
      setActiveTab('my-profile');
    } else {
      setActiveTab('home');
    }
  });

  return (
    <IonContent scrollY={false}>
      <IonTabs className="nobo-nav-bar-background">
        {isBrowser ? (
          <IonRouterOutlet>
            <Route path="/home/athlete-profile/:id" exact={true}>
              <ProfileAthletes myProfile={false} />
            </Route>
            <Route path="/home/coach-profile/:id" exact={true}>
              <ProfileCoaches myProfile={false} />
            </Route>
            <Route path="/home/trainer-profile/:id" exact={true}>
              <ProfileTrainer myProfile={false} />
            </Route>
            <Route path="/home/organization-profile/:id" exact={true}>
              <ProfileOrganization myProfile={false} />
            </Route>
            <Route exact path="/home/explore">
              <Explore />
            </Route>
            <Route exact path="/home/explore/list">
              <ExploreList />
            </Route>
            <Route exact path="/home/post-detail/:id/likes">
              <PostDetailLikes />
            </Route>
            <Route exact path="/home/post-detail/:id">
              <PostDetail />
            </Route>
            <Route>
              <Logo />
            </Route>
          </IonRouterOutlet>
        ) : (
          <IonRouterOutlet>
            <Redirect exact path="/home" to="/home/nobo-feed" />
            {/* <Redirect exact path="/home/athletes" to="/home/feed" /> */}
            <Route exact path="/home/nobo-feed">
              <NoboHomePage />
            </Route>
            <Route exact path="/home/post-promote/:id">
              <PromotePost />
            </Route>
            <Route exact path="/home/post-detail/:id/likes">
              <PostDetailLikes />
            </Route>
            <Route exact path="/home/post-detail/:id">
              <PostDetail />
            </Route>
            <Route exact path="/home/post-stats/:id">
              <PostStats />
            </Route>
            <Route exact path="/home/profile-insights/:id">
              <ProfileInsights />
            </Route>
            <Route exact path="/home/edit-coach">
              <SignUpCoach editMode={true} />
            </Route>
            <Route exact path="/home/edit-coach/:id">
              <SignUpCoach editMode={true} />
            </Route>
            <Route exact path="/home/edit-trainer">
              <SignUpTrainer editMode={true} />
            </Route>
            <Route exact path="/home/edit-trainer/:id">
              <SignUpTrainer editMode={true} />
            </Route>
            <Route exact path="/home/edit-athlete">
              <SignUpAthlete editMode={true} />
            </Route>
            <Route exact path="/home/edit-athlete/:id">
              <SignUpAthlete editMode={true} />
            </Route>
            <Route path="/home/my-athlete-profile" exact={true}>
              <ProfileAthletes myProfile={true} />
            </Route>
            <Route path="/home/athlete-profile/:id" exact={true}>
              <ProfileAthletes myProfile={false} />
            </Route>
            <Route path="/home/my-trainer-profile" exact={true}>
              <ProfileTrainer myProfile={true} />
            </Route>
            <Route path="/home/trainer-profile/:id" exact={true}>
              <ProfileTrainer myProfile={false} />
            </Route>
            <Route path="/home/my-coach-profile" exact={true}>
              <ProfileCoaches myProfile={true} />
            </Route>
            <Route path="/home/coach-profile/:id" exact={true}>
              <ProfileCoaches myProfile={false} />
            </Route>
            <Route path="/home/all-organizations" exact={true}>
              <AllOrganizations />
            </Route>
            <Route path="/home/organization-profile" exact={true}>
              <ProfileOrganization myProfile={true} />
            </Route>
            <Route path="/home/organization-profile/:id" exact={true}>
              <ProfileOrganization myProfile={false} />
            </Route>
            <Route exact path="/home/add-organization/:id">
              <SignUpOrganization editMode={false} />
            </Route>
            <Route exact path="/home/edit-organization">
              <SignUpOrganization editMode={true} />
            </Route>
            <Route exact path="/home/edit-organization/:id">
              <SignUpOrganization editMode={true} />
            </Route>
            <Route path="/home/roles">
              <Roles />
            </Route>
            <Route exact path="/home/explore">
              <Explore />
            </Route>
            <Route exact path="/home/explore/list">
              <ExploreList />
            </Route>
            <Route exact path="/home/messages">
              <Messages />
            </Route>
            <Route exact path="/home/connections">
              <Connections />
            </Route>
            <Route exact path="/home/connections/pending">
              <PendingConnections />
            </Route>
            <Route exact path="/home/notifications">
              <Notifications />
            </Route>
            <Route exact path="/home/watchlist">
              <Watchlist />
            </Route>
            {/* <Route exact path="/home">
              <Redirect to="/home/feed" />
            </Route> */}
            <Route path="/home/post-create" exact={true}>
              <PostCreate />
            </Route>
          </IonRouterOutlet>
        )}
        <IonTabBar
          className={'nobo-nav-bar ' + (isDesktop ? 'desktop' : '')}
          slot={navbarLocation}
        >
          {isBrowser ? (
            <IonTabButton
              tab="logo"
              href="/home/explore"
              className="tab-bar-logo"
              selected={false}
              onClick={(e) => setActiveTab('home', e)}
            >
              <img
                src="assets/images/nobo_logo_rounded_small.png"
                alt="URP+"
                style={{ width: '42px' }}
              />
            </IonTabButton>
          ) : (
            ''
          )}
          {!isBrowser ? (
            <IonTabButton
              tab="home"
              // href="/home/feed"
              selected={appMode === 'home'}
              onClick={(e) => setActiveTab('home', e)}
            >
              <img
                className="nobo-nav-btn"
                src={`assets/images/nobo-home-icon${
                  appMode === 'home' ? '-focus' : ''
                }.svg`}
                style={{ width: '1.62rem' }}
                alt="home"
              />
              {appMode === 'home' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    fontSize: 8,
                    fontFamily: 'Nunito Sans',
                    fontWeight: 600,
                  }}
                >
                  HOME
                </div>
              )}
            </IonTabButton>
          ) : (
            ''
          )}
          {!isBrowser ? (
            <IonTabButton
              tab="stylefeed"
              // href="/home/explore"
              selected={appMode === 'stylefeed'}
              onClick={(e) => setActiveTab('stylefeed', e)}
            >
              <img
                className="nobo-nav-btn"
                src={`assets/images/nobo-style-feed-icon${
                  appMode === 'stylefeed' ? '-focus' : ''
                }.svg`}
                style={{ width: '1.31rem' }}
                alt="stylefeed"
              />
              {appMode === 'stylefeed' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    fontSize: 8,
                    fontFamily: 'Nunito Sans',
                    fontWeight: 600,
                  }}
                >
                  STYLE FEED
                </div>
              )}
            </IonTabButton>
          ) : (
            ''
          )}
          {!isBrowser ? (
            <IonTabButton
              tab="list"
              // href="/home/messages"
              selected={appMode === 'list'}
              onClick={(e) => setActiveTab('list', e)}
            >
              <div
                style={{
                  height: 50,
                  width: 50,
                  boxShadow: '0px 0px 16px #dfdfdf',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: appMode === 'list' ? '#d6980e' : '#fff',
                }}
              >
                <img
                  className="nobo-nav-btn"
                  src={`assets/images/nobo-plus-icon${
                    appMode === 'list' ? '-focus' : ''
                  }.png`}
                  style={{ width: '1.68rem' }}
                  alt="list"
                />
              </div>
            </IonTabButton>
          ) : (
            ''
          )}
          {!isBrowser ? (
            <IonTabButton
              tab="notifications"
              // href="/home/connections"
              selected={appMode === 'notifications'}
              onClick={(e) => setActiveTab('notifications', e)}
            >
              <img
                className="nobo-nav-btn"
                src={`assets/images/nobo-notifications-icon${
                  appMode === 'notifications' ? '-focus' : ''
                }.svg`}
                style={{ width: '1.5rem' }}
                alt="notifications"
              />
              {appMode === 'notifications' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    fontSize: 8,
                    fontFamily: 'Nunito Sans',
                    fontWeight: 600,
                  }}
                >
                  NOTIFICATIONS
                </div>
              )}
            </IonTabButton>
          ) : (
            ''
          )}
          {!isBrowser ? (
            <IonTabButton
              tab="closet"
              href={profileURL}
              selected={appMode === 'closet'}
              onClick={(e) => setActiveTab('closet', e)}
            >
              <img
                className="nobo-nav-btn"
                src={`assets/images/nobo-closet-icon${
                  appMode === 'closet' ? '-focus' : ''
                }.svg`}
                style={{ width: '1.18rem' }}
                alt="profile"
              />
              {appMode === 'closet' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    fontSize: 8,
                    fontFamily: 'Nunito Sans',
                    fontWeight: 600,
                  }}
                >
                  CLOSET
                </div>
              )}
            </IonTabButton>
          ) : (
            ''
          )}
        </IonTabBar>
      </IonTabs>
    </IonContent>
  );
};

export default Home;
