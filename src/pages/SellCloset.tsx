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
import './SellCloset.scss';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { UserService } from '../services/UserService';
import { Product } from '../models';

const SellCloset: React.FC = () => {
 const history = useHistory();
 const userService = new UserService();
 const [products, setProducts] = useState<Product[]>([]);
 const [pendingProductCount, setPendingProductCount] = useState<number>(0);

 useIonViewWillEnter(() => {
  userService.getMyProducts('sell').then(res => {
   setProducts(res.docs);
  });

  userService.getMyPendingProducts('sell').then(res => {
   setPendingProductCount(res.docs.length);
  });
 });

 return (
  <IonPage className="sell-closet-container">
   <Header title="Sell Closet" />
   <IonContent className="sell-closet-content">
    {pendingProductCount && (
     <div
      className="pending-products"
      onClick={e => {
       e.preventDefault();
       e.stopPropagation();
       history.push('/home/closet/sell/pending');
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

export default SellCloset;
