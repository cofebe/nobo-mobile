import { IonCol, IonContent, IonPage, IonRow, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../components/Header'
import './TradeDetails.scss'
import { useHistory, useParams } from 'react-router'
import { Product, Trade, TradesResponse } from '../models'
import { getCardImage } from '../utils'
import { UserService } from '../services/UserService'

interface Data {
  data: Product
}

const TradesDetails: React.FC = () => {
  const params: any = useParams()
  const userService = new UserService()
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  const history = useHistory()
  const [trade1, settrade] = useState<TradesResponse[]>([])
  const [recieved, setRecieved] = useState<TradesResponse[]>([])
  const [tradesData, setTradesData] = useState<TradesResponse[]>([])





  const trade: any = history.location.state
  useIonViewWillEnter(() => {

    settrade(trade[0].products.offered)
    setRecieved(trade[0].products.requested)
  })

  useIonViewDidEnter(() => {
    userService.getMyTrades()
      .then((products) => {
        if (products) {
          setTradesData([products])
        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  })

  // console.log('full trades ',tradesData)




  const offered: any = trade1
  const requested: any = recieved
  // console.log(trade1[0])
  // console.log('test1', offered?.price)
  // console.log('test',offered)

  const data: any = tradesData[0]?.received.filter((trade) => trade._id === params.id)
  console.log('a trades ', data)

  return (
    <IonPage className='trade-details-main-container'>
      <Header title='TRADE DETAILS' />
      <IonContent className='trade-details-content'>
        {data?.map((product: any) => (

          <IonRow style={{ padding: '0px', marginTop: '60px' }}>
            <IonCol size='12' className='trade-details-items'>
              <div className="left">
                <p className='your-item'>YOUR ITEM</p>
                <div className="img-container">
                  {<img
                    className='img'
                    src={product?.products?.offered?.images[0].url.length < 60
                      ? `https://staging.thenobo.com/${product?.products?.offered?.images[0].url}`
                      : `${product?.products?.offered?.images[0].url}`} alt={product?.products?.offered?.name}
                  />}
                  {/* <img className='img' src={`${offered?.images[0]?.url}`} alt="image" /> */}
                </div>
                <p className='product-name-left'>{product?.products?.offered?.name}</p>
                <p className='product-price-left'>{currencyFormat.format(product?.products?.offered?.price)}</p>
                <p className='your-pay'>YOUR PAY <span className='your-pay-amount'>$142</span> </p>

              </div>

              <div className="center">
                <div className='line'></div>
                <div className='circle'>
                  <img className='img' src={'assets/images/12420.svg'} alt="" />
                </div>
              </div>

              <div className="right">
                <p className='your-item'>THEIR ITEM</p>
                <div className="img-container"
                // style={{backgroundImage:`url${getCardImage(product?.products?.requested?.images[0].url)}`}}
                >
                  {<img
                    className='img'
                    src={product?.products?.requested?.images[0]?.url.length < 60
                      ? `https://staging.thenobo.com/${requested?.images[0].url}`
                      : `${product?.products?.requested?.images[0].url}`} alt={product?.products?.requested?.name}
                  />}
                  {/* <img className='img' src="assets/images/test/bvlgary.svg" alt="" /> */}
                </div>
                <p className='product-name-right'>{product?.products?.requested?.name}</p>
                <p className='product-price-right'>{currencyFormat.format(product?.products?.requested?.price)}</p>
                <p className='your-pay'>THEY PAY <span className='your-pay-amount'>$141.20</span> </p>
              </div>

              <div className="line-sep-1"></div>
              <div className="line-sep-2"></div>
            </IonCol>

            <IonCol className='trade-details-body-text'>
              <p className='bodt-text-1'>
                To complete the transaction you will have to pay 12% trade
                transaction fee of <span className='price'> $00.00 </span>
                and <span className='price'>{currencyFormat.format(product?.salesTax.initiator.shipping)} </span> shipping fee. Please
                use one of the preferred payment methods listed below.
              </p>
              <p className='bodt-text-2'>
                Note, you will only be charged once the other party accepts
                the trade. <span className='important-info'>
                  All Trades are Final. No Returns will be accepted
                  if the other party accepts the transaction.</span>
              </p>
            </IonCol>


            {/* OFFERED */}


            <IonCol size='12' className='trade-details-t-info'>
              <div className='trade-details-t-title'>ORDER SUMMARY</div>
              <div className='trade-details t-value'>
                <p className='value-title'>Total Transaction Value</p>
                <p className='value price'>{currencyFormat.format(product?.products?.offered?.price + product?.products?.requested?.price)}</p>
              </div>
              <div className='trade-details t-shipping'>
                <p className='shipping-title'>Shipping</p>
                <p className='shipping price'>{currencyFormat.format(product?.salesTax.initiator.shipping)}</p>
              </div>
              <div className='trade-details t-value'>
                <p className='sales-title'>Sales Tax</p>
                <p className='sales price'>{currencyFormat.format(product?.salesTax.initiator.taxable_amount)}</p>
              </div>
              <div className='trade-details t-value'>
                <p className='nobo-title'>TheNOBO Trade Fee (12%)</p>
                <p className='nobo price'>$N/A</p>
              </div>
              <div className='trade-details t-value'>
                <p className='savings-title' style={{ color: '#D6980E' }}>Your Savings</p>
                <p className='savings-price' style={{ color: '#D6980E' }}>$N/A</p>
              </div>
              <div className="line-sep-1"></div>
              <div className='trade-details t-value'>
                <p className='total-title' >YOUR TOTAL</p>
                <p className='total-price' >{currencyFormat.format(
                   product?.products?.offered?.price
                  + product?.products?.requested?.price
                  + product?.salesTax.initiator.shipping
                  + product?.salesTax.initiator.taxable_amount

                )}</p>
              </div>

            </IonCol>

          </IonRow>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default TradesDetails
