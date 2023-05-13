import { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
 useIonViewWillLeave,
} from '@ionic/react';
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';
import './CheckoutSummary.scss';
import Button from '../components/Button';
import {
 Address,
 Product,
 Order,
 User,
 TaxShippingResponse,
 PaymentMethod,
 PaymentMethodsResponse,
} from '../models';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { formatPrice, getImageUrl, getCardImage } from '../utils';

const CheckoutSummary: React.FC = () => {
 const history = useHistory();
 const productService = new ProductService();
 const userService = new UserService();
 const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);
 let [shippingAddress, setShippingAddress] = useState<Address>();
 const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
 const [showOrderSummary, setShowOrderSummary] = useState<boolean>(true);
 const [showBillingSummary, setShowBillingSummary] = useState<boolean>(true);
 const [showShippingSummary, setShowShippingSummary] = useState<boolean>(true);
 const [showPaymentSummary, setShowPaymentSummary] = useState<boolean>(true);
 const [showCart, setShowCart] = useState<boolean>(false);
 const [cartImage, setCartImage] = useState<string>('');
 const [emailAddress, setEmailAddress] = useState<string>('');
 let [experience, setExperience] = useState<string>('women');
 let subscription: any;

 useIonViewWillEnter(() => {
  subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
   if (cart.isInitial) {
    return;
   }

   setCart(cart);

   if (!cart.products.length) {
    const url = `/home/explore/${experience}/explore`;
    console.log('Checkout summary: No products in cart. Redirecting to', url);
    history.push(url);
    return;
   }

   setCartImage(cart.products[0].images[0].url);

   if (cart.shippingAddress) {
    if (!shippingAddress || shippingAddress._id !== cart.shippingAddress._id) {
     shippingAddress = cart.shippingAddress;
     setShippingAddress(cart.shippingAddress);
     productService.getTaxAndShipping(cart.shippingAddress).then((res: TaxShippingResponse) => {
      shoppingCartStore.beginUpdate();
      shoppingCartStore.setTax(res.salesTax);
      shoppingCartStore.setShipping(res.shipping);
      shoppingCartStore.endUpdate();
     });
    }
   } else {
    userService.getMe().then((user: User) => {
     const addr = user.shippingAddress.find(a => a.default);
     if (addr) {
      shoppingCartStore.setShippingAddress(addr);
     }
    });
   }

   if (cart.paymentMethod) {
    setPaymentMethod(cart.paymentMethod);
   } else {
    userService.getPaymentMethods().then((res: PaymentMethodsResponse) => {
     const pm = res.cards.find(c => c.id === res.customer.default_source);
     if (pm) {
      shoppingCartStore.setPaymentMethod(pm);
     }
    });
   }
  });

  productService.getCart().then((products: Product[]) => {
   //console.log('getCart', products);
   shoppingCartStore.setProducts(products);
  });

  userService.getMe().then((user: User) => {
   experience = user.experiencePreferences;
   setExperience(experience);
   setEmailAddress(user.email);
  });

  setShowCart(false);
  setShowOrderSummary(true);
  setShowBillingSummary(true);
  setShowPaymentSummary(true);
 });

 useIonViewWillLeave(() => {
  subscription?.unsubscribe();
 });

 function remove(product: Product) {
  productService.addToCart(product._id).then((success: boolean) => {
   if (success) {
    shoppingCartStore.removeProduct(product._id);

    if (shippingAddress) {
     productService.getTaxAndShipping(shippingAddress).then((res: TaxShippingResponse) => {
      shoppingCartStore.beginUpdate();
      shoppingCartStore.setTax(res.salesTax);
      shoppingCartStore.setShipping(res.shipping);
      shoppingCartStore.endUpdate();
     });
    }
   } else {
    window.alert('Unable to remove item from cart!');
   }
  });
 }

 function checkout() {
  console.log('place order');
  if (!shippingAddress || !paymentMethod) {
   return;
  }

  productService.placeOrder(shippingAddress, paymentMethod.id).then((order: Order) => {
   console.log('order', order);
   shoppingCartStore.reset();
   history.push(`/checkout/order/${order._id}`);
  });
 }

 return (
  <IonPage className="checkout-summary-container">
   <IonHeader className="cart-header">
    <IonToolbar className="cart-header-toolbar">
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
         Order Summary
        </div>
       </IonCol>
      </IonRow>
     </IonGrid>
    </IonToolbar>
   </IonHeader>
   <IonContent className="cart-content">
    {showCart ? (
     <div>
      {cart.products.map(product => (
       <div className="cart-item" key={product._id}>
        <div className="product-image-container">
         <div
          className="product-image"
          style={{ backgroundImage: getImageUrl(product.images[0].url) }}
         ></div>
        </div>
        <div className="product-info-container">
         <div
          className="remove"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           remove(product);
          }}
         >
          Remove
         </div>
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
        <div
         onClick={e => {
          setShowCart(true);
         }}
        >
         View Cart
        </div>
       </div>
      </div>
     </div>
    )}
    <div className="email-summary">
     <div className="title">
      <div>Email</div>
     </div>
     <div className="email">{emailAddress}</div>
    </div>
    <div className="billing-summary">
     <div className="title">
      <div>Billing Address</div>
      <div>
       <IonIcon
        icon={showBillingSummary ? caretUpOutline : caretDownOutline}
        onClick={e => {
         setShowBillingSummary(!showBillingSummary);
        }}
       />
      </div>
     </div>
     {showBillingSummary ? (
      <div className="details">
       <div>{paymentMethod?.name}</div>
       <div>{paymentMethod?.address_line1}</div>
       {paymentMethod?.address_line2 ? <div>{paymentMethod?.address_line2}</div> : ''}
       <div>
        {paymentMethod?.address_city} {paymentMethod?.address_state}
       </div>
       <div>{paymentMethod?.address_zip}</div>
      </div>
     ) : (
      ''
     )}
    </div>
    <div className="shipping-summary">
     <div className="title">
      <div>Shipping Address</div>
      <div>
       <IonIcon
        icon={showShippingSummary ? caretUpOutline : caretDownOutline}
        onClick={e => {
         setShowShippingSummary(!showShippingSummary);
        }}
       />
      </div>
     </div>
     {showShippingSummary ? (
      <div className="details">
       <div>
        {shippingAddress?.firstName} {shippingAddress?.lastName}
       </div>
       <div>{shippingAddress?.address1}</div>
       {shippingAddress?.address2 ? <div>{shippingAddress?.address2}</div> : ''}
       <div>
        {shippingAddress?.city} {shippingAddress?.state}
       </div>
       <div>{shippingAddress?.postalCode}</div>
       <div className="phone">{shippingAddress?.phone}</div>
      </div>
     ) : (
      ''
     )}
    </div>
    <div className="payment-summary">
     <div className="title">
      <div>Payment</div>
      <div>
       <IonIcon
        icon={showPaymentSummary ? caretUpOutline : caretDownOutline}
        onClick={e => {
         setShowPaymentSummary(!showPaymentSummary);
        }}
       />
      </div>
     </div>
     {showPaymentSummary ? (
      <div className="details payment">
       <div>
        <div className="logo-container">
         <img src={getCardImage(paymentMethod?.brand || 'visa')} alt="card brand" />
        </div>
       </div>
       <div>
        <div>
         {paymentMethod?.brand} ({paymentMethod?.last4})
        </div>
        <div>
         Exp. {paymentMethod?.exp_month}/{paymentMethod?.exp_year}
        </div>
        <div>{paymentMethod?.name}</div>
       </div>
      </div>
     ) : (
      ''
     )}
    </div>
    <div className="order-summary">
     <div className="title">
      <div>Order Summary</div>
      <div>
       <IonIcon
        icon={showOrderSummary ? caretUpOutline : caretDownOutline}
        onClick={e => {
         setShowOrderSummary(!showOrderSummary);
        }}
       />
      </div>
     </div>
     {showOrderSummary ? (
      <div>
       <div className="summary-info">
        <div className="label">Subtotal</div>
        <div className="value">{formatPrice(cart.subtotal)}</div>
       </div>
       <div className="summary-info">
        <div className="label">Shipping</div>
        <div className="value">{formatPrice(cart.shipping)}</div>
       </div>
       <div className="summary-info">
        <div className="label">Sales Tax</div>
        <div className="value">{formatPrice(cart.tax)}</div>
       </div>
      </div>
     ) : (
      ''
     )}
     <div className="summary-info total">
      <div className="label">Your Total</div>
      <div className="value">{formatPrice(cart.total)}</div>
     </div>
    </div>
    <div className="footer">
     <div className="button-container">
      <Button
       label="Place Order"
       large={true}
       onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        checkout();
       }}
      />
     </div>
    </div>
   </IonContent>
  </IonPage>
 );
};

export default CheckoutSummary;
