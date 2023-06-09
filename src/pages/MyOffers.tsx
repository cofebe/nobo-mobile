import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../components/Header'
import './MyOffers.scss'
import { UserService } from '../services/UserService'
import { FullOrder, TradesResponse, UserReview } from '../models'

const MyOffers: React.FC = () => {
const userService = new UserService()
  const [offerData, setTradesData] = useState<UserReview[]>([])
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })


useIonViewWillEnter(()=>{
userService.getOffers()
.then((res)=>{
  // console.log(res[0])
  setTradesData([res])
})
.catch((error)=>{console.log(error)})
})


const data:any = offerData[0]

// console.log('the offer data ', data[0]?.map((p:any)=>p))
console.log('the offer data ', data[0]?.product)
  return (
    <IonPage className='my-offers-main-container'>
      <Header
        title='MY OFFERS'
      />
      <IonContent className='my-offers-ion-content'>
      {/* {data[0]?.product.map((offer:UserReview)=>( */}
        <div>
        <IonRow style={{ padding: '0px' }}>
          <IonCol className='my-offers-item-container'>
            <img src={`${data[0]?.product.images[0]?.url}`} alt=""
              className='img'
            />
            <div>
              <p className='offer-accepted'>Offer accepted</p>
              <p className='product-name'>{`${data[0]?.product.brand} ${data[0]?.product.name}`}</p>
              <p className='price'>{currencyFormat.format(data[0]?.product.price)}</p>
              <p className='offered-price'>Price you offered</p>
            </div>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol className='view-my-purchases'>
            <p className='browse-shop'>View in my purchases</p>
            <p className='date'>{new Date(data[0]?.product.updatedAt).toDateString().slice(0 - 11)}</p>
          </IonCol>
        </IonRow>
        <div className='my-0ffers-seperator'></div>
        </div>
      {/* )) } */}
      </IonContent>
    </IonPage>
  )
}

export default MyOffers
