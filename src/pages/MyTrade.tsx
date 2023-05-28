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



  // const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  // // Filtering products
  // const filteredProduct = productsData[0]?.docs?.filter(product =>
  //   product.products[0]?.name.toLowerCase().includes(inputValue.toLowerCase(), 0) ||
  //   product.products[0]?.brand.toLowerCase().includes(inputValue.toLowerCase(), 0)
  // );



  return (
    <IonPage className='trade-item-main-container'>
      <IonHeader className='trade-item-header'>
        <IonToolbar className='trade-item-header-toolbar'>
          <IonGrid>
            <IonRow>
              <IonCol size='12'>
                <div className='trade-item-title'>
                  <div
                    className='trade-item-back-button'
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      history.goBack();
                    }}
                  >
                    <img src='assets/images/arrow-left.svg' alt='back' />
                  </div>
                  MY TRADES
                </div>
              </IonCol>
            </IonRow>

          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonRow>
        <IonCol size='12' className='trade-item-info-header'>
          <div >
            <img src='assets/images/trades-offers.png' alt="" />
          </div>
        </IonCol>
      </IonRow>
      <IonContent className='trade-item-content'>
        <IonGrid>
          <IonRow>
            <IonCol className='trade-item-container'>
              <div style={{backgroundColor:'yellow', width:'100%'}}>hello</div>
              <div className='trade-offer-line'></div>
              <div  className='trade-items-btn-container'>
                <IonButton className='trade-item-btn' fill='outline' onClick={() => { }} >DENY</IonButton>
                <IonButton className='trade-item-btn' onClick={() => { }} >ACCEPT</IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default MyTrade
