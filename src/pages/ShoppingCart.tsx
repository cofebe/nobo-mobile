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
  ShoppingCart,
  Product,
  Address,
  User,
  TaxShippingResponse,
} from '../models';
import { shoppingCartStore } from '../cart-store';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { formatPrice, getImageUrl } from '../utils';

const ShoppingCartPage: React.FC = () => {
  const history = useHistory();
  const productService = new ProductService();
  const userService = new UserService();
  let [cart, setCart] = useState<Product[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [shipping, setShipping] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  let [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const subscription = shoppingCartStore.subscribe((shoppingCart: ShoppingCart) => {
      cart = shoppingCart.products;
      setCart(cart);

      updateTotals();
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
        shippingAddresses = user.shippingAddress;
        setShippingAddresses(shippingAddresses);
        updateTotals();
      });
  });

  function updateTotals() {
    const subtotal = cart.reduce((total, curr) => total + curr.price, 0);
    setSubtotal(subtotal);
    setTotal(total);

    const addr = shippingAddresses.find(a => a.default);
    if (addr) {
      productService
        .getTaxAndShipping(addr)
        .then((res: TaxShippingResponse) => {
          setTax(res.salesTax);
          setShipping(res.shipping);
          setTotal(subtotal + res.salesTax + res.shipping);
        });
    }
  }

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
              <div className="summary-info">
                <div className="label">Shipping</div>
                <div className="value">{formatPrice(shipping)}</div>
              </div>
              <div className="summary-info">
                <div className="label">Sales Tax</div>
                <div className="value">{formatPrice(tax)}</div>
              </div>
              <div className="summary-info total">
                <div className="label">Your Total</div>
                <div className="value">{formatPrice(total)}</div>
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
