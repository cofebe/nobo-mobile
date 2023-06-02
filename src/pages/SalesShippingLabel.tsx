import { IonButton, IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './SalesShippingLabel.scss'
import { UserService } from '../services/UserService'
import Search from '../components/Search'
import { FullOrder, OrderResponse, OrdersResponse } from '../models'


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
  // useIonViewWillEnter(() => {
  //   userService.getSales()
  //     .then((sales: OrdersResponse) => {
  //       if (sales) {
  //         setAllSales([sales])
  //         console.log(sales)

  //       } else { console.log('something went wrong') }
  //     })
  //     .catch((err) => { console.log('err info while fetching products ', err) })
  // })



  // console.log('sec log ', allSales[0]?.docs.map((s: any) => s.products))
  // console.log('state checking...', salesData)
  console.log(allSales)
  return (
    <IonPage className='sales-shipping-main-container'>
      <IonRow>
        <IonCol className='sales-shipping-header' size='12'>
          <div
            className='sales-shipping-back-btn'
            onClick={() => {
              history.replace('/settings/sales')
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
                  <div className="shipping-l-product-box_" style={{}}>
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
                    {products.products.map((product: any) => (
                      <div className=' shipping-l-product-box_show'>
                        <div className="img-box">
                          {<img
                            className='img'
                            src={product?.images[1]?.url.length < 60 ? `https://thenobo.com/${product?.images[1].url}` : `${product?.images[0].url}`} alt=''
                          />}

                        </div>

                        <div className="shipping-props-box">
                          <div className="top-info">
                            <div className="earnings-box">
                              <p className="earnings-title">EARNINGS</p>
                              <p className="earnings-text">{currencyFormat.format(product?.summary.earnings)}</p>
                            </div>
                            <div className="status-box">
                              <p className="status-title">ORDER STATUS</p>
                              <p className="status-text">{products.status}</p>
                            </div>
                            <div className="">
                              <IonButton
                                fill='outline'
                                style={{
                                  width: '100px',
                                  height: '32px',
                                  fontFamily: 'NunitoSans',
                                  fontWeight: 700,
                                  fontSize: '8px',
                                  color: '#D6980E',
                                  letterSpacing: 1,
                                  marginTop:10

                                }}
                              >SHIPPING LABEL</IonButton>
                            </div>

                            {/* <IonButton className="btn">
                              SHIPPING LABEL
                            </IonButton> */}
                          </div>


                          <div className="bottom-info">
                            <div className="earnings-bottom-box">
                              <p className="earnings-bottom-title">SOLD DATE</p>
                              <p className="earnings-bottom-text">{currencyFormat.format(product?.summary.earnings)}</p>
                            </div>
                            <div className="status-bottom-box">
                              <p className="status-bottom-title">RATING</p>
                              <p className="status-bottom-text">{products.status}</p>
                            </div>
                            <div className="">
                              <IonButton fill='outline'
                                style={{
                                  width: '100px',
                                  height: '32px',
                                  fontFamily: 'NunitoSans',
                                  fontWeight: 700,
                                  fontSize: '8px',
                                  color: '#D6980E',
                                  letterSpacing: 1,
                                  marginTop:10

                                }}>
                                PACKING SLIP</IonButton>

                            </div>

                          </div>

                        </div>
                      </div>
                    ))}
                  </div>)}
                <img
                  onClick={() => {
                    selectedDropDown(products._id)
                    console.log(products._id)
                    // setShowDetails(!showDetails)
                  }}
                  className={dropDown[0] === products._id ? 'label-arr-drop-down' : 'label-arr-drop-up'}
                  height={18}
                  src='assets/images/down-arrow.svg'
                  alt='logo'
                />
                {/* {dropDown[0] === product._id &&   ( <IonButton fill='outline' className="shipping-btn-top">
                  Shipping label
                </IonButton>)} */}
                {/* {showDetails && (  <div className="shipping-l-product-details">
                    DETAILS
                  </div>)} */}

                {/* <div className="shipping-l-product-num-box">
                  <p className="shipping-l-product-n">{product?.uniqueNumber}</p>
                </div>
                <div className="shipping-l-product-total-box">
                  <p className="shipping-l-product-price">{currencyFormat.format(product?.salesTax)}</p> */}
                {/* <img
                    className='label-arr-drop-down'
                    height={18}
                    src='assets/images/down-arrow.svg'
                    alt='logo'
                  /> */}
                {/* </div> */}
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


