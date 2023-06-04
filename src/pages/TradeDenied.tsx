import { useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonViewWillEnter
} from '@ionic/react'
import './TradeDenied.scss'
import { useHistory, useParams, } from 'react-router'
import { UserService } from '../services/UserService'
import { TradesResponse } from '../models'


const TradeDenied: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const params: any = useParams()
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])


  useIonViewWillEnter(() => {
    userService.denyTradeOffer(params.id)
      .then((res) => {
        console.log(res)
        setTradesData([res])
      })
      .catch((error) => {
        console.log('error denying trade : ', error)
      })
  })


const tradeData:any = tradesData[0]
  console.log('deny page any', tradeData)
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
            YOU DENIED <span style={{ color: '#D6980E', fontStyle: 'italic' }}>@{tradeData?.initiator.displayName} </span>
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
                  <img
                    className='item-img-left'
                    src={tradeData?.products?.requested[0]?.url.length < 60 ?
                      `https://staging.thenobo.com/${tradeData?.products?.requested[0]?.url}`
                      : `${tradeData?.products?.requested.images[0]?.url}`}
                      alt={tradeData?.products?.requested.name}
                  />

                </div>

                <div className='items-view-props-center'>
                  <div className='line'></div>
                  <img height={18} className='img' src='assets/images/trade-denied-error.svg' alt="" />
                </div>

                <div className='items-view-props-right'>
                  <img
                    className='item-img-right'
                    src={tradeData?.products?.offered[0]?.url.length < 60 ?
                      `https://staging.thenobo.com/${tradeData.products?.offered[0]?.url}`
                      : `${tradeData?.products?.offered.images[0]?.url}`}
                      alt={tradeData?.products?.offered.name}
                  />

                </div>
              </div>

            </IonCol>

          </IonRow>
        </IonGrid>
        <div className="trade-denied-btn-below">
          <IonButton className='btn' onClick={() => {
            history.push('/home/closet/trade')
          }} >VIEW MY CLOSET</IonButton>
          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline' onClick={() => {
            history.replace({ pathname: `/home/style-feed`, state: {} })
          }} >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default TradeDenied
