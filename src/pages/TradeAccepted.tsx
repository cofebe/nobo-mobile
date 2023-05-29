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
import Button from '../components/Button'






const TradeAccepted: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()

  // useIonViewWillEnter(() => {
  //   userService.getOrders()
  //     .then((products) => {
  //       if (products) {
  //         setProductData([products])
  //       } else { console.log('something went wrong') }
  //     })
  //     .catch((err) => { console.log('err info while fetching products ', err) })
  // })





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
            YOU ACCEPTED <span style={{ color: '#D6980E' }}>@NBONNER’s</span>
            TRADE OFFER FOR <span style={{ color: '#D6980E' }}> THEIR PRODUCT NAME</span>
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
                  <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" />
                  <div className="accepted-accepted-item-name-left">BVLGARY Clutch</div>
                  <div className="accepted-accepted-item-price-left">$500</div>
                </div>

                <div className='items-view-props-center'>
                  <div className='line'></div>
                  <div className='circle'></div>
                  <img className='img' src='assets/images/12420.svg' alt="" />

                </div>

                <div className='items-view-props-right'>
                  <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" />
                  <div className="accepted-accepted-item-name-right">BVLGARY Clutch</div>
                  <div className="accepted-accepted-item-price-right">$1900</div>
                </div>
              </div>


            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="trade-accepted-btn-below">
          <IonButton className='btn' onClick={() => {
            history.push('/settings/trades')
          }} >VIEW MY TRADES</IonButton>
          <IonButton className='btn' fill='outline'
            onClick={() => { history.push('/home/style-feed') }}
          >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default TradeAccepted
