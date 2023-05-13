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
import './TradeOfferShipping.scss';
import Button from '../components/Button';
import { Address, TaxShippingResponse, User } from '../models';
import { tradeStore, TradeState } from '../trade-store';
import { UserService } from '../services/UserService';
import { ProductService } from '../services/ProductService';
import CreateShippingAddressModal from '../components/CreateShippingAddressModal';

const TradeOfferShipping: React.FC = () => {
 const history = useHistory();
 const userService = new UserService();
 const productService = new ProductService();
 const [cart, setCart] = useState<TradeState>(tradeStore.initialState);
 const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
 let subscription: any;

 const modal = useRef<HTMLIonModalElement>(null);

 useIonViewWillEnter(() => {
  subscription = tradeStore.subscribe((cart: TradeState) => {
   if (cart.isInitial) {
    return;
   }

   setCart(cart);
  });

  userService.getMe().then((user: User) => {
   setShippingAddresses(user.shippingAddress);

   if (!cart.shippingAddress) {
    const addr = user.shippingAddress.find(a => a.default);
    if (addr) {
     tradeStore.setShippingAddress(addr);
    }
   }
  });
 });

 useIonViewWillLeave(() => {
  subscription?.unsubscribe();
 });

 function select(addr: Address) {
  tradeStore.setShippingAddress(addr);
 }

 function addNew() {
  modal.current?.present();
 }

 function next() {
  productService
   .getTaxAndShipping(cart.shippingAddress!, cart.productOffered?._id, cart.productWanted?._id)
   .then((res: TaxShippingResponse) => {
    tradeStore.beginUpdate();
    tradeStore.setTax(res.salesTax);
    tradeStore.setShipping(res.shipping);
    tradeStore.endUpdate();

    history.push('/trade/payment');
   });
 }

 return (
  <IonPage className="trade-shipping-container">
   <IonHeader className="trade-shipping-header">
    <IonToolbar className="trade-shipping-header-toolbar">
     <IonGrid>
      <IonRow>
       <IonCol size="12">
        <div className="title">
         <div
          className="back-button"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           history.goBack();
          }}
         >
          <img src="assets/images/arrow-left.svg" alt="back" />
         </div>
         Shipping Address
        </div>
       </IonCol>
      </IonRow>
     </IonGrid>
    </IonToolbar>
   </IonHeader>
   <IonContent className="trade-shipping-content" scrollY={false}>
    <div
     className="add-container"
     onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      addNew();
     }}
    >
     <div>
      <img src="assets/images/add-square.svg" alt="add shipping address" />
     </div>
     <div>New Address</div>
    </div>
    {shippingAddresses.length ? (
     <div>
      {shippingAddresses.map(addr => (
       <div
        className={
         'trade-shipping-item ' + (cart.shippingAddress?._id === addr._id ? 'selected' : '')
        }
        key={addr._id}
        onClick={e => {
         e.preventDefault();
         e.stopPropagation();
         if (cart.shippingAddress?._id !== addr._id) {
          select(addr);
         }
        }}
       >
        <div className="select">
         <img
          src={
           cart.shippingAddress?._id === addr._id
            ? '/assets/images/checkmark-checked.svg'
            : '/assets/images/checkmark-unchecked.svg'
          }
          alt="select"
         />
        </div>
        <div className="name">
         {addr.firstName} {addr.lastName}
        </div>
        <div className="address1">{addr.address1}</div>
        {addr.address2 ? <div className="address2">{addr.address2}</div> : ''}
        <div className="city">{addr.city}</div>
        <div className="state">{addr.state}</div>
        <div className="zip">{addr.postalCode}</div>
        <div className="phone">{addr.phone}</div>
       </div>
      ))}
      <div className="footer">
       <div className="button-container">
        <Button
         label="Next"
         large={true}
         disabled={!cart.shippingAddress}
         onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          next();
         }}
        />
       </div>
      </div>
     </div>
    ) : (
     <div className="empty-cart">No shipping addresses defined!</div>
    )}
   </IonContent>

   <CreateShippingAddressModal
    ref={modal}
    onClose={(addresses: Address[]) => {
     console.log('add address', addresses);
     setShippingAddresses(addresses);

     if (!cart.shippingAddress) {
      const addr = addresses.find(a => a.default);
      if (addr) {
       tradeStore.setShippingAddress(addr);
      }
     }
     modal.current?.dismiss();
    }}
   />
  </IonPage>
 );
};

export default TradeOfferShipping;
