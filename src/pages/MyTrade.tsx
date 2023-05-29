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
import './MyTrade.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import Button from '../components/Button'






const MyTrade: React.FC = () => {
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
    <IonPage className='trade-item-main-container'>
      <IonRow style={{ backgroundColor: '#FEFCF7' }}>
        <IonCol className='trade-item-header' size='12'>
          <div
            className='trade-item-back-btn'
            onClick={() => {
              history.goBack()
            }}
          >
            <img
              height={23}
              src='assets/images/arrow-left.svg'
              alt='logo'
            />
          </div>

          <IonCol className='trade-item-title-text-container'>MY TRADES</IonCol>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size='12' className='trade-item-info-header'>
          <div
          onClick={()=>{
            history.push('/settings/trades/accepted/4')
          }}
          >
            <img src='assets/images/trade-offer.svg' alt="" />
          </div>
        </IonCol>
      </IonRow>
      <IonContent className='trade-item-content'>
        <IonGrid>
          <IonRow>
            <IonCol className='trade-item-container'>
              <div className='trade-item-status-container'>
                <div className="item-status">
                  <p className='status_'>STATUS</p>
                  <p className='status_text'>PENDING TRADE OFFER</p>
                </div>
                <div className="items-view-details">VIEW DETAILS</div>
              </div>
              <div className='items-view-props'>

                <div className='items-view-props-left'>
                  <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" />
                  <div className="trade-item-name-left">BVLGARY Clutch</div>
                  <div className="trade-item-price-left">$500</div>
                </div>

                <div className='items-view-props-center'>
                  <div className='line'></div>
                  <div className='circle'></div>
                  <img className='img' src='assets/images/12420.svg' alt="" />

                </div>

                <div className='items-view-props-right'>
                  <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" />
                  <div className="trade-item-name-right">BVLGARY Clutch</div>
                  <div className="trade-item-price-right">$1900</div>
                </div>
              </div>

              <div className='trade-offer-line'></div>
              <div className='trade-items-btn-container'>
                <IonButton className='trade-item-btn' fill='outline' onClick={() => {
            history.push('/settings/trades/denied/5')
           }} >DENY</IonButton>
                <IonButton className='trade-item-btn'  onClick={() => {
            history.push('/settings/trades/accepted/5')
           }} >ACCEPT</IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default MyTrade
