import { IonButton, IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../components/Header'
import './MyOffers.scss'
import { UserService } from '../services/UserService'
import { CreateProductResponse, User } from '../models'
import { useHistory } from 'react-router'
import { formatPrice, getImageUrl } from '../utils'





interface OfferResponse {
  buyer: string;
  seller: string;
  product: CreateProductResponse
  status: string;
  _id: string;
  updatedAt: string;
  createdAt: string;
  offeredPrice: number;



}

const MyOffers: React.FC = () => {
  const history = useHistory()
  const userService = new UserService()
  const [offerData, setTradesData] = useState<OfferResponse[]>([])
  const [experienceOption, setExperienceOption] = useState('')
  const [userId, setUser] = useState<string>('')


  const getMe = () => {
    userService.getMe()
      .then((user: User) => {
        setExperienceOption(user.experiencePreferences)
        setUser(user._id)
      })
      .catch((error: Error) => {
        console.log(error)
      })
  }


  useIonViewWillEnter(() => {
    getMe()
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


  return (
    <IonPage className='my-offers-main-container'>
      <Header
        title='MY OFFERS'
      />
      {offerData?.length < 1 ?
        <IonContent className='my-offers-ion-content'>
          <IonRow>You have no offers to view</IonRow>
        </IonContent>
        :
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
                    {offer.status === 'pending' && offer.seller !== userId && (<p className='offer-pending'>REQUEST {offer?.status}</p>)}
                    {offer.status === 'accepted' && (<p className='offer-accepted'>REQUEST {offer?.status}</p>)}
                    {offer.status === 'rejected' && (<p className='offer-rejected'>REQUEST NOT ACCEPTED</p>)}
                    {offer.status === 'pending' && offer.seller === userId && (<p className='offer-request'>OFFER REQUEST</p>)}
                    <p className='product-name'>{`${offer?.product.brand} ${offer.product.name}`}</p>
                    <p className='price'>{formatPrice(offer?.offeredPrice)}</p>
                    { }
                    <p className='offered-price'>
                      {offer.status === 'pending' && offer.seller === userId ? 'Price offered' : 'Price you offered'}
                    </p>
                  </div>
                </IonCol>
              </IonRow>

              <IonRow style={{ marginTop: '10px' }}>
                <IonCol className='view-my-purchases_btn' >

                  <div className='btn-container'>
                    {
                      offer.status === 'pending' && offer.seller !== userId ?
                        <p
                          className='browse-shop'
                          onClick={() => {
                            history.push(`/home/explore/${experienceOption}/explore`)
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
                              size='small'
                              fill='outline'
                              className='rejected-btn'
                              onClick={() => {
                                history.push(`/home/product/${offer.product._id}`)
                              }}
                            >BUY AT A LISTED PRICE
                            </IonButton>

                            :
                            offer.status === 'pending' && offer.seller === userId ?

                              <>
                                <IonButton
                                  size='small'
                                  className='btn-deny'
                                  fill='outline'
                                  onClick={() => { denyOffer(offer._id, offer.product.price) }}
                                >DENY</IonButton>

                                <IonButton
                                  size='small'
                                  className='btn-accept'
                                  onClick={() => { acceptOffer(offer._id, offer.product.name) }}
                                >ACCEPT</IonButton>
                              </>
                              : ''}
                  </div>

                  <p className='date'>{new Date(offer?.updatedAt).toDateString().slice(0 - 11)}</p>

                </IonCol>
              </IonRow>


              <div className='my-0ffers-seperator'></div>
            </div>
          ))}
        </IonContent>}
    </IonPage>
  )
}

export default MyOffers
