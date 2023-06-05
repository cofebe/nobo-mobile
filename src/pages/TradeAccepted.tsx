import { useRef, useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react'
import './TradeAccepted.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import {  TradesResponse } from '../models'
import { useParams, } from 'react-router'



const TradeAccepted: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const params: any = useParams()
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  useIonViewWillEnter(() => {
    userService.acceptTradeOffer(params.id)
    .then((res)=>{
      console.log(res)
      setTradesData([res])
    })
    .catch((error)=>{
      console.log('error accepting trade : ',error)
    })
  })


  const tradeData:any = tradesData[0]
  console.log('message recieved  ', tradeData)

  return (
    <IonPage className='accepted-accepted-item-main-container'>
      <IonContent className='item-accepted-content'>
        <IonRow style={{ backgroundColor: '#FEFCF7' }}>
          <IonCol className='accepted-accepted-item-header' size='12'>
            <IonCol className='item-accepted-title-text-container'>TRADE OFFER ACCEPTED!</IonCol>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size='12' className='item-accepted-info-header'>
            <img className='img' src='assets/images/checkmark-green.svg' alt="" />
          </IonCol>
        </IonRow>

        <div className='item-accepted-desc-container'>
          <div className='item-accepted-desc'>
            YOU ACCEPTED <span style={{ color: '#D6980E' }}>@{tradeData?.initiator?.displayName} </span>
            TRADE OFFER FOR <span style={{ color: '#D6980E' }}>{tradeData?.products?.offered.name}</span>
          </div>
        </div>

        <div className='item-accepted-desc-container2'>
          <div className='item-accepted-desc2'>
            An email confirmation has been sent to your inbox. You can find and
            track this item under Completed Trades
          </div>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol className='item-accepted-container'>

              <div className='items-view-props'>

                <div className='items-view-props-left'>
                  <img
                    className='img'
                    src={tradeData?.products?.requested[0]?.url.length < 60 ?
                       `https://staging.thenobo.com/${tradeData?.products?.requested[0]?.url}`
                      : `${tradeData?.products?.requested.images[0]?.url}`}
                       alt={tradeData?.products?.requested.name}
                  />
                  <div className="accepted-accepted-item-name-left">{tradeData?.products?.requested.name}</div>
                  <div className="accepted-accepted-item-price-left">{currencyFormat.format(tradeData?.products?.requested.price)}</div>
                </div>

                <div className='items-view-props-center'>
                  <div className='line'></div>
                  <div className='circle'></div>
                  <img className='img' src='assets/images/12420.svg' alt="" />

                </div>

                <div className='items-view-props-right'>
                  {/* <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" /> */}
                  <img
                    className='img'
                    src={tradeData?.products?.offered[0]?.url.length < 60 ?
                       `https://staging.thenobo.com/${tradeData?.products?.offered[0]?.url}`
                      : `${tradeData?.products?.offered.images[0]?.url}`} alt={tradeData?.products?.offered.name}
                  />
                  <div className="accepted-accepted-item-name-right">{tradeData?.products?.offered.name}</div>
                  <div className="accepted-accepted-item-price-right">{currencyFormat.format(tradeData?.products?.offered.price)}</div>
                </div>
              </div>


            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="trade-accepted-btn-below">
          <IonButton className='btn' onClick={() => {
            history.push('/settings/trades')
          }} >VIEW MY TRADES</IonButton>
          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline'
            onClick={() => { history.push('/home/style-feed') }}
          >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default TradeAccepted
