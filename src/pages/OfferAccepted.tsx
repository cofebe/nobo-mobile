import { useRef, useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonViewWillEnter
} from '@ionic/react'
import './OfferAccepted.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import { TradesResponse } from '../models'
import { useParams, } from 'react-router'
import Button from '../components/Button'



const OfferAccepted: React.FC = () => {
  const history = useHistory()
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  useIonViewWillEnter(() => {
    const data1 = localStorage.getItem('acceptTradeData')
    if (data1) {
      const resp = JSON.parse(data1)
      setTradesData(resp)
    }
  })


  const tradeData: any = tradesData

  return (
    <IonPage className='offer-accepted-item-main-container'>
      <IonContent className='offer-accepted-content'>
        <IonRow style={{ backgroundColor: '#FEFCF7' }}>
          <IonCol className='offer-accepted-item-header' size='12'>
            <IonCol className='offer-accepted-title-text-container'>OFFER ACCEPTED!</IonCol>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size='12' className='offer-accepted-info-header'>
            <img className='img' src='assets/images/checkmark-green.svg' alt="" />
          </IonCol>
        </IonRow>

        <div className='offer-accepted-desc-container'>
          <div className='offer-accepted-desc'>
            YOU ACCEPTED <span style={{ color: '#D6980E' }}>@{tradeData?.initiator?.displayName} </span>
            SALE OFFER FOR <span style={{ color: '#D6980E' }}>{tradeData?.products?.offered.name}</span>
          </div>
        </div>

        <div className='offer-accepted-desc-container2'>
          <div className='offer-accepted-desc2'>
            An email confirmation has been sent to your inbox.
            You can find this item listed in Your Sales.
          </div>
        </div>

        <IonRow>
          <IonCol className='offer-accepted-next-step' size='12'>Your Next Step</IonCol>

          <IonCol className='offer-accepted-download-step'>
            <div className='offer-accepted-circle-1'>
              <img height={12} className='download-slip' src='assets/images/d-slip.svg' alt="" />
            </div>
            <div className='print-prepaid-slip'>Download and print your prepaid shipping label.</div>
          </IonCol>

          <IonCol size='12' className='offer-accepted-btn-box'>
           <IonButton fill='outline'>DOWNLOAD</IonButton>
          </IonCol>

          <IonCol size='12' className='offer-accepted-package-step'>
            <div className='offer-accepted-circle-2'>
              <img height={12} width={12} className='package-slip' src='assets/images/d-slip.svg' alt="" />
            </div>
            <div className='package-prepaid-slip'>
              Package the item neatly in a box of your choosing,
             place the shipping label on the box.
             </div>
          </IonCol>

          <IonCol size='12' className='offer-accepted-drop-shipping'>
            <div className='offer-accepted-circle-3'>
              <img height={12} width={12} className='drop-slip' src='assets/images/d-slip.svg' alt="" />
            </div>
            <div className='drop-shipping-slip'>
            Drop it off at USPS in a timely manner (within three business days).
             It will then be shipped to the Buyer on the shipping label.
             </div>
          </IonCol>

        </IonRow>
        <div className="trade-accepted-btn-below">
          <IonButton className='btn' onClick={() => {
            history.replace('/settings/trades')
            localStorage.removeItem('acceptTradeData')

          }} >VIEW MY TRADES</IonButton>
          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline'
            onClick={() => { history.replace('/home/style-feed') }}
          >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default OfferAccepted
