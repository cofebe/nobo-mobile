import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './SalesDetails.scss'
import { FullOrder } from '../models'
import { formatPrice, getImageUrl } from '../utils'

const SalesDetails: React.FC = () => {
  const history = useHistory()
  const [salesItem, setSalesItem] = useState<any[]>()




  useIonViewWillEnter(() => {
    if(history.location.state){
      setSalesItem([history.location.state])
    }else{
      console.log('no data found')
    }

  })


  return (
    <IonPage className='single-sales-item-main-container'>
      <IonRow>
        <IonCol className='single-sales-item-header' size='12'>
          <div
            className='single-sales-item-back-btn'
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
          {/* <IonCol className='single-sales-item-title-text-container'>MY single-sales</IonCol> */}
        </IonCol>
      </IonRow>

      <IonContent className='single-sales-item-content'>
        {/* <IonRow >
          <IonCol className='single-sales-shipping-label' size='12' >SHIPPING LABELS</IonCol>
        </IonRow> */}
        { }
        {salesItem?.map((sale:FullOrder) => (
          <div key={sale._id}>
            {sale.products.map((product) => (
              <IonRow key={product._id}>
                <IonCol className='single-sales-items-container' size='12' >
                  <div className="single-sales-items-props-left">
                    <div className="order-no">
                      <p className='order'>ORDER N0.</p>

                      <p className='num' style={{ color: 'black' }}>{sale.uniqueNumber}</p>
                    </div>
                    <div className="seller-name">{`${sale.customer.firstName} ${sale.customer.lastName}`}</div>
                    <div className="product">product</div>
                    <div className="product-name">
                      <p>{product.brand}</p>
                      <p style={{ fontWeight: 600 }}>{product.name}</p>
                    </div>
                    <div className="year">{new Date(product.createdAt).toDateString().slice(0 - 11)}</div>
                  </div>
                  <div className="single-sales-items-props-right">
                  <div className='img-container'
                      style={{
                        backgroundImage: product.images?.length
                          ? getImageUrl(product.images[0]?.url)
                          : '',
                      }}
                    ></div>
                    <p className='price'>{formatPrice(product.price)}</p>
                  </div>
                </IonCol>
                <div className='single-sales-item-line-divider'></div>
              </IonRow>

            ))}

          </div>
        ))}


      </IonContent>
    </IonPage>
  )
}

export default SalesDetails
