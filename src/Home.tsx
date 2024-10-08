import { useState, useRef } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonContent,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonViewWillEnter,
  isPlatform,
} from '@ionic/react';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import './styles.scss';
import ProfileOverviewPage from './pages/ProfileOverview';
import EditProfilePage from './pages/EditProfile';
import Explore from './pages/Explore';
import MyCloset from './pages/MyCloset';
import TradeCloset from './pages/TradeCloset';
import TradePendingCloset from './pages/TradePendingCloset';
import SellCloset from './pages/SellCloset';
import SellPendingCloset from './pages/SellPendingCloset';
import PostCreate from './pages/PostCreate';
import Notifications from './pages/Notifications';
import Conversations from './pages/Conversations';
import ProductDetail from './pages/ProductDetail';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { NotificationService } from './services/NotificationService';
import { User } from './models';
import ListItemModal from './components/ListItemModal';

import { viewUser } from './util';

const Home: React.FC = () => {
  const history = useHistory();
  const listItemModal = useRef<HTMLIonModalElement>(null);
  const authService = new AuthService();
  const userService = new UserService();
  const notificationService = new NotificationService();
  const [appMode, setAppMode] = useState('home');
  let [userType, setUserType] = useState<string>();
  let [profileURL, setProfileURL] = useState<string>();
  const [experience, setExperience] = useState<string>('women');
  const [unreadCount, setUnreadCount] = useState(0);

  if (!isPlatform('desktop') && !isPlatform('mobileweb')) {
    PushNotifications.requestPermissions().then(result => {
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
          .then(res => res.json())
          .then(data => {
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
        .then(res => res.json())
        .then(data => {
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
    userService
      .getMe()
      .then((user: User) => {
        const userExperience = user.experiencePreferences;
        setExperience(userExperience);
      })
      .catch(err => {
        console.log('Error getting user experience', err);
      });

    userService.getUnreadNotificationCount().then(count => {
      setUnreadCount(count);
    });
    setInterval(() => {
      userService.getUnreadNotificationCount().then(count => {
        setUnreadCount(count);
      });
    }, 60000);
  });

  return (
    <IonContent scrollY={false}>
      <IonTabs className="nav-bar-background">
        <IonRouterOutlet>
          <Redirect exact path="/home" to="/home/nobo-home" />
          <Route exact path="/home/product/:id">
            <ProductDetail />
          </Route>
          <Route exact path="/home/product/sneakers/:id">
            <ProductDetail />
          </Route>
          <Route exact path="/home/product/sneakers/trade/:id">
            <ProductDetail />
          </Route>
          <Route exact path="/home/explore/:sectionCategory/:sectionName">
            <Explore />
          </Route>
          <Route exact path="/home/closet">
            <MyCloset />
          </Route>
          <Route exact path="/home/closet/trade">
            <TradeCloset />
          </Route>
          <Route exact path="/home/closet/trade/pending">
            <TradePendingCloset />
          </Route>
          <Route exact path="/home/closet/sell">
            <SellCloset />
          </Route>
          <Route exact path="/home/closet/sell/pending">
            <SellPendingCloset />
          </Route>
          <Route exact path="/home/notifications">
            <Notifications />
          </Route>
          <Route exact path="/home/messages">
            <Conversations />
          </Route>

          <Route path="/home/profile-overview">
            <ProfileOverviewPage defaultToggled={false} />
          </Route>
          <Route path="/home/my-profile" exact={true}>
            <ProfileOverviewPage defaultToggled={false} />
          </Route>
          <Route path="/home/profile/:id" exact={true}>
            <ProfileOverviewPage defaultToggled={false} myProfile={false} />
          </Route>
          <Route path="/home/style-feed" exact={true}>
            <ProfileOverviewPage defaultToggled={true} />
          </Route>
          <Route path="/home/post-create" exact={true}>
            <PostCreate />
          </Route>
          <Route path="/home/profile-edit" exact={true}>
            <EditProfilePage />
          </Route>
        </IonRouterOutlet>
        <IonTabBar className="nav-bar" slot="bottom">
          <IonTabButton
            tab="home"
            href={`/home/explore/${experience}/explore`}
            selected={appMode === 'home'}
            onClick={e => setActiveTab('home', e)}
          >
            <img
              className="nav-btn"
              src={`assets/images/nobo-home-icon${appMode === 'home' ? '-focus' : ''}.svg`}
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
            href="/home/style-feed"
            selected={appMode === 'stylefeed'}
            onClick={e => setActiveTab('stylefeed', e)}
          >
            <img
              className="nav-btn"
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
            onClick={e => {
              listItemModal.current?.present();
              setActiveTab('list', e);
            }}
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
                className="nav-btn"
                src={`assets/images/nobo-plus-icon${appMode === 'list' ? '-focus' : ''}.png`}
                style={{ width: '1.68rem' }}
                alt="list"
              />
            </div>
          </IonTabButton>
          <IonTabButton
            tab="notifications"
            href="/home/notifications"
            selected={appMode === 'notifications'}
            onClick={e => setActiveTab('notifications', e)}
          >
            <img
              className="nav-btn"
              src={`assets/images/nobo-notifications-icon${
                appMode === 'notifications' ? '-focus' : ''
              }.svg`}
              style={{ width: '1.5rem' }}
              alt="notifications"
            />
            {unreadCount > 0 && <div className="dot"></div>}
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
            href="/home/closet"
            selected={appMode === 'closet'}
            onClick={e => setActiveTab('closet', e)}
          >
            <img
              className="nav-btn"
              src={`assets/images/nobo-closet-icon${appMode === 'closet' ? '-focus' : ''}.svg`}
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
      <ListItemModal
        ref={listItemModal}
        onClose={() => {
          listItemModal.current?.dismiss();
        }}
      />
    </IonContent>
  );
};

export default Home;
