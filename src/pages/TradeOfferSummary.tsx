import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonIcon,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';
import './TradeOfferSummary.scss';
import Button from '../components/Button';
import TradeFeeModal from '../components/TradeFeeModal';
import TradeHelpModal from '../components/TradeHelpModal';
import { ProductService } from '../services/ProductService';
import { formatPrice, getImageUrl } from '../utils';
import { tradeStore, TradeState } from '../trade-store';

const TradeOfferSummary: React.FC = () => {
  const history = useHistory();
  const productService = new ProductService();
  const [savings, setSavings] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [cart, setCart] = useState<TradeState>(tradeStore.initialState);
  let subscription: any;

  const tradeFeeModal = useRef<HTMLIonModalElement>(null);
  const tradeHelpModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    subscription = tradeStore.subscribe((cart: TradeState) => {
      setCart(cart);

      setSavings((cart.productWanted?.price || 0) - cart.tax - cart.shipping - cart.tradeFee);
    });
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  function submit() {
    console.log('submit');
    productService.createTradeOffer(
      cart.productWanted!,
      cart.productOffered!,
      cart.shippingAddress!,
      cart.paymentMethod?.id!,
    ).then(res => {
      console.log('trade', res);
      tradeStore.reset();
      history.push(`/trade/complete/${res._id}`);
    });
  }

  return (
    <IonPage className="trade-summary-container">
      <IonHeader className="page-header">
        <div className="titles">
          <img
            src="assets/images/arrow-left.svg"
            className="back-arrow"
            alt="back"
            onClick={() => {
              history.goBack();
            }}
          />
          <div className="title">
            Initiate Trade
          </div>
        </div>
      </IonHeader>
      <IonContent className="trade-summary-content">
        <div>
          <div className="trade-summary-header">
            <div>You are about to  offer a trade</div>
            <img
              src="assets/images/question-mark-tooltip.svg"
              alt="what is a trade?"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                tradeHelpModal.current?.present();
              }}
            />
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
                <div className="item-image" style={{
                  backgroundImage: cart.productOffered?.images?.length ? getImageUrl(cart.productOffered.images[0]?.url) : ''
                }}></div>
                <div className="text">
                  <div className="name">{cart.productOffered?.name}</div>
                  <div className="price">{formatPrice(cart.productOffered?.price || 0)}</div>
                </div>
              </IonCol>
              <IonCol className="divider-container" size="2">
                <div className="divider">
                  <img src="assets/images/logo-circle.svg" alt="divider" />
                </div>
              </IonCol>
              <IonCol className="their-item" size="4">
                <div className="item-image" style={{
                  backgroundImage: cart.productWanted?.images?.length ? getImageUrl(cart.productWanted.images[0]?.url) : ''
                }}></div>
                <div className="text">
                  <div className="name">{cart.productWanted?.name}</div>
                  <div className="price">{formatPrice(cart.productWanted?.price || 0)}</div>
                </div>
              </IonCol>
            </IonRow>
            <IonRow className="summary-line">
              <IonCol size="4" offset="1">
                You pay <span className="price">{formatPrice(cart.tradeFee + cart.shipping + cart.tax)}</span>
              </IonCol>
              <IonCol size="4" offset="2">
                They pay <span className="price">{formatPrice(cart.tradeFee + cart.shipping + cart.tax)}</span>
              </IonCol>
            </IonRow>
            <IonRow className="button">
              <IonCol size="6" offset="3">
                <Button label="Send Offer" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  submit();
                }} />
              </IonCol>
            </IonRow>
          </IonGrid>
          <div className="description">
            <p>
              To complete the transaction you will have to pay {cart.tradeFeePercentage * 100}% trade
              transaction fee of {formatPrice(cart.tradeFee)} and {formatPrice(cart.shipping)} shipping
              fee.
            </p>
            <p className="italic">
              Note, you will only be charged once the other party accepts the trade. <span>All Trades
              are Final. No Returns will be accepted if the other party accepts the transaction.</span>
            </p>
          </div>
          <div className="order-summary">
            <div className="title">
              <div>Order Summary</div>
              <div><IonIcon icon={showDetails ? caretUpOutline : caretDownOutline} onClick={(e) => {
                setShowDetails(!showDetails);
              }} /></div>
            </div>
            {showDetails ? (
              <div>
                <div className="summary-info">
                  <div className="label">Total Transaction Value</div>
                  <div className="value">{formatPrice((cart.productWanted?.price || 0) + (cart.productOffered?.price || 0))}</div>
                </div>
                <div className="summary-info">
                  <div className="label">Shipping</div>
                  <div className="value">{formatPrice(cart.shipping)}</div>
                </div>
                <div className="summary-info">
                  <div className="label">Sales Tax</div>
                  <div className="value">{formatPrice(cart.tax)}</div>
                </div>
                <div className="summary-info">
                  <div className="label">
                    <div>TheNOBO Trade Fee ({cart.tradeFeePercentage}%)</div>
                    <img src="assets/images/question-mark-tooltip.svg" alt="fee calculation" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      tradeFeeModal.current?.present();
                    }} />
                  </div>
                  <div className="value">{formatPrice(cart.tradeFee)}</div>
                </div>
                <div className="summary-info savings">
                  <div className="label">Your Savings</div>
                  <div className="value">{formatPrice(savings)}</div>
                </div>
              </div>
            ) : ''}
            <div className="summary-info total">
              <div className="label">Your Total</div>
              <div className="value">{formatPrice(cart.tax + cart.tradeFee + cart.shipping)}</div>
            </div>
          </div>
        </div>
      </IonContent>

      <TradeFeeModal ref={tradeFeeModal} />
      <TradeHelpModal ref={tradeHelpModal} />
    </IonPage>
  );
};

export default TradeOfferSummary;
