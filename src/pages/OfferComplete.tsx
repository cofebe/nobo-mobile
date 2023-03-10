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
  IonIcon,
  useIonViewWillEnter,
} from '@ionic/react';
import './OfferComplete.scss';
import Button from '../components/Button';
import { User } from '../models';
import { UserService } from '../services/UserService';

const OfferComplete: React.FC = () => {
  const params: any = useParams();
  const history = useHistory();
  const userService = new UserService();
  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartImage, setCartImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cardBrand, setCardBrand] = useState<string>('');
  const [cardLast4, setCardLast4] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [cardExpMonth, setCardExpMonth] = useState<number>(0);
  const [cardExpYear, setCardExpYear] = useState<number>(0);
  let [experience, setExperience] = useState<string>('women');

  useIonViewWillEnter(() => {
    // userService.getOrder(params.id).then((order: FullOrder) => {
    //   setOrder(order);
    //   setCartImage(order.products[0].images[0].url);
    //   //console.log('getCart', products);
    //   setCardBrand(order.charge.source.brand);
    //   setCardName(order.charge.source.name);
    //   setCardLast4(order.charge.source.last4);
    //   setCardExpMonth(order.charge.source.exp_month);
    //   setCardExpYear(order.charge.source.exp_year);
    // });
    userService.getMe().then((user: User) => {
      experience = user.experiencePreferences;
      setExperience(experience);
      //   setName(user.firstName);
    });
    // setShowCart(false);
    // setShowOrderSummary(true);
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
              <img
                src="assets/images/checkmark-green.svg"
                alt="order complete"
              />
            </div>
            <div>
              You're offer to <span>USERNAME</span> for their{' '}
              <span>PRODUCT NAME</span> was submitted
            </div>
          </div>
          <div>You will only be charged if the offer is accepted</div>
          <div className="text">
            <div>
              Hi {name}, your order has been received. We have notified your
              seller(s) and will update you when your order has been shipped!
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
                // goToMyOffers();
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
