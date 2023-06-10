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
import './OfferDenied.scss'
import { useHistory, } from 'react-router'
import { User } from '../models'
import { UserService } from '../services/UserService'

interface UserData{
  user:User
 }

const OfferDenied: React.FC = () => {
  const userService = new UserService()
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const history = useHistory()
  const [buyersId, setBuyerId] = useState('')
  const [productsPrice, setProductPrice] = useState('')



  useIonViewWillEnter(() => {
    const buyerId = localStorage.getItem('buyerId')
    const productPrice = localStorage.getItem('productPrice')

    if (productPrice && buyerId) {
      const bId = JSON.parse(buyerId)
      const pPrice = JSON.parse(productPrice)

      setProductPrice(pPrice)

      userService.getBuyer(bId.buyer)
        .then((res:UserData) => {
          setBuyerId(res.user.displayName)
          console.log('buyer profile', res.user.displayName)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    else{
      console.log('no offer data found in localStorage')
    }
  })


  // const product: any = tradesData


  return (
    <IonPage className='offer-denied-item-main-container'>
      <IonContent className='offer-denied-content'>
        <IonRow style={{ backgroundColor: '#FEFCF7' }}>
          <IonCol className='offer-denied-item-header' size='12'>
            <IonCol className='offer-denied-title-text-container'>OFFER DENIED</IonCol>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size='12' className='offer-denied-info-header'>
            <img className='img' height={18} src='assets/images/trade-denied-error.svg' alt="" />
          </IonCol>
        </IonRow>

        <div className='offer-denied-desc-container'>
          <div className='offer-denied-desc'>
            YOU DENIED <span style={{ color: '#D6980E', fontStyle: 'italic' }}>@{buyersId} </span>
             OFFER FOR <span style={{ color: '#D6980E' }}>
              {currencyFormat.format(parseInt(productsPrice))}</span>
          </div>
        </div>

        <div className='offer-denied-container2'>
          <div className='offer-denied-desc2'>
          No problem! Your item will still be available in your
          sales closet for other offers or purchases.
          </div>
        </div>

        <IonGrid>
          <IonRow>


          </IonRow>
        </IonGrid>
        <div className="offer-denied-btn-below">
          <IonButton className='btn' onClick={() => {
            history.replace('/home/closet/trade')
            localStorage.removeItem('buyerId')
            localStorage.removeItem('productPrice')

          }} >VIEW MY CLOSET</IonButton>
          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline' onClick={() => {
            history.replace(`/home/style-feed`)
            localStorage.removeItem('buyerId')
            localStorage.removeItem('productPrice')
          }} >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default OfferDenied
