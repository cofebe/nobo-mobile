import { useRef, useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonViewWillEnter
} from '@ionic/react'
import './MyTrade.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import { TradesResponse } from '../models'
import { formatPrice, getImageUrl } from '../utils'



const MyTrade: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])


  useIonViewWillEnter(() => {
    userService.getMyTrades()
      .then((products) => {
        if (products) {
          setTradesData([products])
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
            history.push(`trades/denied/${productId}`)
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
            history.push(`trades/accepted/${productId}`)
          }, 500);
        } else {
          console.log('trade accept fail')
        }

      })
      .catch((error) => {
        console.log('error denying trade : ', error)
      })
  }




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
      <IonContent className='trade-item-content'

      >
        <IonGrid>
          {/* product.status === 'pending' && */}
          {tradesData[0]?.received.map((product: any) => (
            <IonRow key={product._id} style={{ marginBottom: '14px' }}
              onClick={() => {
                if (product.status === 'accepted') {
                  // productDetails(product._id)
                  // console.log('first push', product)
                  history.push({ pathname: `trades/details/${product._id}`, state: product })

                }
              }}
            >
              <IonCol className='trade-item-container'>
                <div className='trade-item-status-container'>
                  <div className="item-status">
                    <p className='status_'>STATUS</p>
                    {product.status !== 'accepted' ? (<p className='status_text'>{product.status.toUpperCase()} TRADE OFFER</p>) :
                      (<p className='status_text-accepted'>TRADE {product.status.toUpperCase()}</p>)
                    }
                  </div>
                  <div className="items-view-details"></div>
                </div>
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
                    <img className='img' src='assets/images/12420.svg' alt="" />

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

                <div className='trade-offer-line'></div>
                {product?.status === 'pending' ? (<div className='trade-items-btn-container'>
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
                </div>) :
                  <div className='trade-items-btn-container-2'>
                    Oops! It looks like this Product is no longer available.
                  </div>
                }
              </IonCol>
            </IonRow>
          ))}

        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default MyTrade
