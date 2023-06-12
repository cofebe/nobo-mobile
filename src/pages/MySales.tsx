import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './MySales.scss'
import { UserService } from '../services/UserService'
import { OrdersResponse } from '../models'


const MySales: React.FC = () => {
  const [allSales, setAllSales] = useState<OrdersResponse[]>([])
  const history = useHistory()

  const userService = new UserService()


  useIonViewWillEnter(() => {
    userService.getSales()
      .then((sales: OrdersResponse) => {
        if (sales) {
          setAllSales([sales])
          console.log(sales)

        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  })


  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })


  return (
    <IonPage className='sales-item-main-container'>
      <IonRow>
        <IonCol className='sales-item-header' size='12'>
          <div
            className='sales-item-back-btn'
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
          <IonCol className='sales-item-title-text-container'>MY SALES</IonCol>
        </IonCol>
      </IonRow>

      <IonContent className='sales-item-content'>
        <IonRow >
          <IonCol className='sales-shipping-label' size='12'
            onClick={() => {
              history.push({ pathname: `/sales/shipping-label`, state: allSales })
            }}
          >SHIPPING LABELS</IonCol>
        </IonRow>
        {allSales[0]?.docs?.map((product) => (
          <div key={product._id}>
            {product?.products?.map((sProduct) => (
              <IonRow key={sProduct?._id}>
                <IonCol
                  onClick={() => {
                    history.push(`/sales/single-sales-item/${product?._id}`)
                  }}
                  className='sales-items-container' size='12' >

                  <div className="sales-items-props-left">
                    <div className="order-no">
                      <p className='order'>ORDER N0.</p>
                      <p className='num' style={{ color: 'black' }}>{product?.uniqueNumber}</p>
                    </div>
                    <div className="seller-name">{`${product?.customer.firstName} ${product?.customer.lastName}`}</div>
                    <div className="product">product</div>
                    <div className="product-name">
                      <p>{sProduct?.brand}</p>
                      <p style={{ fontWeight: 600 }}>{sProduct?.name}</p>
                    </div>
                    <div className="year">{new Date(sProduct?.createdAt).toDateString().slice(0 - 11)}</div>
                  </div>
                  <div className="sales-items-props-right">
                    <div className="img-container">
                      <img src={`${sProduct?.images[0].url}`} alt="channel" />
                    </div>
                    <p className='price'>{currencyFormat.format(sProduct?.price)}</p>
                  </div>
                </IonCol>
                <div className='sales-item-line-divider'></div>
              </IonRow>
            ))}

          </div>

        ))}

      </IonContent>
    </IonPage>
  )
}

export default MySales


