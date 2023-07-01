import { IonButton, IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './SalesShippingLabel.scss'
import { UserService } from '../services/UserService'
import Search from '../components/Search'
import { FullOrder, OrderResponse, OrdersResponse } from '../models'
import { getImageUrl } from '../utils'


const SalesShippingLabel: React.FC = () => {
  const history = useHistory()

  const userService = new UserService()
  // const salesData: any = history.location.state
  const [allSales, setAllSales] = useState<OrdersResponse[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [dropDown, setDropDownArray] = useState<string[]>([]);


  const selectedDropDown = (pId: string) => {
    if (!dropDown.includes(pId, 0)) {
      setDropDownArray([pId])
    } else if (dropDown.includes(pId, 0)) {
      const updatedRemove = dropDown.filter((expOption) => expOption !== pId)
      setDropDownArray(updatedRemove)
    }
  };



  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

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



  return (
    <IonPage className='sales-shipping-main-container'>
      <IonRow>
        <IonCol className='sales-shipping-header' size='12'>
          <div
            className='sales-shipping-back-btn'
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
          <IonCol className='sales-shipping-title-text-container'>Back to Sales</IonCol>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size='12' style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Search
            onChange={() => { }} />
        </IonCol>
      </IonRow>
      <IonContent className='shipping-item-content'>
        {allSales[0]?.docs?.map((products: FullOrder) => (
          <div>
            {/* {product?.products.map((sProduct) => ( */}
            <IonRow>
              <IonCol className='shipping-l-header-container' size='12' >
                <div className='shipping-l-header-status'>
                  <p className="shipping-l-product-title"> PRODUCT</p>
                  <p className="shipping-l-product-order"> ORDER NO.</p>
                  <p className="shipping-l-product-total"> TOTAL</p>
                </div>


                {products.products.map((p) => (
                  <div className="shipping-l-product-box_" key={p._id} style={{}}>
                    <div className='shipping-box1'>
                      <p className="shipping-l-product-name_">{p.name.toUpperCase()}</p>
                    </div>
                    <div className='shipping-box2'>
                      <p className="shipping-l-product-name_">{products.uniqueNumber}</p>
                    </div>
                    <div className='shipping-box3'>
                      <p className="shipping-l-product-name_">{currencyFormat.format(products.subtotal)}</p>

                    </div>
                  </div>
                ))}
                {dropDown[0] === products._id && (
                  <div >
                    {products.products.map((product: any, index: any) => (
                      <div
                        key={index}
                        className=' shipping-l-product-box_show'>
                        <div
                          className="img-box"
                          style={{
                            backgroundImage: product?.images?.length
                              ? getImageUrl(product?.images[1]?.url)
                              : '',
                          }}
                        ></div>

                        {/* ------TOP--------- */}
                        <p className="top-earnings-title">EARNINGS</p>
                        <p className="top-earnings-text">{currencyFormat.format(product?.summary.earnings)}</p>
                        <p className="top-order-status">ORDER STATUS</p>
                        <p className="top-order-status-text">{products.status}</p>
                        <IonButton fill='outline'
                          className='status-bottom-btn1_'>SHIPPING LABEL</IonButton>


                        {/* -----BOTTOM------ */}
                        <p className="earnings-bottom-title">SOLD DATE</p>
                        <p className="earnings-bottom-text">{new Date(product.updatedAt).toDateString().slice(0 - 11)}</p>
                        <p className="status-bottom-rating">RATING</p>
                        <p className="status-bottom-rating-text">N/A</p>
                        <IonButton fill='outline'
                          className='status-bottom-btn2_'>PACKING</IonButton>

                      </div>
                    ))}
                  </div>)}
                <img
                  onClick={() => {
                    selectedDropDown(products._id)
                  }}
                  className={dropDown[0] === products._id ? 'label-arr-drop-down' : 'label-arr-drop-up'}
                  height={18}
                  src='assets/images/down-arrow.svg'
                  alt='logo'
                />
              </IonCol>
            </IonRow>
            {/* ))} */}
          </div>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default SalesShippingLabel


