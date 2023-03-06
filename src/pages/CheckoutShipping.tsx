import { useState, useEffect } from 'react';
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
import './CheckoutShipping.scss';
import Button from '../components/Button';
import {
  Address,
  User,
} from '../models';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';
import { UserService } from '../services/UserService';

const CheckoutShipping: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
      setCart(cart);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useIonViewWillEnter(() => {
    userService
      .getMe()
      .then((user: User) => {
        setShippingAddresses(user.shippingAddress);
      });
  });

  function select(addr: Address) {
    shoppingCartStore.setShippingAddress(addr);
  }

  function addNew() {
    console.log('addNew');
  }

  function next() {
    history.push('/checkout/payment');
  }

  return (
    <IonPage className="checkout-shipping-container">
      <IonHeader className="checkout-shipping-header">
        <IonToolbar className="checkout-shipping-header-toolbar">
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

                  Shipping Address
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="checkout-shipping-content" scrollY={false}>
        <div className="add-container" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addNew();
        }}>
          <div>
            <img src="/assets/images/arrow-left.svg" alt="add shipping address" />
          </div>
          <div>
            New Address
          </div>
        </div>
        {shippingAddresses.length ? (
          <div>
            {shippingAddresses.map(addr => (
              <div className={'checkout-shipping-item ' + (cart.shippingAddress?._id === addr._id ? 'selected' : '')} key={addr._id} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cart.shippingAddress?._id !== addr._id) {
                    select(addr);
                  }
                }}>
                <div className="select">
                  <img src={cart.shippingAddress?._id === addr._id ? '/assets/images/checkmark-checked.svg' : '/assets/images/checkmark-unchecked.svg'} alt="select" />
              </div>
                <div className="name">{addr.firstName} {addr.lastName}</div>
                <div className="address1">{addr.address1}</div>
                {addr.address2 ? (
                  <div className="address2">{addr.address2}</div>
                ) : ''}
                <div className="city">{addr.city}</div>
                <div className="state">{addr.state}</div>
                <div className="zip">{addr.postalCode}</div>
                <div className="phone">{addr.phone}</div>
              </div>
            ))}
            <div className="footer">
              <div className="button-container">
                <Button label="Next" large={true} onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            Your cart is empty!
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CheckoutShipping;
