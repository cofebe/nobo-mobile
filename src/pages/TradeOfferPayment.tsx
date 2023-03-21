import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import './TradeOfferPayment.scss';
import Button from '../components/Button';
import {
  PaymentMethod,
  PaymentMethodsResponse,
} from '../models';
import { tradeStore, TradeState } from '../trade-store';
import { UserService } from '../services/UserService';
import CreatePaymentMethodModal from '../components/CreatePaymentMethodModal';
import { getCardImage } from '../utils';

const TradeOfferPayment: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [cart, setCart] = useState<TradeState>(tradeStore.initialState);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  let subscription: any;

  const modal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    subscription = tradeStore.subscribe((cart: TradeState) => {
      if (cart.isInitial) {
        return;
      }

      setCart(cart);
    });

    userService
      .getPaymentMethods()
      .then((res: PaymentMethodsResponse) => {
        setPaymentMethods(res.cards);

        if (!cart.paymentMethod) {
          const pm = res.cards.find(c => c.id === res.customer.default_source);
          if (pm) {
            tradeStore.setPaymentMethod(pm);
          }
        }
      });
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  function select(pm: PaymentMethod) {
    tradeStore.setPaymentMethod(pm);
  }

  function addNew() {
    modal.current?.present();
  }

  function next() {
    history.push('/trade/summary');
  }

  return (
    <IonPage className="checkout-payment-container">
      <IonHeader className="checkout-payment-header">
        <IonToolbar className="checkout-payment-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="title">
                  <div className="back-button" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.goBack();
                  }}>
                    <img src="assets/images/arrow-left.svg" alt="back" />
                  </div>

                  Payment
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="checkout-payment-content" scrollY={false}>
        <div className="add-container" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addNew();
        }}>
          <div>
            <img src="assets/images/add-square.svg" alt="add shipping address" />
          </div>
          <div>
            New Card
          </div>
        </div>
        {paymentMethods.length ? (
          <div>
            {paymentMethods.map(pm => (
              <div className={'checkout-payment-item ' + (cart.paymentMethod?.id === pm.id ? 'selected' : '')} key={pm.id} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cart.paymentMethod?.id !== pm.id) {
                    select(pm);
                  }
                }}>
                <div className="left">
                  <div className="logo-container">
                    <img src={getCardImage(pm.brand)} alt="card brand" />
                  </div>
                </div>
                <div className="right">
                  <div className="select">
                    <img src={cart.paymentMethod?.id === pm.id ? '/assets/images/checkmark-checked.svg' : '/assets/images/checkmark-unchecked.svg'} alt="select" />
                  </div>
                  <div className="name">{pm.name}</div>
                  <div className="last4">* &nbsp;&nbsp; * &nbsp;&nbsp; * &nbsp;&nbsp; * &nbsp;&nbsp; {pm.last4}</div>
                  <div className="expiration">Exp. {pm.exp_month}/{pm.exp_year}</div>
                </div>
              </div>
            ))}
            <div className="footer">
              <div className="button-container">
                <Button label="Next" large={true} disabled={!cart.paymentMethod} onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            No payment methods defined!
          </div>
        )}
      </IonContent>

      <CreatePaymentMethodModal ref={modal} onClose={() => {
        console.log('add payment method');
        userService
          .getPaymentMethods()
          .then((res: PaymentMethodsResponse) => {
            setPaymentMethods(res.cards);

            if (!cart.paymentMethod) {
              const pm = res.cards.find(c => c.id === res.customer.default_source);
              if (pm) {
                tradeStore.setPaymentMethod(pm);
              }
            }
            modal.current?.dismiss();
          });
      }} />
    </IonPage>
  );
};

export default TradeOfferPayment;
