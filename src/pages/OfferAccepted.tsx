import { useRef, useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonViewDidEnter,
  useIonViewWillEnter
} from '@ionic/react'
import './OfferAccepted.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import { TradesResponse, User } from '../models'
import { useParams, } from 'react-router'
import Button from '../components/Button'

 interface UserData{
  user:User
 }

const OfferAccepted: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])
  const [buyerName, setBuyerName] = useState('')
  const [prodName, setProdName] = useState('')
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  useIonViewDidEnter(() => {
    const productData:any = localStorage.getItem('acceptedOffer')
    const productName:any = localStorage.getItem('productName')
    if (productData && productName) {
      const pData = JSON.parse(productData)
      const pName = JSON.parse(productName)
        setTradesData(pData)
        setProdName(pName)
        console.log('resp',pData)

        userService.getBuyer(pData.buyer)
        .then((res:UserData) => {
          setBuyerName(res.user.displayName)
          console.log('buyer profile', res.user.displayName)
        })
        .catch((error) => {
          console.log(error)
        })

    }
    else{
      console.log('no product data or product name found in localStorage')

    }
  })




  const tradeData: any = tradesData
  // console.log(tradeData.offeredPrice)
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
            YOU ACCEPTED <span style={{ color: '#D6980E' }}>@{buyerName.toUpperCase()} </span>
            SALE OFFER OF <span style={{ color: '#D6980E' }}>{currencyFormat.format(parseInt(tradeData?.offeredPrice))} </span>
            FOR <span style={{ color: '#D6980E' }}>{prodName.toUpperCase()}</span>
          </div>
        </div>

        <IonRow >
          <IonCol size='12' className='offer-accepted-desc2'>
            An email confirmation has been sent to your inbox.
            You can find this item listed in Your Sales.
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol className='offer-accepted-next-step' size='12'>Your Next Step</IonCol>
          <IonCol className='offer-icon-container' size='1.2'>
            <div className='offer-circle'>
              <img className='line' src='assets/images/offer-track-line.svg' alt="" />
              <img height={12} width={12} className='package-slip_' src='assets/images/d-slip.svg' alt="" />

            </div>
            <div className='offer-circle'>
              <img className='line' src='assets/images/offer-track-line.svg' alt="line" />
              <img height={12} width={12} className='package-slip_' src='assets/images/offer-package.svg' alt="" />
            </div>
            <div className='offer-circle'>
              <img height={12} width={12} className='package-slip_' src='assets/images/drop-delivery.svg' alt="" />
            </div>
          </IonCol>
          <IonCol className='offer-guide-container' size='10.7' >
            <div className='guide1' >Download and print your prepaid shipping label.</div>
            <div className='download-offer-btn-container'>
              <IonButton fill='outline' className='download-offer-slip'>Download</IonButton>
            </div>
            <div className='guide2'>
              Package the item neatly in a box of your choosing,
              place the shipping label on the box
            </div>
            <div className='guide3'>
              Drop it off at USPS in a timely manner
              (within three business days). It will then be
              shipped to the Buyer on the shipping label.
            </div>
          </IonCol>

          {/*
          <IonCol className='offer-accepted-download-step'>
            <div className='offer-accepted-circle-1'>
            </div>
            <div className='print-prepaid-slip'>Download and print your prepaid shipping label.</div>
          </IonCol> */}
          {/*
          <IonCol size='12' className='offer-accepted-btn-box'>
           <IonButton fill='outline'>DOWNLOAD</IonButton>
          </IonCol> */}

          {/* <IonCol size='12' className='offer-accepted-package-step'>
            <div className='offer-accepted-circle-2'>
              <img height={12} width={12} className='package-slip' src='assets/images/d-slip.svg' alt="" />
            </div>
            <div className='package-prepaid-slip'>
              Package the item neatly in a box of your choosing,
             place the shipping label on the box.
             </div>
          </IonCol> */}

          {/* <IonCol size='12' className='offer-accepted-drop-shipping'>
            <div className='offer-accepted-circle-3'>
              <img height={12} width={12} className='drop-slip' src='assets/images/d-slip.svg' alt="" />
            </div>
            <div className='drop-shipping-slip'>
            Drop it off at USPS in a timely manner (within three business days).
             It will then be shipped to the Buyer on the shipping label.
             </div>
          </IonCol> */}

        </IonRow>
        <div className="trade-accepted-btn-below">
          <IonButton className='btn' onClick={() => {
            history.replace('/settings/sales')
            localStorage.removeItem('acceptedOffer')
            localStorage.removeItem('productName')

          }} >VIEW MY SALES</IonButton>
          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline'
            onClick={() => {
               history.replace('/home/style-feed')
               localStorage.removeItem('acceptedOffer')
               localStorage.removeItem('productName')
              }}
          >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default OfferAccepted
