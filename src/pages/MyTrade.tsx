import { useRef, useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonToast,
  useIonViewWillEnter
} from '@ionic/react'
import './MyTrade.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import { TradesResponse } from '../models'
import { formatPrice, getImageUrl } from '../utils'


interface ReminderResponse {
  success: boolean;
}


const MyTrade: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const [receivedTradeOffer, setReceivedTradeOffer] = useState<any[]>([])
  const [sentTradeOffer, setSentTradeOffer] = useState<any[]>([])
  // const [tradesData, setTradesData] = useState<any[]>([])


  const [present] = useIonToast();

  const presentToast = (position: 'top' | 'middle' | 'bottom') => {
    present({
      message: `Reminder Sent`,
      duration: 1800,
      position: position,
    });
  };



  useIonViewWillEnter(() => {
    userService.getMyTrades()
      .then((products) => {
        if (products) {

          const receivedTrade = products?.received?.sort((a: any, b: any) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
          const status: any = {
            'pending': 1,
            'accepted': 2,
            'rejected': 3,
            'invalid': 4,
          }
          const recievedData = receivedTrade.sort((a: any, b: any) => status[a.status] - status[b.status]);

          const sentTrade = products?.sent?.sort((a: any, b: any) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())

          const sentData = sentTrade.sort((a: any, b: any) => status[a.status] - status[b.status]);


          setReceivedTradeOffer(recievedData)
          setSentTradeOffer(sentData)


        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  })

  const denyTrade = (productId: string) => {
    userService.denyTradeOffer(productId)
      .then((res: TradesResponse) => {
        if (res) {

          setTimeout(() => {
            localStorage.setItem('denyTradeData', JSON.stringify(res))
            history.push(`/settings/trades/denied/${productId}`)
          }, 1000);
        } else {
          return
        }
      })
      .catch((error) => {
        console.log('error denying trade : ', error)
      })
  }


  const acceptTrade = (productId: string) => {
    userService.acceptTradeOffer(productId)
      .then((res: TradesResponse) => {
        if (res) {
          console.log('response from acacepted trade ', res)
          setTimeout(() => {
            localStorage.setItem('acceptTradeData', JSON.stringify(res))
            history.push(`/settings/trades/accepted/${productId}`)
          }, 500);
        } else {
          console.log('trade accept fail')
        }

      })
      .catch((error) => {
        console.log('error denying trade : ', error)
      })
  }


  function sendReminder(tradeId: string) {
    userService.sendReminder(tradeId)
      .then((response: ReminderResponse) => {
        if (response.success) {
          // console.log('reminder sent successfully')
          presentToast('top')
        } else {
          console.log('something went wrong')
        }
      })
      .catch((error) => { console.log('error sending reminder', error) })
  }


  // const receivedTrade = tradesData[0]?.received.sort((a: any, b: any) =>
  //   new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())

  // console.log('Rtrade down', receivedTrade)


  // const sentTrade = tradesData[0]?.sent.sort((a: any, b: any) =>
  //   new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());



  return (
    <IonPage className='trade-item-main-container'>
      <IonRow>
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
            onClick={() => {
              history.replace('/settings/trades/trades-completed')
            }}
          >
            <img src='assets/images/trade-offer.svg' alt="" />
          </div>
        </IonCol>
      </IonRow>
      {sentTradeOffer?.length === 0 && receivedTradeOffer?.length === 0 ?
        <IonContent className='trade-item-content'>
          <IonRow>You have no pending trades!</IonRow>
        </IonContent>
        :
        <IonContent className='trade-item-content'>
          <IonGrid>

            {/* OFFER I SENT */}
            {sentTradeOffer?.map((product: any) => (
              <IonRow key={product._id} style={{ marginBottom: '14px' }}>
                <IonCol
                  className={
                    product.status === 'rejected' ?
                      'trade-item-container-xsm'
                      : product.status === 'accepted' ?
                        'trade-item-container-sm'
                        : product.status === 'invalid' ?
                          'trade-item-container-xsm'
                          :
                          'trade-item-container'
                  }>

                  <div className='trade-item-status-container' >
                    {product.status === 'pending' && (
                      <div className="item-status-pending" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-pending'>{product.status.toUpperCase()} TRADE OFFER</p>
                      </div>
                    )}
                    {product.status === 'accepted' && (
                      <div className="item-status-accepted" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-accepted'>TRADE {product.status.toUpperCase()}</p>
                      </div>
                    )}
                    {product.status === 'rejected' && (
                      <div className="item-status-rejected" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-rejected'>TRADE REQUEST DENIED</p>
                        <p className='view-details'
                          onClick={() => {
                            history.push({ pathname: `trades/details/${product._id}`, state: product })
                          }}
                        >
                          VIEW DETAILS</p>
                      </div>
                    )}
                    {product.status === 'invalid' && (
                      <div className="item-status-invalid" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-invalid'>INVALID TRADE</p>
                        {/* <p className='view-details'></p> */}
                      </div>
                    )}
                  </div>
                  {product.status === 'accepted' && (
                    <div className='trade-accepeted-email'>You will receive an email when you order has been shipped.</div>
                  )}


                  <div className='items-view-props'
                    onClick={() => {
                      if (product.status === 'pending') {
                        history.push({ pathname: `trades/details/${product._id}`, state: product })
                      }
                    }}>
                    <div className='items-view-props-left'>
                      <div className='item-img-left'
                        style={{
                          backgroundImage: product.products.offered.images?.length
                            ? getImageUrl(product.products.offered.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <div className="trade-item-name-left">{product.products.offered.name.toUpperCase()}</div>
                      <div className="trade-item-price-left">{formatPrice(product.products.offered.price)}</div>
                    </div>

                    {product?.status === 'pending' && (<div className='trade-offer-line'></div>)}

                    <div className='items-view-props-center'>
                      <div className='line'></div>
                      <div className='circle'></div>
                      <img className='img' src='assets/images/trade-hands.svg' alt="" />

                    </div>

                    <div className='items-view-props-right'>
                      <div className='item-img-right'
                        style={{
                          backgroundImage: product.products.requested.images?.length
                            ? getImageUrl(product.products.requested.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <div className="trade-item-name-right">{product.products.requested.name.toUpperCase()}</div>
                      <div className="trade-item-price-right">{formatPrice(product.products.requested.price)}</div>
                    </div>
                  </div>


                  {product?.status === 'pending' ?
                    (<div className='trade-items-pending-sent'>
                      <div></div>
                      <IonButton
                        className='btn-reminder'
                        onClick={() => {
                          sendReminder(product._id)
                        }}
                      >
                        SEND REMINDER
                      </IonButton>
                    </div>)

                    // product?.status === 'invalid' ?

                    //   <div className='trade-items-btn-container-invalid'>
                    //     Your trade offer was not accepted
                    //   </div>
                    //   : product?.status === 'accepted' ?
                    //     ''
                    :
                    ''
                    // <div className='trade-items-btn-container-2'>
                    //   Oops! It looks like this Product is no longer available.
                    // </div>
                  }
                </IonCol>
              </IonRow>
            ))}



            {/* TRADE OFFER RECIEVED */}
            {receivedTradeOffer?.map((product: any) => (
              <IonRow key={product._id} style={{ marginBottom: '14px' }}>
                <IonCol
                  className={
                    product.status === 'rejected' ?
                      'trade-item-container-xsm'
                      : product.status === 'accepted' ?
                        'trade-item-container-sm'
                        : product.status === 'invalid' ?
                          'trade-item-container-xsm'
                          :
                          'trade-item-container'
                  }>
                  <div className='trade-item-status-container'>
                    {product.status === 'pending' && (
                      <div className="item-status-pending" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-pending'>{product.status.toUpperCase()} TRADE OFFER</p>
                      </div>
                    )}
                    {product.status === 'accepted' && (
                      <div className="item-status-accepted" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-accepted'>TRADE {product.status.toUpperCase()}</p>
                      </div>
                    )}
                    {product.status === 'rejected' && (
                      <div className="item-status-rejected" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-rejected'>TRADE REQUEST DENIED</p>
                        <p
                          className='view-details'
                          onClick={() => {
                            history.push({ pathname: `trades/details/${product._id}`, state: product })
                          }}
                        >VIEW DETAILS</p>

                      </div>
                    )}
                    {product.status === 'invalid' && (
                      <div className="item-status-invalid" >
                        <p className='status_'>STATUS</p>
                        <p className='status_text-invalid'>INVALID TRADE</p>
                        {/* <p className='view-details'></p> */}
                      </div>
                    )}
                  </div>

                  {product.status === 'accepted' && (
                    <div className='trade-accepeted-email'>You will receive an email when you order has been shipped.</div>
                  )}



                  <div className='items-view-props'>
                    <div className='items-view-props-left'>
                      <div className='item-img-left'
                        style={{
                          backgroundImage: product.products.requested.images?.length
                            ? getImageUrl(product.products.requested.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <div className="trade-item-name-left">{product.products.requested.name.toUpperCase()}</div>
                      <div className="trade-item-price-left">{formatPrice(product.products.requested.price)}</div>
                    </div>

                    <div className='items-view-props-center'>
                      <div className='line'></div>
                      <div className='circle'></div>
                      <img className='img' src='assets/images/trade-hands.svg' alt="" />

                    </div>

                    <div className='items-view-props-right'>
                      <div className='item-img-right'
                        style={{
                          backgroundImage: product.products.offered.images?.length
                            ? getImageUrl(product.products.offered.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <div className="trade-item-name-right">{product.products.offered.name.toUpperCase()}</div>
                      <div className="trade-item-price-right">{formatPrice(product.products.offered.price)}</div>
                    </div>
                  </div>

                  {product?.status === 'pending' && (<div className='trade-offer-line'></div>)}
                  {product?.status === 'pending' ? (
                    <div className='trade-items-btn-container-pending'>
                      <IonButton
                        style={{ backgroundColor: 'white' }}
                        size='small' className='trade-item-btn'
                        fill='outline'
                        onClick={() => {
                          denyTrade(product._id)
                        }} >DENY</IonButton>

                      <IonButton size='small'
                        className='trade-item-btn'
                        onClick={() => {
                          acceptTrade(product._id)
                        }} >ACCEPT
                      </IonButton>
                    </div>)
                    :
                    // product?.status === 'invalid' ?
                    //   <div className='trade-items-btn-container-invalid'>
                    //     It looks like someone else has completed a trade offer for this product
                    //   </div>

                    //   :
                    ''
                  }
                </IonCol>
              </IonRow>
            ))}




          </IonGrid>
        </IonContent>
      }
    </IonPage>
  )



}

export default MyTrade
