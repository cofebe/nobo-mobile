import { useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonViewWillEnter,
} from '@ionic/react'
import './TradeDenied.scss'
import { useHistory, } from 'react-router'
import { FullOrder } from '../models'
import { getImageUrl } from '../utils'


const TradeDenied: React.FC = () => {
  const history = useHistory()
  const [tradesData, setTradesData] = useState<FullOrder[]>([])


  useIonViewWillEnter(() => {
    const data1 = localStorage.getItem('denyTradeData')

    if (data1) {
      const resp = JSON.parse(data1)
      setTradesData(resp)
    }
  })


  const product: any = tradesData

  return (
    <IonPage className='denied-item-main-container'>
      <IonContent className='item-denied-content'>
        <IonRow style={{ backgroundColor: '#FEFCF7' }}>
          <IonCol className='denied-item-header' size='12'>
            <IonCol className='item-denied-title-text-container'>TRADE OFFER DENIED!</IonCol>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size='12' className='item-denied-info-header'>
            <img className='img' height={18} src='assets/images/trade-denied-error.svg' alt="" />
          </IonCol>
        </IonRow>

        <div className='item-denied-desc-container'>
          <div className='item-denied-desc'>
            YOU DENIED <span style={{ color: '#D6980E', fontStyle: 'italic' }}>@{product?.initiator?.displayName}</span>
            TRADE OFFER
          </div>
        </div>

        <div className='item-denied-container2'>
          <div className='item-denied-desc2'>
            No problem! Your item will still be available in your sales closet for other offers or purchases.
          </div>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol className='item-denied-container'>

              <div className='items-view-props'>
                <div className='items-view-props-left'>
                <div className='item-img-left'
                      style={{
                        backgroundImage: product.products?.requested?.images?.length
                          ? getImageUrl(product.products.requested?.images[0]?.url)
                          : '',
                      }}
                    > </div>
                  {/* <img
                    className='item-img-left'
                    src={product?.products?.requested[0]?.url.length < 60 ?
                      `https://staging.thenobo.com/${product?.products?.requested[0]?.url}`
                      : `${product?.products?.requested.images[0]?.url}`}
                    alt={product?.products?.requested.name}
                  /> */}

                </div>

                <div className='items-view-props-center'>
                  <div className='line'></div>
                  <img height={18} className='img' src='assets/images/trade-denied-error.svg' alt="" />
                </div>

                <div className='items-view-props-right'>
                <div className='item-img-right'
                      style={{
                        backgroundImage: product.products?.offered?.images?.length
                          ? getImageUrl(product.products.offered.images[0]?.url)
                          : '',
                      }}
                    > </div>
                  {/* <img
                    className='item-img-right'
                    src={product?.products?.offered[0]?.url.length < 60 ?
                      `https://staging.thenobo.com/${product.products?.offered[0]?.url}`
                      : `${product?.products?.offered.images[0]?.url}`}
                    alt={product?.products?.offered.name}
                  /> */}

                </div>
              </div>

            </IonCol>

          </IonRow>
        </IonGrid>
        <div className="trade-denied-btn-below">
          <IonButton className='btn' onClick={() => {
            history.replace('/home/closet/trade')
            localStorage.removeItem('denyTradeData')

          }} >VIEW MY CLOSET</IonButton>
          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline' onClick={() => {
            history.replace(`/home/style-feed`)
          }} >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default TradeDenied
