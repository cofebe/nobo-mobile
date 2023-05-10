import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import './OfferComplete.scss';
import Button from '../components/Button';
import { User, Product } from '../models';
import { UserService } from '../services/UserService';
import { ProductService } from '../services/ProductService';

const OfferComplete: React.FC = () => {
  const params: any = useParams();
  const history = useHistory();
  const userService = new UserService();
  const productService = new ProductService();
  const [product, setProduct] = useState<Product>();
  let [experience, setExperience] = useState<string>('women');

  useIonViewWillEnter(() => {
    console.log('params id', params.id);
    productService
      .getProduct(params.id)
      .then((product: any) => {
        console.log('product', product);
        console.log('This is the history ', history);
        setProduct(product.product);
      })
      .catch((err: any) => {
        console.log('err', err);
      });
    userService.getMe().then((user: User) => {
      experience = user.experiencePreferences;
      setExperience(experience);
    });
  });

  return (
    <IonPage className="offer-complete-container">
      <IonHeader className="offer-header">
        <IonToolbar className="offer-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="title">Offer Submitted!</div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="offer-content">
        <div className="thank-container">
          <div className="top">
            <div>
              <img src="assets/images/checkmark-green.svg" alt="order complete" />
            </div>
            <div className="offer-submitted">
              You're offer to{' '}
              <span
                onClick={() => {
                  history.push(`/home/profile/${product?.vendor._id}`);
                }}
                className="offer-owner"
              >
                @{product?.vendor?.displayName}
              </span>{' '}
              for their <span className="primary-color">{product?.name}</span> was submitted
            </div>
          </div>
          <div className="offer-card-charged-warning">
            YOU WILL ONLY BE CHARGED IF THE OFFER IS ACCEPTED
          </div>
          <div className="text">
            <div>
              If the other party accepts your request, you will be charged and the product will be
              shipped. An email notification, with your offer details has been sent to your inbox.
              You can always check the status of your offer in YOUR OFFERS.
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="button-container">
            <Button
              label="View My Offers"
              large={true}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
            <Button
              label="Back to Home Feed"
              type="secondary"
              large={true}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `/home/explore/${experience}/explore`;
                history.push(url);
              }}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OfferComplete;
