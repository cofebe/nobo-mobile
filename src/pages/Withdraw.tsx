import React, { useState } from 'react'
import './Withdraw.scss'
import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import Header from '../components/Header'
import { UserService } from '../services/UserService'
import { formatPrice } from '../utils'

interface AccResponse {
  availableFunds: number
  pendingFunds: number
}

const Withdraw: React.FC = () => {
  const userService = new UserService()
  const [pendingFunds, setPendingFunds] = useState<number>(0)
  const [availableFunds, setAvailableFunds] = useState<number>(0)

  useIonViewWillEnter(() => {
    userService.getAccount()
      .then((res: AccResponse) => {
        setPendingFunds(res.pendingFunds)
        setAvailableFunds(res.availableFunds)
        console.log('res', res)
      })
      .catch((error) => { console.log('err getting acc details', error) })
  })


  return (
    <IonPage className='withdraw-main-container'>
      <Header title='WITHDRAWAL REQUESTS' />
      <IonContent className='withdraw-content'>

        <IonRow className='withraw-card-container'>
          <IonCol className='withraw-card'>
            <div className="status">PENDING FUNDS</div>
            <div className="balance">{formatPrice(pendingFunds)}</div>
            <div className="info">
              TheNOBO may hold your funds from
              a sale for up to 21 days after your
              item has been delivered to the buyer
              to ensure the security of the transaction.
              Once the sale has been confirmed, the funds
              will no longer be pending and appear as “Available Funds.”

            </div>
          </IonCol>
        </IonRow>
        <IonRow className='withraw-card-container'>
          <IonCol className='withraw-card'>
            <div className="status">AVAILABLE FUNDS</div>
            <div className="balance">{formatPrice(availableFunds)}</div>
            <div className="info">
              TheNOBO may hold your funds from
              a sale for up to 21 days after your
              item has been delivered to the buyer
              to ensure the security of the transaction.
              Once the sale has been confirmed, the funds
              will no longer be pending and appear as “Available Funds.”

            </div>
          </IonCol>
        </IonRow>
        <IonRow className='withdraw-payment-method'>
          <IonCol className='title'>PAYMENT METHOD</IonCol>
        </IonRow>
        <IonRow className='withdraw-payment-method-box'>

          <IonCol size='5.5' className='payment-box'>
            <div className='img-container'>
              <img className='' height={78} src='assets/images/test/your-bank-eclips.svg' alt="" />
              <img className='img' height={74} src='assets/images/test/paypal-tab.svg' alt="" />
            </div>
            <div className="info1">PayPal</div>
            <div className="info2">Instantly in account</div>

          </IonCol>
          <IonCol size='5.5' className='payment-box'>
            <div className='img-container'>
              <img className='' height={78} src='assets/images/test/your-bank-eclips.svg' alt="" />
              <img className='img2' height={43} src='assets/images/test/bank.svg' alt="" />
            </div>
            {/* <div className="info1">PayPal</div> */}
            <div className="info3">Add your Bank 1-3 Business Days</div>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default Withdraw
