import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
} from '@ionic/react';
import './SellPendingCloset.scss';
import Header from '../components/Header';
import { UserService } from '../services/UserService';
import { Product } from '../models';
import { formatPrice } from '../utils';

const SellPendingCloset: React.FC = () => {
  const userService = new UserService();
  const [products, setProducts] = useState<Product[]>([]);

  useIonViewWillEnter(() => {
    userService.getMyPendingProducts('sell').then(res => {
      setProducts(res.docs);
    });
  });

  function getDateString(dtStr: string) {
    const dt = new Date(dtStr);
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `Submitted ${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
  }

  return (
    <IonPage className="sell-pending-closet-container">
      <Header title="Pending Approvals" />
      <IonContent className="sell-pending-closet-content">
        {products.length > 0 ? (
          <IonGrid className="product-grid">
            <IonRow>
              {products.map(p => (
                <IonCol size="12" key={p._id}>
                  <div className="date">{getDateString(p.createdAt)}</div>
                  <div className="brand">{p.brand}</div>
                  <div className="name">{p.name}</div>
                  <div className="price-size">
                    <div className="price">
                      <span>Cost:</span>
                      {formatPrice(p.price)}
                    </div>
                    {p.attributes.filter(attr => attr.id === 'size').map(attr => (
                      <div className="size">
                        Size {attr.value}
                      </div>
                    ))}
                  </div>
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

export default SellPendingCloset;
