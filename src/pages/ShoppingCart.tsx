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
import { ShoppingCart, Product } from '../models';
import { shoppingCartStore } from '../cart-store';
import { ProductService } from '../services/ProductService';
import { formatPrice, getImageUrl } from '../utils';

const ShoppingCartPage: React.FC = () => {
  const history = useHistory();
  const productService = new ProductService();
  const [cart, setCart] = useState<Product[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');

  useEffect(() => {
    const subscription = shoppingCartStore.subscribe((cart: ShoppingCart) => {
      const products = cart.products;
      setCart(products);

      const subtotal = products.reduce((total, curr) => total + curr.price, 0);
      setSubtotal(subtotal);
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
  });

  function remove(product: Product) {
    productService.addToCart(product._id)
      .then((success: boolean) => {
        if (success) {
          shoppingCartStore.removeProduct(product._id);
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
        {cart.length ? (
          <div>
            {cart.map(product => (
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
                <div className="value">{formatPrice(subtotal)}</div>
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
