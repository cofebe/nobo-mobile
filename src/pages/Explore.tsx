import { useEffect, useState } from 'react';
import { IonCol, IonRow, IonPage, IonContent, useIonViewWillEnter } from '@ionic/react';
import './Explore.scss';
import ExploreHeader from '../components/ExploreHeader';
import NoboHomeItem from '../components/NoboHomeItem';
import { ProductService } from '../services/ProductService';
import { useParams } from 'react-router';

const Explore: React.FC = () => {
  const productService = new ProductService();
  const params: any = useParams();
  const [products, setProducts] = useState<any>([]);

  useIonViewWillEnter(() => {
    const ionRouterOutlet = document.querySelector('ion-router-outlet') as HTMLElement;
    if (ionRouterOutlet) {
      ionRouterOutlet.style.setProperty('--animation-duration', '0s');
    }
    console.log('params', params);
  });

  useEffect(() => {
    if (params.sectionName === 'explore') {
      getProducts(params.sectionCategory, 'explore', false);
    } else if (params.sectionName === 'trade') {
      getProducts(params.sectionCategory, 'trade', false);
    } else if (params.sectionName === 'sale') {
      getProducts(params.sectionCategory, 'sell', true);
    } else if (params.sectionName === 'shop') {
      getProducts(params.sectionCategory, 'sell', false);
    }
  }, [params]);

  function getProducts(group: string, action: string, onSale: boolean) {
    productService
      .getProducts(group, action, onSale)
      .then(products => {
        setProducts(products.docs);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  return (
    <IonPage className="nobo-explore-page">
      <ExploreHeader />
      {params.sectionName === 'explore' ? (
        <IonContent>
          <IonRow>
            <IonCol className="large" size="12">
              <NoboHomeItem product={products[0]} isBig />
            </IonCol>
          </IonRow>
          {products.length > 1 && (
            <IonRow>
              <IonCol className="featured-items">FEATURED ITEMS</IonCol>
            </IonRow>
          )}
          <IonRow>
            {products.slice(1).map((product: any, index: any) => (
              <IonCol className="small" key={index} size="6">
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      ) : (
        <IonContent>
          <IonRow>
            {products.map((product: any, index: any) => (
              <IonCol className="small" key={index} size="6">
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Explore;
