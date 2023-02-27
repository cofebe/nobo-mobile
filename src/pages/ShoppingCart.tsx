import { useState } from 'react';
//import { FeedItem, Comment } from '../data/athlete-feed';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonButtons,
  IonContent,
  IonIcon,
  IonHeader,
  //IonList,
  IonPage,
  //IonRefresher,
  //IonRefresherContent,
  IonToolbar,
  useIonViewWillEnter,
  IonText,
} from '@ionic/react';
import './ShoppingCart.scss';
//import FeedListItem from '../components/FeedListItem';
import { chevronBackOutline } from 'ionicons/icons';
import { ProductService, Product } from '../services/ProductService';
//import ImageZoom from '../components/ImageZoom';

const ShoppingCart: React.FC = () => {
  const params: any = useParams();
  const productService = new ProductService();
  const history = useHistory();
  let [productId, setProductId] = useState<string>(params.id);
  const [product, setProduct] = useState<Product>();
  //const [imageZoom, setImageZoom] = useState('');

  console.log('ShoppingCart:', productId);

  useIonViewWillEnter(() => {
    productId = params.id;
    setProductId(productId);

    console.log('productService.getProduct():', productId)
    productService
      .getProduct(productId)
      .then(data => {
        console.log('getPost:', data);
        setProduct(data.product);
      });
  });

  return (
    <IonPage className="product-detail-page">
      {/*<ImageZoom show={!!imageZoom} imageUrl={imageZoom} onClose={() => setImageZoom('')}></ImageZoom>*/}
      <IonHeader>
        <IonToolbar
          style={{
            padding: "40px 10px 10px 10px",
          }}
        >
          <IonButtons slot="start"
              onClick={() => {
                history.goBack()
              }}>
            <IonIcon
              slot="icon-only"
              icon={chevronBackOutline}
            />
            <IonText>Feed</IonText>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {product ? (
        <IonContent className="product-detail-page" fullscreen>
          test
          {/*
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList className="product-detail-background">
            <FeedListItem message={message} zoomAction={(i: number) => {
              try {
                if (message && message.photo_url && message.photo_url.length > 0) {
                  let targetIndex = i;
                  let zoomImageUrl = (message.photo_url || "").replace('[', '').replace(']', '').split("'").join('').split(',')[targetIndex];
                  setImageZoom(zoomImageUrl);
                }
              } catch (exZoomPicNoExist) {
              }
            }} />
          </IonList>
          */}
        </IonContent>
      ) : ''}
    </IonPage>
  );
};

export default ShoppingCart;
