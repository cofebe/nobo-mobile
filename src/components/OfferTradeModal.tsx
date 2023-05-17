import { useState, useEffect, useRef, forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonHeader, IonGrid, IonRow, IonCol, IonToolbar, IonModal } from '@ionic/react';
import './OfferTradeModal.scss';
import { UserService } from '../services/UserService';
import { Product } from '../models';
import Button from './Button';
import ProductCard from './ProductCard';
import TradeFeeModal from './TradeFeeModal';
import { tradeStore, TradeState } from '../trade-store';
import { formatPrice, getMinTradeValue } from '../utils';

export interface OfferTradeModalProps {
  product: Product;
  onClose: () => void;
}

export type Ref = HTMLIonModalElement;

const OfferTradeModal = forwardRef<Ref, OfferTradeModalProps>(({ product, onClose }, ref) => {
  const history = useHistory();
  const userService = new UserService();
  const [cart, setCart] = useState<TradeState>(tradeStore.initialState);
  const [minTradeValue, setMinTradeValue] = useState<number>(0);
  const [tradeProducts, setTradeProducts] = useState<Product[]>([]);

  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const subscription = tradeStore.subscribe((cart: TradeState) => {
      setCart(cart);
    });

    tradeStore.setProductWanted(product);

    setMinTradeValue(getMinTradeValue(product.price));

    userService.getMyProducts('trade').then(products => {
      //console.log('products', products);
      setTradeProducts(products.docs);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [product]);

  function validate() {
    return (cart.productOffered?.price || 0) >= minTradeValue;
  }

  function select(p: Product) {
    console.log('select', p);
    tradeStore.setProductOffered(p);
  }

  function submit(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    console.log('submit', cart);
    (ref as any)?.current?.dismiss();
    history.push(`/trade/shipping`);
  }

  return (
    <IonModal
      className="offer-trade-container"
      ref={ref}
      backdropDismiss={true}
      swipeToClose={true}
    >
      <IonHeader className="offer-trade-header">
        <IonToolbar className="offer-trade-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12" className="title">
                Offer a Trade
              </IonCol>
            </IonRow>
            <IonRow className="name">
              <IonCol size="12">
                Select a product from your Trade Closet to offer a trade for the&nbsp;
                <span>{product.name}</span>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="8" className={'fee-container ' + (validate() ? 'valid' : '')}>
                NOBO Trade Feed: <span>{formatPrice(cart.tradeFee)}</span>
              </IonCol>
              <IonCol
                size="4"
                className="fee-modal-container"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  modal.current?.present();
                }}
              >
                <img src="assets/images/question-mark-tooltip.svg" alt="what is this fee?" />
                <div>What is this fee?</div>
              </IonCol>
            </IonRow>
            <IonRow className={'slider-container ' + (validate() ? 'valid' : '')}>
              <IonCol
                size="12"
                className={
                  !cart.productOffered
                    ? 'empty'
                    : (cart.productOffered?.price || 0) < minTradeValue
                    ? 'low'
                    : 'high'
                }
              >
                <div className="slider">
                  <img
                    src="assets/images/trade-checkmark.svg"
                    alt="trade value indicator"
                    className="slider-indicator"
                  />
                  <div className="slider-bar"></div>
                </div>
                <div className="zero">$0</div>
                <div className="price-min">
                  {formatPrice(minTradeValue, false)}
                  <div>min value</div>
                </div>
                <div className="price-selected">
                  {formatPrice(cart.productOffered?.price || 0, false)}
                  <div>your product</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="offer-trade-content">
        <IonGrid>
          <IonRow>
            {tradeProducts.length ? (
              <>
                {tradeProducts.map(product => (
                  <IonCol size="6" key={product._id} className="product-card-container">
                    <ProductCard
                      product={product}
                      onClick={() => select(product)}
                      priceLabel="Product Value:"
                    />
                    <img
                      src={`assets/images/checkmark-${
                        product._id === cart.productOffered?._id ? 'checked' : 'unchecked'
                      }.svg`}
                      alt="checkbox"
                    />
                  </IonCol>
                ))}
              </>
            ) : (
              <IonCol size="12" className="no-trade-items">
                No trade items defined!
              </IonCol>
            )}
          </IonRow>
          <IonRow className="buttons">
            <IonCol size="6" offset="3">
              <Button label="Offer Trade" disabled={!validate()} onClick={e => submit(e)} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <TradeFeeModal ref={modal} />
    </IonModal>
  );
});

export default OfferTradeModal;
