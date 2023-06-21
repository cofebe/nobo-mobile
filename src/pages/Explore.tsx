import { useEffect, useRef, useState } from 'react';
import { IonCol, IonRow, IonPage, IonContent, useIonViewWillEnter, IonModal } from '@ionic/react';
import './Explore.scss';
import './Explore.css';
import ExploreHeader from '../components/ExploreHeader';
import NoboHomeItem from '../components/NoboHomeItem';
import { ProductService } from '../services/ProductService';
import { useParams } from 'react-router';

const Explore: React.FC = () => {
  const productService = new ProductService();
  const params: any = useParams();
  const [products, setProducts] = useState<any>([]);
  const [sort, setSort] = useState('');

  const modal = useRef<HTMLIonModalElement>(null)

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



  if (sort === 'low') {
    console.log('low')
    products?.sort((a: any, b: any) => a.price - b.price)
  } else if (sort === 'high') {
    console.log('high')
    products?.sort((a: any, b: any) => b.price - a.price)
  } else if (sort === 'date') {
    products?.sort((a: any, b: any) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
  }



  return (
    <IonPage className="nobo-explore-page">
      <ExploreHeader />
      <div className='explore-sort-container'>

        <div>FILTER</div>
        <div className="explore-sort-box"
          onClick={() => {
            modal.current?.present()
          }}
        >
          <img height={24} src='assets/images/sort-icon.svg' alt="" />
          <p className="explore-sort-text"
            style={{ fontWeight: 800, fontSize: 12 }}
          >SORT BY</p>
        </div>

      </div>

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
      <IonModal className='explore-main-modal' ref={modal} initialBreakpoint={1} breakpoints={[1, 5]}>
        <IonRow className='explore-modal-container'>

          <IonCol size='12' className='explore-modal-title-box'>
            <p className='explore-modal-title-text'>SORT BY</p>
          </IonCol>
          <IonCol size='12' className='explore-modal-listed-box'
            onClick={() => {
              setSort('date')
              modal.current?.dismiss()
            }}
          >
            <p className='explore-modal-listed-text'>JUST LISTED</p>
          </IonCol>

          <IonCol size='12' className='explore-modal-listed-box'
            onClick={() => {
              setSort('high')
              modal.current?.dismiss()
            }}
          >
            <p className='explore-modal-listed-text'>HIGH TO LOW</p>
          </IonCol>

          <IonCol size='12' className='explore-modal-listed-box'
            onClick={() => {
              setSort('low')
              modal.current?.dismiss()
            }}
          >
            <p className='explore-modal-listed-text'>LOW TO HIGH</p>
          </IonCol>


        </IonRow>
      </IonModal>

    </IonPage>
  );
};

export default Explore;
