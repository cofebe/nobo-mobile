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
      // console.log('user', user);
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
          <div
            className="avatar"
            style={{ backgroundImage: `url(${user?.avatar})` }}
            // style={{ backgroundImage: getImageUrl(user?.avatar || '') }}
          ></div>
          <div className="name">
            {user?.firstName} {user?.lastName}
          </div>
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
          Shipping Address
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
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/purchases');
          }}
        >
          My Purchases
        </div>
        <div className="sep"></div>

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
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/trades');
          }}
        >
          My Trades
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
            //history.push('/settings/savings');
          }}
        >
          Savings &amp; Sustainability
        </div>
        <div className="sep"></div>
        <div className="help-container">NEED HELP ?</div>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/help');
          }}
        >
          HELP
        </div>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/shipping-terms');
          }}
        >
          Shipping
        </div>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/return-policy');
          }}
        >
          RETURN POLICY
        </div>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/terms-conditions');
          }}
        >
          TERMS &amp; CONDITIONS
        </div>
        <div
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/settings/faq');
          }}
        >
          FAQ
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
