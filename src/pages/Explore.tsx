import { useEffect, useState } from 'react';
import {
  IonCol,
  IonRow,
  IonPage,
  IonContent,
  useIonViewWillEnter,
} from '@ionic/react';
import './Explore.scss';
import ExploreHeader from '../components/ExploreHeader';
import NoboHomeItem from '../components/NoboHomeItem';
import { ProductService } from '../services/ProductService';
import { useHistory, useParams } from 'react-router';

const Explore: React.FC = () => {
  const productService = new ProductService();
  const history = useHistory();
  const params: any = useParams();
  const [sectionName, setSectionName] = useState(params.sectionName);
  const [sectionCategory, setSectionCategory] = useState(
    params.sectionCategory
  );
  const [products, setProducts] = useState<any>([]);

  useIonViewWillEnter(() => {
    const ionRouterOutlet = document.querySelector(
      'ion-router-outlet'
    ) as HTMLElement;
    if (ionRouterOutlet) {
      ionRouterOutlet.style.setProperty('--animation-duration', '0s');
    }
    console.log('params', params);
    setSectionName(params.sectionName);
    setSectionCategory(params.sectionCategory);
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
      .then((products) => {
        setProducts(products.docs);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  return (
    <IonPage className="nobo-explore-page">
      <ExploreHeader />
      {params.sectionName === 'explore' && (
        <IonContent
          style={{
            '--padding-bottom': '10px',
            '--padding-end': '10px',
            '--padding-start': '10px',
            '--padding-top': '10px',
            '--background': '#FEFCF7',
          }}
        >
          <IonRow>
            <IonCol style={{ height: 350 }} size="12">
              <NoboHomeItem
                isSneaker={params.sectionCategory === 'sneakers'}
                product={products[0]}
                isBig
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol
              style={{
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              FEATURED ITEMS
            </IonCol>
          </IonRow>
          <IonRow>
            {products.slice(1).map((product: any, index: any) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  isSneaker={params.sectionCategory === 'sneakers'}
                  product={product}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      {params.sectionName === 'trade' && (
        <IonContent
          style={{
            '--padding-bottom': '10px',
            '--padding-end': '10px',
            '--padding-start': '10px',
            '--padding-top': '10px',
            '--background': '#FEFCF7',
          }}
        >
          <IonRow>
            {products.map((product: any, index: any) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  isSneaker={params.sectionCategory === 'sneakers'}
                  product={product}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      {params.sectionName === 'shop' && (
        <IonContent
          style={{
            '--padding-bottom': '10px',
            '--padding-end': '10px',
            '--padding-start': '10px',
            '--padding-top': '10px',
            '--background': '#FEFCF7',
          }}
        >
          <IonRow>
            {products.map((product: any, index: any) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  isSneaker={params.sectionCategory === 'sneakers'}
                  product={product}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      {params.sectionName === 'sale' && (
        <IonContent
          style={{
            '--padding-bottom': '10px',
            '--padding-end': '10px',
            '--padding-start': '10px',
            '--padding-top': '10px',
            '--background': '#FEFCF7',
          }}
        >
          <IonRow>
            {products.map((product: any, index: any) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  isSneaker={params.sectionCategory === 'sneakers'}
                  product={product}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Explore;
