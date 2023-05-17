import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonToolbar,
  useIonViewDidEnter,
  IonTitle,
  IonCheckbox,
  IonButtons,
  IonIcon,
  useIonLoading,
} from '@ionic/react';

import { useHistory } from 'react-router-dom';

import { chevronBackOutline, star } from 'ionicons/icons';

import './ManageSubscription.scss';
import { useState } from 'react';
import { loadingOptions } from '../util';

import { SubscriptionService } from '../services/SubscriptionService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { isPlatform } from '@ionic/react';

const athleteSubscriptionBenefits = [
  'Additional Highlights',
  'Unlimited Messaging',
  'Profile Insights',
  'Related Articles',
  'Email Distribution',
  'Game Schedule',
  'NIL Deals',
  'Personal Training',
];
const coachSubscriptionBenefits = ['Watchlist', 'Unlimited Reach', 'Unlimited Messaging'];
const trainerSubscriptionBenefits = ['Reach', 'Add photos/videos', 'Scout Reports'];

const ManageSubscription: React.FC = () => {
  const history = useHistory();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const btnColor = '#00816D';
  const [isActive, setIsActive] = useState(false);
  let store = new InAppPurchase2();
  const subscriptionService = new SubscriptionService(store);

  let storage: any = window.localStorage.getItem('persistedState');
  let user = JSON.parse(storage);
  const userType = user.user['user_type'];

  let subscriptionPricing = '';
  let subscriptionBenefits = [] as string[];

  if (userType === 'athlete') {
    subscriptionPricing = subscriptionService.getProductPriceString('com.nobo.athlete.1month');
    if (!subscriptionService.getProductPrice('com.nobo.athlete.1month')) {
      subscriptionPricing = '$14.99';
    }
    subscriptionBenefits = athleteSubscriptionBenefits;
  } else if (userType === 'coach') {
    subscriptionPricing = subscriptionService.getProductPriceString(
      'com.nobo.coachrecruiter.1month'
    );
    if (!subscriptionService.getProductPrice('com.nobo.coachrecruiter.1month')) {
      subscriptionPricing = '$29.99';
    }
    subscriptionBenefits = coachSubscriptionBenefits;
  } else if (userType === 'trainer') {
    subscriptionPricing = subscriptionService.getProductPriceString('com.nobo.trainer.1month');
    if (!subscriptionService.getProductPrice('com.nobo.trainer.1month')) {
      subscriptionPricing = '$29.99';
    }
    subscriptionBenefits = trainerSubscriptionBenefits;
  }

  //const store = new InAppPurchase2();
  // let subscriptionService: any;
  // const store = new InAppPurchase2();
  // console.log('store', store);

  useIonViewDidEnter(() => {
    let userSubscriptionId = '';
    if (userType === 'athlete') {
      userSubscriptionId = 'com.nobo.athlete.1month';
    } else if (userType === 'coach') {
      userSubscriptionId = 'com.nobo.coachrecruiter.1month';
    } else if (userType === 'trainer') {
      userSubscriptionId = 'com.nobo.trainer.1month';
    }
    if (isPlatform('ios')) {
      subscriptionService.refreshStore();
      setIsSubscribed(subscriptionService.isSubscribed(userSubscriptionId));
    }
  });

  function subscribe() {
    let userSubscriptionId = '';
    if (userType === 'athlete') {
      userSubscriptionId = 'com.nobo.athlete.1month';
    } else if (userType === 'coach') {
      userSubscriptionId = 'com.nobo.coachrecruiter.1month';
    } else if (userType === 'trainer') {
      userSubscriptionId = 'com.nobo.trainer.1month';
    }
    if (isPlatform('ios')) {
      presentLoading(loadingOptions);
      setTimeout(() => {
        dismissLoading();
      }, 20000);
      subscriptionService
        .subscribe(userSubscriptionId)
        .then((res: any) => {
          console.log('res', res);
          store.when(userSubscriptionId).approved((p: any) => {
            p.verify();
            p.finish();
            setIsSubscribed(true);
            dismissLoading();
          });
          store.when(userSubscriptionId).cancelled(() => {
            console.log('cancelled');
            dismissLoading();
          });
        })
        .catch((err: any) => {
          console.log('err', err);
          dismissLoading();
        });
    } else {
      console.log('Subscribing only works on mobile devices.');
    }
  }

  return (
    <IonPage className="subscription-page">
      <IonHeader>
        <IonToolbar
          style={{
            padding: '50px 10px 10px 10px',
          }}
        >
          <IonButtons slot="start">
            <IonIcon
              onClick={() => {
                history.push('/settings');
              }}
              slot="icon-only"
              icon={chevronBackOutline}
            />
          </IonButtons>
          <IonTitle>Manage Subscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <IonItem lines="none" onClick={() => subscribe()}> */}
        <IonItem
          style={{
            padding: '10px 0',
            margin: '10px 20px',
            border: '1px solid #95FFF3',
            borderRadius: '15px',
          }}
          lines="none"
        >
          <div
            onClick={() => {
              setIsActive(!isActive);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <div>
                <IonCheckbox
                  checked={!isActive}
                  mode="ios"
                  slot="end"
                  style={{
                    '--border-color': '#95FFF3',
                    '--border-color-checked': '#00D6B6',
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 5 }}>
              <IonLabel>
                <h2 style={{ textTransform: 'capitalize' }}>
                  <strong>Standard {userType}</strong>
                </h2>
              </IonLabel>
            </div>
            <div style={{ flex: 1 }}>
              <IonLabel
                style={{
                  color: '#00D6B6',
                }}
              >
                <h1>Free</h1>
              </IonLabel>
            </div>
          </div>
        </IonItem>
        <IonItem
          lines="none"
          style={{
            paddingBottom: '10px',
            margin: '0 20px',
            border: '1px solid #95FFF3',
            alignItems: 'center',
            borderRadius: '15px',
          }}
        >
          <div style={{ width: '100%' }}>
            <div
              onClick={() => {
                setIsActive(!isActive);
              }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div style={{ flex: 1 }}>
                <IonCheckbox
                  checked={isActive}
                  mode="ios"
                  slot="end"
                  style={{
                    flex: 1,
                    '--border-color': '#95FFF3',
                    '--border-color-checked': '#00D6B6',
                  }}
                />
              </div>
              <div style={{ flex: 5 }}>
                <IonLabel>
                  <h2 style={{ textTransform: 'capitalize' }}>
                    <strong>Premium {userType}</strong>
                  </h2>
                </IonLabel>
              </div>
              <div>
                <IonLabel
                  style={{
                    color: '#00D6B6',
                    flex: 1,
                  }}
                >
                  <h2>{subscriptionPricing}/mo</h2>
                </IonLabel>
              </div>
            </div>
            <div>
              {subscriptionBenefits.map(benefit => (
                <div
                  key={benefit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '1rem',
                  }}
                >
                  <div style={{ paddingLeft: '3.5rem' }}>
                    <IonIcon slot="icon-only" icon={star} style={{ color: '#00D6B6' }} />
                  </div>
                  <div style={{ paddingLeft: '1rem', color: '#9BC9C1' }}>{benefit}</div>
                </div>
              ))}
            </div>
            <div>
              <IonButton
                // id="open-subscription-modal"
                onClick={() => subscribe()}
                color={btnColor}
                disabled={!isActive || isSubscribed}
                type="submit"
                expand="block"
                className="nobo-upgrade-plan-btn"
              >
                {isSubscribed ? 'Subscribed' : 'Upgrade Plan'}
              </IonButton>
            </div>
          </div>
        </IonItem>
        {/* <IonModal
          className="subscription-modal"
          ref={modal}
          trigger="open-subscription-modal"
          initialBreakpoint={0.2}
          breakpoints={[0, 0.2]}
        >
          <IonContent>
            <IonList lines="full">
              <IonItem onClick={() => subscribe()}>
                <IonLabel>
                  <h2>Apple Pay</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Crypto Wallet</h2>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal> */}
      </IonContent>
    </IonPage>
  );
};

export default ManageSubscription;
