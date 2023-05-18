import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import './Settings.scss';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { User } from '../models';
import { getImageUrl } from '../utils';

const Settings: React.FC = () => {
 const history = useHistory();
 const userService = new UserService();
 const authService = new AuthService();
 const [user, setUser] = useState<User>();

 useIonViewWillEnter(() => {
  userService.getMe().then(user => {
   console.log('user', user);
   setUser(user);
  });
 });
 return (
  <IonPage className="settings-container">
   <IonHeader className="settings-header">
    <div
     className="close-btn"
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.goBack();
     }}
    >
     <img src="/assets/images/close-black.svg" alt="close" />
    </div>
    <div className="content">
     {/* <<<<<<< HEAD */}


     <div className="avatar" style={{ backgroundImage:`url(${user?.avatar})` }}></div>
     {/* This div below was not fetching the user image so i try replacing with this one above and it worked */}
     {/* <div className="avatar" style={{ backgroundImage: getImageUrl(user?.avatar || '') }}></div> */}
     <div className="name">
      {user?.firstName} {user?.lastName}
     </div>
     {/* ======= */}
     {/* <div
            className="avatar"
            style={{ backgroundImage: getImageUrl(user?.avatar || '') }}
          ></div>
          <div className="name">
            {user?.firstName} {user?.lastName}
          </div> */}
     {/* >>>>>>> 04990fa4d6b12b251bc4006b8c857ef0b2b3ef26 */}
    </div>
   </IonHeader>
   <IonContent className="settings-content">
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/account');
     }}
    >
     Account Settings
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/shipping');
     }}
    >
     Shipping
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/payment');
     }}
    >
     My Payment Methods
    </div>
    <div className="sep"></div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/trades');
     }}
    >
     My Trades
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/purchases');
     }}
    >
     My Purchases
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/sales');
     }}
    >
     My Sales
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/offers');
     }}
    >
     My Offers
    </div>
    <div className="sep"></div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/returns');
     }}
    >
     My Returns
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/withdraw');
     }}
    >
     Withdrawal Requests
    </div>
    <div
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      history.push('/settings/savings');
     }}
    >
     Savings &amp; Sustainability
    </div>
    <div
     className="logout"
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      authService.logout();
      history.push('/');
     }}
    >
     <div>Logout</div>
     <img src="/assets/images/logout.svg" alt="logout" />
    </div>
    <div
     className="delete-account"
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('delete account');
     }}
    >
     Delete Account
    </div>
   </IonContent>
  </IonPage>
 );
};

export default Settings;
