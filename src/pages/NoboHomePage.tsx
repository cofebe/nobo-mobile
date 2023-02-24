import { useEffect, useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonRow,
  IonToolbar,
  IonPage,
  IonContent,
  useIonViewWillEnter,
} from '@ionic/react';
import './NoboHomePage.scss';
import NoboHeader from '../components/NoboHeader';
import NoboHomeItem from '../components/NoboHomeItem';
import { NoboProductsService } from '../services/NoboProductsService';
import { environment } from '../environments/environment';

const NoboHomePage: React.FC = () => {
  const noboProductsService = new NoboProductsService();
  const [sectionName, setSectionName] = useState('explore');
  const [sectionCategory, setSectionCategory] = useState('women');
  const [products, setProducts] = useState<any>([]);

  useIonViewWillEnter(() => {
    getProducts('women', 'explore', false);
  });

  useEffect(() => {
    if (sectionName === 'explore') {
      getProducts(sectionCategory, 'explore', false);
    } else if (sectionName === 'trade') {
      getProducts(sectionCategory, 'trade', false);
    } else if (sectionName === 'sale') {
      getProducts(sectionCategory, 'sell', true);
    } else if (sectionName === 'shop') {
      getProducts(sectionCategory, 'sell', false);
    }
  }, [sectionName, sectionCategory]);

  const getProducts = (group: string, action: string, onSale: boolean) => {
    noboProductsService
      .getProducts(group, action, onSale)
      .then((products) => {
        console.log('products', products.docs);
        setProducts(products.docs);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const getSectionName = (sectionName: string) => {
    console.log('sectionName', sectionName);
    setSectionName(sectionName);
  };

  const getSectionCategory = (sectionCategory: string) => {
    console.log('sectionCategory', sectionCategory);
    setSectionCategory(sectionCategory);
  };

  return (
    <IonPage className="nobo-home-page">
      <NoboHeader
        sectionCategoryCallback={getSectionCategory}
        sectionNameCallback={getSectionName}
      />
      {sectionName === 'explore' && (
        <IonContent
          style={{
            '--padding-bottom': '10px',
            '--padding-end': '10px',
            '--padding-start': '10px',
            '--padding-top': '10px',
            '--background': '#FEFCF7',
          }}
        >
          {/* <IonGrid> */}
          <IonRow>
            <IonCol style={{ height: 350 }} size="12">
              <NoboHomeItem product={products[0]} isBig />
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
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      {sectionName === 'trade' && (
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
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      {sectionName === 'shop' && (
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
                  product={product}
                  // image={environment.serverUrl + product.image}
                  // price={'$' + product.price}
                  // tradeOrBuy={product.action}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      {sectionName === 'sale' && (
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
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
    </IonPage>
  );
};

export default NoboHomePage;
