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
// import Button from '../components/Button'
import { TradesResponse } from '../models'



const MyTrade: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })





  useIonViewWillEnter(() => {
    userService.getMyTrades()
      .then((products) => {
        if (products) {
          setTradesData([products])
        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  })

const acceptTrade = (productId:string) => {
  console.log(productId)
  userService.acceptTradeOffer(productId)
  .then((res)=>{
    console.log(res)
    history.push({pathname:`trades/accepted/${productId}`, state:res})
  })
  .catch((error)=>{
    console.log('error accepting trade : ',error)
  })
}







  // console.log(tradesData[0]?.received)
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
      <IonContent className='trade-item-content'>
        <IonGrid>
          {tradesData[0]?.received.map((product: any) =>(
            // <div>{product.status}</div>
            <IonRow key={product._id} style={{marginBottom:'14px'}}>
              <IonCol className='trade-item-container'>
                <div className='trade-item-status-container'>
                  <div className="item-status">
                    <p className='status_'>STATUS</p>
                    <p className='status_text'>{product.status.toUpperCase()} TRADE OFFER</p>
                  </div>
                  <div className="items-view-details">VIEW DETAILS</div>
                </div>
                <div className='items-view-props'>

                  <div className='items-view-props-left'>
                    {<img
                      className='item-img-left'
                      src={product.products.offered.images[0]?.url.length < 60 ? `https://thenobo.com/${product.products.offered.images[0].url}` : `${product.products.offered.images[0].url}`} alt={product.products.name}
                    />}
                    {/* <img className='item-img-left' src={`${product.products.offered.images[0].url}`} alt="" /> */}
                    <div className="trade-item-name-left">{product.products.offered.name.toUpperCase()}</div>
                    <div className="trade-item-price-left">{currencyFormat.format(product.products.offered.price)}</div>
                  </div>

                  <div className='items-view-props-center'>
                    <div className='line'></div>
                    <div className='circle'></div>
                    <img className='img' src='assets/images/12420.svg' alt="" />

                  </div>

                  <div className='items-view-props-right'>
                  {<img
                      className='item-img-right'
                      src={product.products.requested.images[0]?.url.length < 60 ? `https://thenobo.com/${product.products.requested.images[0].url}` : `${product.products.requested.images[0].url}`} alt={product.products.name}
                    />}
                    {/* <img className='item-img-left' src='assets/images/test/bvlgary.svg' alt="" /> */}
                    <div className="trade-item-name-right">{product.products.requested.name.toUpperCase()}</div>
                    <div className="trade-item-price-right">{currencyFormat.format(product.products.requested.price)}</div>
                  </div>
                </div>

                <div className='trade-offer-line'></div>
                <div className='trade-items-btn-container'>
                  <IonButton style={{ backgroundColor: 'white' }} size='small' className='trade-item-btn' fill='outline' onClick={() => {
                    history.push('/settings/trades/denied/5')
                  }} >DENY</IonButton>
                  <IonButton size='small' className='trade-item-btn' onClick={() => {
                    acceptTrade(product._id)
                    // history.push('/settings/trades/accepted/5')
                  }} >ACCEPT</IonButton>
                </div>
              </IonCol>
            </IonRow>
          ))}

        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default MyTrade
