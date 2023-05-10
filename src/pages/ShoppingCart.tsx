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
import './ShoppingCart.scss';
import Button from '../components/Button';
import { Address, Product, User, TaxShippingResponse } from '../models';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { formatPrice, getImageUrl } from '../utils';
import Input from '../components/Input';

const ShoppingCartPage: React.FC = () => {
  const history = useHistory();
  const productService = new ProductService();
  const userService = new UserService();
  const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);
  const [promoCode, setPromoCode] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<Address>();
  const [showDetails, setShowDetails] = useState<boolean>(true);
  let subscription: any;

  useIonViewWillEnter(() => {
    subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
      setCart(cart);
    });

    productService.getCart().then((products: Product[]) => {
      //console.log('getCart', products);
      shoppingCartStore.setProducts(products);
    });

    userService.getMe().then((user: User) => {
      const addr = user.shippingAddress.find(a => a.default);
      setShippingAddress(addr);
      if (addr) {
        productService.getTaxAndShipping(addr).then((res: TaxShippingResponse) => {
          shoppingCartStore.beginUpdate();
          shoppingCartStore.setShippingAddress(addr);
          shoppingCartStore.setTax(res.salesTax);
          shoppingCartStore.setShipping(res.shipping);
          shoppingCartStore.endUpdate();
        });
      }
    });
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
    history.push('/checkout/shipping');
  }

  return (
    <IonPage className="cart-container">
      <IonHeader className="cart-header">
        <IonToolbar className="cart-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div
                  className="close-button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.goBack();
                  }}
                >
                  <img src="assets/images/cart-close.svg" alt="close" />
                </div>
                <div className="title">My Cart</div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="cart-content">
        {cart.products.length ? (
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
            <div className="order-summary">
              <div className="title">
                <div>Order Summary</div>
                <div>
                  <IonIcon
                    icon={showDetails ? caretUpOutline : caretDownOutline}
                    onClick={e => {
                      setShowDetails(!showDetails);
                    }}
                  />
                </div>
              </div>
              {showDetails ? (
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
              <div className="promo-code-container">
                <Input
                  value={promoCode}
                  small={true}
                  onChange={val => setPromoCode(val)}
                  placeholder="Enter promo code"
                />
              </div>
              <div className="button-container">
                <Button
                  label="Checkout"
                  large={true}
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    checkout();
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">Your cart is empty!</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ShoppingCartPage;
