import { useState } from 'react';
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
} from '@ionic/react';
import './NoboHomePage.scss';
import NoboHeader from '../components/NoboHeader';
import NoboHomeItem from '../components/NoboHomeItem';

const NoboHomePage: React.FC = () => {
  const [sectionName, setSectionName] = useState('explore');
  const [sectionCategory, setSectionCategory] = useState('women');

  const getSectionName = (sectionName: string) => {
    console.log('sectionName', sectionName);
    setSectionName(sectionName);
  };

  const getSectionCategory = (sectionCategory: string) => {
    console.log('sectionCategory', sectionCategory);
    setSectionCategory(sectionCategory);
  };

  const images = [
    {
      image: 'assets/images/nobo-splash-1.png',
      price: '$1.99-$2.99',
      tradeOrBuy: 'trade',
      isBig: true,
      // detailsHref: '/details',
    },
    {
      image: 'assets/images/nobo-splash-2.png',
      price: '$2.99',
      tradeOrBuy: 'buy',
      isBig: false,
      // detailsHref: '/details',
    },
    {
      image: 'assets/images/nobo-splash-3.png',
      price: '$103.00-$123.00',
      tradeOrBuy: 'trade',
      isBig: false,
      // detailsHref: '/details',
    },
  ];

  const shopImages = [
    {
      image: 'assets/images/nobo-splash-1.png',
      price: '$2.99',
      tradeOrBuy: 'buy',
      isBig: true,
      // detailsHref: '/details',
    },
    {
      image: 'assets/images/nobo-splash-2.png',
      price: '$2.99',
      tradeOrBuy: 'buy',
      isBig: false,
      // detailsHref: '/details',
    },
    {
      image: 'assets/images/nobo-splash-3.png',
      price: '$103.00',
      tradeOrBuy: 'buy',
      isBig: false,
      // detailsHref: '/details',
    },
  ];

  const tradeImages = [
    {
      image: 'assets/images/nobo-splash-1.png',
      price: '$1.99-$2.99',
      tradeOrBuy: 'trade',
      isBig: false,
      // detailsHref: '/details',
    },
    {
      image: 'assets/images/nobo-splash-2.png',
      price: '$2.99-$6.99',
      tradeOrBuy: 'trade',
      isBig: false,
      // detailsHref: '/details',
    },
    {
      image: 'assets/images/nobo-splash-3.png',
      price: '$103.00-$123.00',
      tradeOrBuy: 'trade',
      isBig: false,
      // detailsHref: '/details',
    },
  ];

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
              <NoboHomeItem
                tradeOrBuy="trade"
                price="1.99"
                image="assets/images/nobo-splash-2.png"
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
            {images.map((image, index) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  image={image.image}
                  price={image.price}
                  tradeOrBuy={image.tradeOrBuy}
                />
              </IonCol>
            ))}
          </IonRow>
          {/* </IonGrid> */}
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
            {tradeImages.map((image, index) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  image={image.image}
                  price={image.price}
                  tradeOrBuy={image.tradeOrBuy}
                />
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
            {shopImages.map((image, index) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  image={image.image}
                  price={image.price}
                  tradeOrBuy={image.tradeOrBuy}
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
            {images.map((image, index) => (
              <IonCol style={{ height: 175 }} key={index} size="6">
                <NoboHomeItem
                  image={image.image}
                  price={image.price}
                  tradeOrBuy={image.tradeOrBuy}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
    </IonPage>
  );
};

export default NoboHomePage;
