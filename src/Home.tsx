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
//import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import PromotePost from './pages/PromotePost';
import PostDetailLikes from './pages/PostDetailLikes';
import PostStats from './pages/PostStats';
import Roles from './pages/Roles';
import './pages/URP.css';
import ProfileAthletes from './pages/ProfileAthletes';
import Explore from './pages/Explore';
import ExploreList from './pages/ExploreList';
import PostCreate from './pages/PostCreate';
import Connections from './pages/Connections';
import PendingConnections from './pages/PendingConnections';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Watchlist from './pages/Watchlist';
import ProfileInsights from './pages/ProfileInsights';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { Amplify /*, Auth*/ } from 'aws-amplify';
import awsconfig from './aws-exports.js';
import SignUpAthlete from './pages/SignUpAthlete';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { NotificationService } from './services/NotificationService';

import { viewUser } from './util';
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
        <IonRouterOutlet>
          <Redirect exact path="/home" to="/home/nobo-home" />
          {/* <Redirect exact path="/home/athletes" to="/home/feed" /> */}
          <Route exact path="/home/nobo-home">
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
        <IonTabBar className="nobo-nav-bar">
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
        </IonTabBar>
      </IonTabs>
    </IonContent>
  );
};

export default Home;
