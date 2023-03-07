import { useState, useEffect, useRef } from 'react';
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
} from '@ionic/react';
import './CheckoutPayment.scss';
import Button from '../components/Button';
import {
  Address,
  PaymentMethod,
  PaymentMethodsResponse,
} from '../models';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';
import { UserService } from '../services/UserService';
import CreatePaymentMethodModal from '../components/CreatePaymentMethodModal';

const CheckoutPayment: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
      setCart(cart);

      if (cart.total === 0) {
        history.goBack();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useIonViewWillEnter(() => {
    userService
      .getPaymentMethods()
      .then((res: PaymentMethodsResponse) => {
        setPaymentMethods(res.cards);

        if (!cart.paymentMethod) {
          const pm = res.cards.find(c => c.id === res.customer.default_source);
          if (pm) {
            shoppingCartStore.setPaymentMethod(pm);
          }
        }
      });
  });

  function select(pm: PaymentMethod) {
    shoppingCartStore.setPaymentMethod(pm);
  }

  function addNew() {
    modal.current?.present();
  }

  function next() {
    history.push('/checkout/summary');
  }

  function getCardImage(brand: string): string {
    switch (brand) {
      case 'MasterCard':
      case 'mastercard':
      case 'mc':
        return 'assets/images/cc-mastercard.svg';
      case 'Discover':
      case 'discover':
        return 'assets/images/cc-discover.svg';
      case 'American Express':
      case 'AMEX':
      case 'amex':
        return 'assets/images/cc-amex.svg';
      case 'Visa':
      case 'visa':
      default:
        return 'assets/images/cc-visa.svg';
    }
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
                    <img src={getCardImage(pm.brand)} />
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
                shoppingCartStore.setPaymentMethod(pm);
              }
            }
            modal.current?.dismiss();
          });
      }} />
    </IonPage>
  );
};

export default CheckoutPayment;
