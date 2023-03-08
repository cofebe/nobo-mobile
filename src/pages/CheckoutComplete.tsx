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
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';
import './CheckoutComplete.scss';
import Button from '../components/Button';
import {
  FullOrder,
  User,
} from '../models';
import { UserService } from '../services/UserService';
import { formatPrice, getImageUrl, getCardImage } from '../utils';

const ShoppingCartPage: React.FC = () => {
  const params: any = useParams();
  const history = useHistory();
  const userService = new UserService();
  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartImage, setCartImage] = useState<string>('');
  const [order, setOrder] = useState<FullOrder>();
  const [name, setName] = useState<string>('');
  const [cardBrand, setCardBrand] = useState<string>('');
  const [cardLast4, setCardLast4] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [cardExpMonth, setCardExpMonth] = useState<number>(0);
  const [cardExpYear, setCardExpYear] = useState<number>(0);
  let [experience, setExperience] = useState<string>('women');

  useIonViewWillEnter(() => {

    userService
      .getOrder(params.id)
      .then((order: FullOrder) => {
        setOrder(order);

        setCartImage(order.products[0].images[0].url);
        //console.log('getCart', products);

        setCardBrand(order.charge.source.brand);
        setCardName(order.charge.source.name);
        setCardLast4(order.charge.source.last4);
        setCardExpMonth(order.charge.source.exp_month);
        setCardExpYear(order.charge.source.exp_year);
      });

    userService
      .getMe()
      .then((user: User) => {
        experience = user.experiencePreferences;
        setExperience(experience);
        setName(user.firstName);
      });

    setShowCart(false);
    setShowOrderSummary(true);
  });

  function goToMyPurchases() {
    console.log('go to my purchases');
  }

  return (
    <IonPage className="checkout-complete-container">
      <IonHeader className="cart-header">
        <IonToolbar className="cart-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="title">
                  Purchase Complete!
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="cart-content">
        <div className="thank-container">
          <div className="top">
            <div>
              <img src="assets/images/checkmark-green.svg" alt="order complete" />
            </div>
            <div>Thank you for your order</div>
          </div>
          <div className="text">
            <div>
              Hi {name}, your order has been received. We have notified your seller(s)
              and will update you when your order has been shipped!
            </div>
            <div>
              Please track your order in <span className="link" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToMyPurchases();
              }}>My Purchases!</span>
            </div>
          </div>
        </div>
        {showCart ? (
          <div>
            {order?.products.map(product => (
              <div className="cart-item" key={product._id}>
                <div className="product-image-container">
                  <div className="product-image" style={{ backgroundImage: getImageUrl(product.images[0].url) }}></div>
                </div>
                <div className="product-info-container">
                  <div className="brand">{product.brand}</div>
                  <div className="name">{product.name}</div>
                  {/*<div className="username">
                    Purchased from <span>@{product.vendor.displayName}</span>
                  </div>*/}
                  <div className="price">{formatPrice(product.price)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cart-placeholder">
            <div className="cart-placeholder-item">
              <div className="product-image-container">
                <div className="product-image" style={{ backgroundImage: getImageUrl(cartImage) }}></div>
              </div>
              <div className="cart-placeholder-link">
                <div onClick={(e) => {
                  setShowCart(true);
                }}>View Cart</div>
              </div>
            </div>
          </div>
        )}
        <div className="checkout-payment-item">
          <div className="left">
            <div className="logo-container">
              <img src={getCardImage(cardBrand)} alt="card brand" />
            </div>
          </div>
          <div className="right">
            <div className="name">{cardName}</div>
            <div className="last4">* &nbsp;&nbsp; * &nbsp;&nbsp; * &nbsp;&nbsp; * &nbsp;&nbsp; {cardLast4}</div>
            <div className="expiration">Exp. {cardExpMonth}/{cardExpYear}</div>
          </div>
        </div>
        <div className="order-summary">
          <div className="title">
            <div>Order Summary</div>
            <div><IonIcon icon={showOrderSummary ? caretUpOutline : caretDownOutline} onClick={(e) => {
              setShowOrderSummary(!showOrderSummary);
            }} /></div>
          </div>
          {showOrderSummary ? (
            <div>
              <div className="summary-info">
                <div className="label">Subtotal</div>
                <div className="value">{formatPrice(order?.subtotal || 0)}</div>
              </div>
              <div className="summary-info">
                <div className="label">Shipping</div>
                <div className="value">{formatPrice(order?.shipping || 0)}</div>
              </div>
              <div className="summary-info">
                <div className="label">Sales Tax</div>
                <div className="value">{formatPrice(order?.salesTax || 0)}</div>
              </div>
            </div>
          ) : ''}
          <div className="summary-info total">
            <div className="label">Your Total</div>
            <div className="value">{formatPrice(order?.total || 0)}</div>
          </div>
        </div>
        <div className="footer">
          <div className="button-container">
            <Button label="View My Purchases" large={true} onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              goToMyPurchases();
            }} />
            <Button label="Back to Home Feed" type="secondary" large={true} onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              const url = `/home/explore/${experience}/explore`;
              history.push(url);
            }} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ShoppingCartPage;
