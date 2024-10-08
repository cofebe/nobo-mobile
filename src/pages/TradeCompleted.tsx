import { useState } from 'react'
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  useIonViewWillEnter
} from '@ionic/react'
import './TradeCompleted.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'
import { TradesResponse } from '../models'
import { formatPrice, getImageUrl } from '../utils'



const TradeCompleted: React.FC = () => {
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




  return (
    <IonPage className='trade-completed-main-container'>
      <IonRow>
        <IonCol className='trade-completed-item-header' size='12'>
          <div
            className='trade-completed-item-back-btn'
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
          <IonCol className='trade-completed-item-title-text-container'>MY TRADES</IonCol>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size='12' className='trade-completed-item-info-header'>
          <div
            onClick={() => {
              history.replace('/settings/trades')
            }}
          >
            <img src='assets/images/trades-completed.svg' alt="" />
          </div>
        </IonCol>
      </IonRow>
      {tradesData[0]?.received?.length === 0 && tradesData[0]?.sent?.length === 0 ?
        <IonContent className='trade-completed-item-content'>
          <IonRow>You have no completed trades!</IonRow>
        </IonContent>
        :
        <IonContent className='trade-completed-item-content'>
          <IonGrid>

            {tradesData[0]?.sent.map((product: any) => product.status === 'accepted' ? (
              // <div>{product.status}</div>
              <IonRow key={product._id} style={{ marginBottom: '14px' }}>
                <IonCol size='12' className='trade-completed-item-container'>
                  <div className="trade-completed-status-container">
                    <div className='left-status-container'>
                      <p className='status'>STATUS</p>
                      <p className='status-text'>{product.status.toUpperCase()}</p>
                    </div>
                    <p className='track-shipping'>Track Shipping</p>
                  </div>
                  <div className="trade-completed-props-container">
                    <div className="trade-completed-props-left">
                      <div className="trade-completed-line-l"></div>
                      <div className='trade-completed-circle-l'></div>
                      <img className='trade-completed-connect-l' src='assets/images/trade-hands.svg' alt="" />
                      <div className='trade-completed-img-l'
                        style={{
                          backgroundImage: product.products.requested.images?.length
                            ? getImageUrl(product.products.requested.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <div className='trade-completed-img-r'
                        style={{
                          backgroundImage: product.products.offered.images?.length
                            ? getImageUrl(product.products.offered.images[0]?.url)
                            : '',
                        }}
                      > </div>

                    </div>
                    <div className="trade-completed-props-right">
                      <div className="trade-with-container-l">
                        <p className="trade-with-title">TRADE WITH</p>
                        <p className="trade-with-name">@{product.recipient.displayName}</p>
                        <p className="trade-fee">TRADE FEE</p>
                        <p className="trade-amount">{formatPrice(product.fee)}</p>
                      </div>
                      <div className="trade-with-container-r">
                        <p className="trade-accepted-title">TRADE WITH</p>
                        <p className="trade-accepted-date">{new Date(product.updatedAt).toDateString().slice(0 - 11)}</p>
                        <p className="trade-value-title">TRANSACTION VALUE</p>
                        <p className="trade-value-text">{formatPrice(product.total)}</p>
                      </div>
                    </div>

                  </div>

                </IonCol>
              </IonRow>
            ) : '')}





            {tradesData[0]?.received.map((product: any) => product.status === 'accepted' ? (
              // <div>{product.status}</div>
              <IonRow key={product._id} style={{ marginBottom: '14px' }}>
                <IonCol size='12' className='trade-completed-item-container'>
                  <div className="trade-completed-status-container">
                    <div className='left-status-container'>
                      <p className='status'>STATUS</p>
                      <p className='status-text'>{product.status.toUpperCase()}</p>
                    </div>
                    <p className='track-shipping'>Track Shipping</p>
                  </div>
                  <div className="trade-completed-props-container">
                    <div className="trade-completed-props-left">
                      <div className="trade-completed-line-l"></div>
                      <div className='trade-completed-circle-l'></div>
                      <img className='trade-completed-connect-l' src='assets/images/trade-hands.svg' alt="" />
                      <div className='trade-completed-img-l'
                        style={{
                          backgroundImage: product.products.requested.images?.length
                            ? getImageUrl(product.products.requested.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <div className='trade-completed-img-r'
                        style={{
                          backgroundImage: product.products.offered.images?.length
                            ? getImageUrl(product.products.offered.images[0]?.url)
                            : '',
                        }}
                      > </div>

                    </div>
                    <div className="trade-completed-props-right">
                      <div className="trade-with-container-l">
                        <p className="trade-with-title">TRADE WITH</p>
                        <p className="trade-with-name">@{product.initiator.displayName}</p>
                        <p className="trade-fee">TRADE FEE</p>
                        <p className="trade-amount">{formatPrice(product.fee)}</p>
                      </div>
                      <div className="trade-with-container-r">
                        <p className="trade-accepted-title">TRADE WITH</p>
                        <p className="trade-accepted-date">{new Date(product.updatedAt).toDateString().slice(0 - 11)}</p>
                        <p className="trade-value-title">TRANSACTION VALUE</p>
                        <p className="trade-value-text">{formatPrice(product.total)}</p>
                      </div>
                    </div>

                  </div>

                </IonCol>
              </IonRow>
            ) : '')}

          </IonGrid>
        </IonContent>
      }
    </IonPage>
  )
}

export default TradeCompleted
