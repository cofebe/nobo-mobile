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
import './TradeDenied.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import Button from '../components/Button'






const TradeDenied: React.FC = () => {
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
            YOU DENIED <span style={{ color: '#D6980E', fontStyle: 'italic' }}>@NBONNER’s </span>
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
                  <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" />
                  {/* <div className="denied-item-name-left">BVLGARY Clutch</div>
                  <div className="adenied-item-price-left">$500</div> */}
                </div>

                <div className='items-view-props-center'>
                  <div className='line'></div>
                  <img height={18} className='img' src='assets/images/trade-denied-error.svg' alt="" />
                </div>

                <div className='items-view-props-right'>
                  <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" />
                  {/* <div className="denied-item-name-right">BVLGARY Clutch</div>
                  <div className="denied-item-price-right">$1900</div> */}
                </div>
              </div>


            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="trade-denied-btn-below">
          <IonButton className='btn' onClick={() => {
            history.push('/home/closet/trade')
          }} >VIEW MY CLOSET</IonButton>
          <IonButton className='btn' fill='outline' onClick={() => {
            history.push('/home/style-feed')
          }} >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default TradeDenied
