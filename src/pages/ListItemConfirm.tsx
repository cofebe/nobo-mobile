import { useState } from 'react';
import {
  IonContent,
  IonHeader,
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
import { CreateProductResponse, User } from '../models';
import { listingStore, ListingState } from '../listing-store';
import { formatPrice } from '../utils';

const ListItemConfirm: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [product, setProduct] = useState<CreateProductResponse>();
  let [experience, setExperience] = useState<string>('women');

  let subscription: any;

  useIonViewWillEnter(() => {
    subscription = listingStore.subscribe((state: ListingState) => {
      console.log('state', state);
      if (!state.product) {
        history.goBack();
        return;
      }

      setProduct(state.product);
    });

    userService.getMe().then((user: User) => {
      experience = user.experiencePreferences;
      setExperience(experience);
    });
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  console.log('ListItemConfirm', product);

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
            <p className="nobo-list-confirmation-text">
              An email confirmation has been sent to your inbox. You can see the status of the trade
              in your account dashboard.
            </p>
            <div className="nobo-list-confirmation-container">
              <h2 className="nobo-list-confirmation-container-header">WHAT YOU LISTED</h2>
              <img
                className="nobo-list-confirmation-image"
                src={product?.images[0].url}
                alt="Example image"
              />
              <p className="nobo-list-confirmation-container-name">{product?.name}</p>
              <p className="nobo-list-confirmation-container-price">
                {formatPrice(product?.price || 0)}
              </p>
            </div>
            <Button
              className="nobo-list-btn"
              label="VIEW MY SELL CLOSET"
              large={true}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                history.push('/home/closet/sell');
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

export default ListItemConfirm;
