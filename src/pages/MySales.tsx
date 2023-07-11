import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './MySales.scss'
import { UserService } from '../services/UserService'
import { OrdersResponse } from '../models'
import { formatPrice, getImageUrl } from '../utils'


const MySales: React.FC = () => {
  const [allSales, setAllSales] = useState<OrdersResponse[]>([])
  const history = useHistory()
  const userService = new UserService()


  useIonViewWillEnter(() => {
    userService.getSales()
      .then((sales: OrdersResponse) => {
        if (sales) {
          setAllSales([sales])
        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  })


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

      {allSales[0]?.docs.length < 1 ?
        <IonContent className='sales-item-content'>
          <IonRow>You have no completed sales!</IonRow>
        </IonContent>
        :
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
                      history.push({ pathname: `/sales/single-sales-item/${product?._id}`, state: product })
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
                      <div className='img-container'
                        style={{
                          backgroundImage: sProduct.images?.length
                            ? getImageUrl(sProduct.images[0]?.url)
                            : '',
                        }}
                      > </div>

                      <p className='price'>{formatPrice(sProduct?.price)}</p>
                    </div>
                  </IonCol>
                  <div className='sales-item-line-divider'></div>
                </IonRow>
              ))}

            </div>

          ))}

        </IonContent>}
    </IonPage>
  )
}

export default MySales


