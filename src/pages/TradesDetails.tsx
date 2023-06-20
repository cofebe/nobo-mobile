import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../components/Header'
import './TradesDetails.scss'
import { useHistory, } from 'react-router'
import { Trade } from '../models'
import { formatPrice, getImageUrl } from '../utils'
import { calculateFee } from '../helpers/tradeFees'



const TradesDetails: React.FC = () => {
  const history = useHistory()
  const [tradesData, setTradesData] = useState<any[]>([])



  useIonViewWillEnter(() => {
    history.location.state as Trade
    // console.log('tradeDetails page ', history.location.state)
    setTradesData([history.location.state])
  })




  console.log('trade details', tradesData)
  return (
    <IonPage className='trade-details-main-container'>
      <Header title='TRADE DETAILS' />
      <IonContent className='trade-details-content'>
        {tradesData?.map((product: any) => (

          <IonRow key={product._id} style={{ padding: '0px', marginTop: '60px' }}>
            <IonCol size='12' className='trade-details-items'>
              <div className="left">
                <p className='your-item'>YOUR ITEM</p>
                <div className="img-container"
                  style={{
                    backgroundImage: product?.products?.offered?.images?.length
                      ? getImageUrl(product?.products?.offered?.images[0]?.url)
                      : '',
                  }}
                ></div>
                <p className='product-name-left'>{product?.products?.offered?.name}</p>
                <p className='product-price-left'>{formatPrice(product?.products?.offered?.price)}</p>
                <p className='your-pay'>YOUR PAY <span className='your-pay-amount'>
                  {formatPrice(
                    product?.salesTax.recipient.shipping
                    + product.fee
                    + product?.salesTax.recipient.taxable_amount
                  ) || 0}
                </span> </p>

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
                  style={{
                    backgroundImage: product?.products?.requested?.images?.length
                      ? getImageUrl(product?.products?.requested?.images[0]?.url)
                      : '',
                  }}
                ></div>
                <p className='product-name-right'>{product?.products?.requested?.name}</p>
                <p className='product-price-right'>{formatPrice(product?.products?.requested?.price)}</p>
                <p className='your-pay'>THEY PAY <span className='your-pay-amount'>
                  {formatPrice(
                    product?.salesTax.initiator.shipping
                    + product.fee
                    + product?.salesTax.initiator.taxable_amount
                  )}
                </span> </p>
              </div>

              <div className="line-sep-1"></div>
              <div className="line-sep-2"></div>
            </IonCol>

            <IonCol className='trade-details-body-text'>
              <p className='bodt-text-1'>
                To complete the transaction you will have to pay 12% trade
                transaction fee of <span className='price'>{formatPrice(product?.salesTax.initiator.taxable_amount)} </span>
                and <span className='price'>{formatPrice(product?.salesTax.initiator.shipping)} </span> shipping fee. Please
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
                <p className='value price'>{formatPrice(product?.products?.offered?.price + product?.products?.requested?.price)}</p>
              </div>
              <div className='trade-details t-shipping'>
                <p className='shipping-title'>Shipping</p>
                <p className='shipping price'>{formatPrice(product?.salesTax.initiator.shipping)}</p>
              </div>
              <div className='trade-details t-value'>
                <p className='sales-title'>Sales Tax</p>
                <p className='sales price'>{formatPrice(product?.salesTax.initiator.amount_to_collect)}</p>
              </div>
              <div className='trade-details t-value'>
                <p className='nobo-title'>TheNOBO Trade Fee (12%)</p>
                <p className='nobo price'>{formatPrice(calculateFee(product?.total))} </p>
              </div>
              <div className='trade-details t-value'>
                <p className='savings-title' style={{ color: '#D6980E' }}>Your Savings</p>
                <p className='savings-price' style={{ color: '#D6980E' }}>
                  {formatPrice(
                    product?.products?.offered?.price
                    - product?.salesTax.initiator.taxable_amount
                    - product?.salesTax.initiator.shipping
                  )}
                </p>
              </div>
              <div className="line-sep-1"></div>
              <div className='trade-details t-value'>
                <p className='total-title' >YOUR TOTAL</p>
                <p className='total-price' >{formatPrice(
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
