import { IonButton, IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../components/Header'
import './MyOffers.scss'
import { UserService } from '../services/UserService'
import { CreateProductResponse } from '../models'
import { useHistory } from 'react-router'
import { formatPrice, getImageUrl } from '../utils'





interface OfferResponse {
  product: CreateProductResponse
  status: string
  _id: string
  updatedAt: string
  offeredPrice: number



}

const MyOffers: React.FC = () => {
  const history = useHistory()
  const userService = new UserService()
  const [offerData, setTradesData] = useState<OfferResponse[]>([])


  useIonViewWillEnter(() => {
    userService.getOffers()
      .then((res: any) => {
        setTradesData(res)
      })
      .catch((error) => { console.log(error) })
  })

  const acceptOffer = (offerId: string, productName: string) => {
    userService.acceptOffer(offerId)
      .then((res: any) => {
        if (res.error === 'you are too late') {
          console.log(res.error)
        } else {
          setTimeout(() => {
            localStorage.setItem('acceptedOffer', JSON.stringify(res))
            localStorage.setItem('productName', JSON.stringify(productName))
            history.push(`/settings/offers/offer-accepted/${offerId}`)
          }, 200);
        }
      })
      .catch((error) => { console.log(error) })
  }



  const denyOffer = (offerId: string, productPrice: number) => {
    userService.denyOffer(offerId)
      .then((res: any) => {
        console.log('before the condition', res)
        if (res.error === 'you are too late') {
          console.log(res.error)
        } else {
          setTimeout(() => {
            localStorage.setItem('buyerId', JSON.stringify(res))
            localStorage.setItem('productPrice', JSON.stringify(productPrice))
            history.push(`/settings/offers/offer-denied/${offerId}`)
          }, 200);
        }
      })
      .catch((error) => { console.log(error) })
  }


// console.log(offerData)
  return (
    <IonPage className='my-offers-main-container'>
      <Header
        title='MY OFFERS'
      />
      <IonContent className='my-offers-ion-content'>
        {/* offer.status === 'pending' && */}
        {offerData?.map((offer) => (
          <div key={offer._id}>
            <IonRow style={{ padding: '0px' }}>
              <IonCol className='my-offers-item-container'>
                <div className='img'
                  style={{
                    backgroundImage: offer?.product.images?.length
                      ? getImageUrl(offer?.product.images[0]?.url)
                      : '',
                  }}
                > </div>
                <div>
                  <p className={
                    offer?.status === 'pending' ?
                      'offer-pending' :
                      offer?.status === 'rejected' ?
                        'offer-rejected'
                        : 'offer-accepted'}>
                    OFFER  {` ${offer?.status}`}
                  </p>
                  <p className='product-name'>{`${offer?.product.brand} ${offer.product.name}`}</p>
                  <p className='price'>{formatPrice(offer?.offeredPrice)}</p>
                  <p className='offered-price'>Price you offered</p>
                </div>
              </IonCol>
            </IonRow>

            <IonRow style={{ marginTop: '10px' }}>
              <IonCol className='view-my-purchases_btn' >

                <div className='btn-container'>
                  {
                    offer.status === 'pending' ?
                      <p
                        className='browse-shop'
                        onClick={() => {
                          history.push(`/home/style-feed`)
                        }}>
                        Browse Shop
                      </p>

                      : offer.status === 'accepted' ?
                        <p
                          className='browse-shop'
                          onClick={() => {
                            history.push('/settings/sales')
                          }}>
                          View in my sales
                        </p>
                        : offer.status === 'rejected' ?
                          <IonButton
                          fill='outline'
                            className='rejected-btn'
                            onClick={() => {
                              history.push(`/home/product/${offer._id}`)
                            }}
                            >BUY AT A LISTED PRICE
                            </IonButton>

                          :
                          <>
                            <IonButton className='btn-deny' fill='outline'
                              onClick={() => { denyOffer(offer._id, offer.product.price) }}
                            >DENY</IonButton>

                            <IonButton className='btn-accept'
                              onClick={() => { acceptOffer(offer._id, offer.product.name) }}
                            >ACCEPT</IonButton>
                          </>
                  }
                </div>

                <p className='date'>{new Date(offer?.updatedAt).toDateString().slice(0 - 11)}</p>

              </IonCol>
            </IonRow>


            <div className='my-0ffers-seperator'></div>
          </div>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default MyOffers
