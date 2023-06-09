import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { useHistory } from 'react-router';
import Button from '../components/Button';

import './ListItem.scss';
import { UserService } from '../services/UserService';
import { User } from '../models';
import { listingStore, ListingState } from '../listing-store';

const ListItemTradeConfirm: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  let [experience, setExperience] = useState<string>('women');

  let subscription: any;

  useIonViewWillEnter(() => {
    subscription = listingStore.subscribe((state: ListingState) => {
      console.log('state', state);
      if (!state.product) {
        history.goBack();
        return;
      }
    });

    userService.getMe().then((user: User) => {
      experience = user.experiencePreferences;
      setExperience(experience);
    });
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  return (
    <IonPage className="list-item-page">
      <IonContent>
        <IonGrid className="list-item-content">
          <div className="padding-bottom-container">
            <p className="nobo-list-confirmation-header">ITEM SUBMITTED!</p>
            <p className="nobo-list-confirmation-check">
              <img src="assets/images/checkmark-green.svg" alt="complete" />
            </p>
            <p className="nobo-list-confirmation-sub-header">
              YOUR ITEM HAS BEEN SUBMITTED FOR REVIEW
            </p>
            <p className="nobo-list-confirmation-trade-text">
              Thank you for submitting your luxury product to TheNobo! We will review your listing
              and will provide you with a status update soon!
            </p>
            <h2 className="nobo-list-confirmation-container-trade-header">YOUR NEXT STEPS</h2>
            <IonGrid className="trade-confirmation-container">
              <IonRow>
                <IonCol className="trade-confirmation">
                  <div>
                    <img src="/assets/images/confirm-label.svg" alt="label" />
                  </div>
                  <div className="trade-confirmation-text">
                    Download and print your shipping label.
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="download-container">
                  <div
                    className="download"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();

                      console.log('download shipping label');
                    }}
                  >
                    <div className="download-text">Download</div>
                    <div className="download-image">
                      <img src="/assets/images/download-icon.svg" alt="download" />
                    </div>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="trade-confirmation">
                  <div>
                    <img src="/assets/images/confirm-package.svg" alt="label" />
                  </div>
                  <div className="trade-confirmation-text">
                    Package the item neatly in a box of your choosing, place the shipping label on
                    the box.
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="trade-confirmation">
                  <div>
                    <img src="/assets/images/confirm-ship.svg" alt="label" />
                  </div>
                  <div className="trade-confirmation-text">
                    Drop it off at USPS in a timely manner (within three business days). It will
                    then be shipped to the Buyer.
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="trade-confirmation">
                  <div>
                    <img src="/assets/images/confirm-verify.svg" alt="label" />
                  </div>
                  <div className="trade-confirmation-text">
                    We review the price submitted as part of your item submission. We then verify
                    your product based on our in house data, market demand, age, condition, brand,
                    inventory, and item style.
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
            <Button
              className="nobo-list-btn"
              label="VIEW MY CLOSET"
              large={true}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                history.push('/home/closet/trade');
              }}
            />
            <Button
              className="nobo-list-btn nobo-list-back-home"
              label="BACK TO HOME FEED"
              large={true}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                const url = `/home/explore/${experience}/explore`;
                history.push(url);
              }}
            />
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ListItemTradeConfirm;
