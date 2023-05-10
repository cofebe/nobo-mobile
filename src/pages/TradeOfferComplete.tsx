import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonContent,
  IonToolbar,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import './TradeOfferComplete.scss';
import Button from '../components/Button';
import { Product } from '../models';
import { UserService } from '../services/UserService';
import { formatPrice, getImageUrl } from '../utils';

const TradeOfferComplete: React.FC = () => {
  const params: any = useParams();
  const history = useHistory();
  const userService = new UserService();
  const [payment, setPayment] = useState<number>(0);
  const [productWanted, setProductWanted] = useState<Product>();
  const [productOffered, setProductOffered] = useState<Product>();
  const [experience, setExperience] = useState<string>('women');

  useIonViewWillEnter(() => {
    userService.getMyTrades().then(res => {
      const trade = res.sent.find(t => t._id === params.id);
      if (!trade) {
        window.alert('Unable to find trade!');
        return;
      }

      setProductWanted(trade.products.requested as Product);
      setProductOffered(trade.products.offered as Product);
      setPayment(trade.salesTax.initiator.order_total_amount);
    });

    userService.getMe().then(user => {
      setExperience(user.experiencePreferences);
    });
  });

  return (
    <IonPage className="trade-complete-container">
      <IonHeader className="cart-header">
        <IonToolbar className="cart-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="title">Trade Offer Sent!</div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="trade-complete-content">
        <div>
          <div className="thank-container">
            <div className="top">
              <div>
                <img src="assets/images/checkmark-green.svg" alt="order complete" />
              </div>
              <div>Your Payment Authorization was Successful</div>
            </div>
            <div className="text">
              <p>
                Once the other party accepts the trade, you will be charged and this ‘new for you’
                product will be shipped.
              </p>
              <p>
                An email notification, with your trade transactions order details, has been sent to
                your inbox. You can always check the status of the trade in your account dashboard.
              </p>
            </div>
          </div>
          <IonGrid className="items">
            <IonRow className="header">
              <IonCol size="4" offset="1">
                Your Item
              </IonCol>
              <IonCol size="4" offset="2">
                Their Item
              </IonCol>
            </IonRow>
            <IonRow className="data">
              <IonCol className="your-item" size="4" offset="1">
                <div
                  className="item-image"
                  style={{
                    backgroundImage: productOffered?.images?.length
                      ? getImageUrl(productOffered.images[0]?.url)
                      : '',
                  }}
                ></div>
                <div className="text">
                  <div className="name">{productOffered?.name}</div>
                  <div className="price">{formatPrice(productOffered?.price || 0)}</div>
                </div>
              </IonCol>
              <IonCol className="divider-container" size="2">
                <div className="divider">
                  <img src="assets/images/logo-circle.svg" alt="divider" />
                </div>
              </IonCol>
              <IonCol className="their-item" size="4">
                <div
                  className="item-image"
                  style={{
                    backgroundImage: productWanted?.images?.length
                      ? getImageUrl(productWanted.images[0]?.url)
                      : '',
                  }}
                ></div>
                <div className="text">
                  <div className="name">{productWanted?.name}</div>
                  <div className="price">{formatPrice(productWanted?.price || 0)}</div>
                </div>
              </IonCol>
            </IonRow>
            <IonRow className="summary-line">
              <IonCol size="4" offset="1">
                You pay <span className="price">{formatPrice(payment)}</span>
              </IonCol>
              <IonCol size="4" offset="2">
                They pay <span className="price">{formatPrice(payment)}</span>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div className="buttons">
            <Button
              label="View My Trades"
              large={true}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                console.log('go to my trades');
              }}
            />
            <Button
              label="Back to Home Feed"
              large={true}
              type="secondary"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                history.push(`/home/explore/${experience}/explore`);
              }}
            />
          </div>
          <div className="thanks">Thanks for trading with us!</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TradeOfferComplete;
