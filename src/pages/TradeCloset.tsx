import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  useIonViewWillEnter,
} from '@ionic/react';
import { caretForwardOutline } from 'ionicons/icons';
import './TradeCloset.scss';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { UserService } from '../services/UserService';
import { Product } from '../models';

const TradeCloset: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingProductCount, setPendingProductCount] = useState<number>(0);

  useIonViewWillEnter(() => {
    userService.getMyProducts('trade').then(res => {
      setProducts(res.docs);
    });

    userService.getMyPendingProducts('trade').then(res => {
      setPendingProductCount(res.docs.length);
    });
  });

  return (
    <IonPage className="trade-closet-container">
      <Header title="My Trade Closet" />
      <IonContent className="trade-closet-content">
        {pendingProductCount !== 0 && (
          <div
            className="pending-products"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              history.push('/home/closet/trade/pending');
            }}
          >
            <div>{pendingProductCount} Items Pending Approval</div>
            <IonIcon icon={caretForwardOutline} />
          </div>
        )}
        {products.length > 0 ? (
          <IonGrid className="product-grid">
            <IonRow>
              {products.map(p => (
                <IonCol size="6" key={p._id}>
                  <ProductCard product={p} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        ) : (
          <div className="no-products">No products found!</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TradeCloset;
