import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonInput,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import './ShoppingCart.scss';
import Button from '../components/Button';
import {
  Address,
  Product,
  User,
  TaxShippingResponse,
} from '../models';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { formatPrice, getImageUrl } from '../utils';

const ShoppingCartPage: React.FC = () => {
  const history = useHistory();
  const productService = new ProductService();
  const userService = new UserService();
  const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);
  const [promoCode, setPromoCode] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<Address>();

  useEffect(() => {
    const subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
      setCart(cart);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useIonViewWillEnter(() => {
    productService
      .getCart()
      .then((products: Product[]) => {
        //console.log('getCart', products);
        shoppingCartStore.setProducts(products);
      });

    userService
      .getMe()
      .then((user: User) => {
        const addr = user.shippingAddress.find(a => a.default);
        setShippingAddress(addr);
        if (addr) {
          productService
            .getTaxAndShipping(addr)
            .then((res: TaxShippingResponse) => {
              shoppingCartStore.beginUpdate();
              shoppingCartStore.setShippingAddress(addr);
              shoppingCartStore.setTax(res.salesTax);
              shoppingCartStore.setShipping(res.shipping);
              shoppingCartStore.endUpdate();
            });
        }
      });
  });

  function remove(product: Product) {
    productService.addToCart(product._id)
      .then((success: boolean) => {
        if (success) {
          shoppingCartStore.removeProduct(product._id);

          if (shippingAddress) {
            productService
              .getTaxAndShipping(shippingAddress)
              .then((res: TaxShippingResponse) => {
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
    console.log('checkout');
  }

  return (
    <IonPage className="cart-container">
      <IonHeader className="cart-header">
        <IonToolbar className="cart-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="close-button" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  history.goBack();
                }}>
                  <img src="assets/images/cart-close.svg" alt="close" />
                </div>
                <div className="title">
                  My Cart
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="cart-content" scrollY={false}>
        {cart.products.length ? (
          <div>
            {cart.products.map(product => (
              <div className="cart-item" key={product._id}>
                <div className="product-image-container">
                  <div className="product-image" style={{ backgroundImage: getImageUrl(product.images[0].url) }}></div>
                </div>
                <div className="product-info-container">
                  <div className="remove" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    remove(product);
                  }}>Remove</div>
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
              <div className="title">Order Summary</div>
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
              <div className="summary-info total">
                <div className="label">Your Total</div>
                <div className="value">{formatPrice(cart.total)}</div>
              </div>
            </div>
            <div className="footer">
              <div className="promo-code-container">
                <IonInput
                  value={promoCode}
                  onIonChange={(e: any) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code" />
              </div>
              <div className="button-container">
                <Button label="Checkout" large={true} onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  checkout();
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

export default ShoppingCartPage;
