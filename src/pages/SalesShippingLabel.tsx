import { IonButton, IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './SalesShippingLabel.scss'
import { UserService } from '../services/UserService'
import Search from '../components/Search'
import { FullOrder, OrdersResponse, User } from '../models'
import { getImageUrl } from '../utils'


const SalesShippingLabel: React.FC = () => {
  const history = useHistory()

  const userService = new UserService()
  const [allSales, setAllSales] = useState<OrdersResponse[]>([])
  const [dropDown, setDropDownArray] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('')
  const [userId, setUser] = useState('')

  const selectedDropDown = (pId: string) => {
    if (!dropDown.includes(pId, 0)) {
      setDropDownArray([pId])
    } else if (dropDown.includes(pId, 0)) {
      const updatedRemove = dropDown.filter((expOption) => expOption !== pId)
      setDropDownArray(updatedRemove)
    }
  };

  function getMe() {
    userService.getMe().then((user: User) => {
      setUser(user._id)
    })
      .catch((error) => { console.log(error) });
  }

  function getMySales() {
    userService.getSales()
      .then((sales: OrdersResponse) => {
        if (sales) {
          setAllSales([sales])
          console.log(sales)

        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  }



  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  useIonViewWillEnter(() => {
    getMe()
    getMySales()

  })

  const filteredProduct = allSales[0]?.docs?.filter(product =>
    product.products[0]?.name.toLowerCase().includes(searchInput.toLowerCase(), 0) ||
    product.products[0]?.brand.toLowerCase().includes(searchInput.toLowerCase(), 0)
  );








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
            value={searchInput}
            onChange={(val) => { setSearchInput(val) }}
          />
        </IonCol>
      </IonRow>
      <IonContent className='shipping-item-content'>
        {filteredProduct?.map((products: FullOrder) => (
          <div key={products._id}>
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
                    {products.products.map((singleProduct: any, index: any) => (
                      <div
                        key={index}
                        className=' shipping-l-product-box_show'>
                        <div
                          className="img-box"
                          style={{
                            backgroundImage: singleProduct?.images?.length
                              ? getImageUrl(singleProduct?.images[1]?.url)
                              : '',
                          }}
                        ></div>

                        {/* ------TOP--------- */}
                        <p className="top-earnings-title">EARNINGS</p>
                        <p className="top-earnings-text">{currencyFormat.format(singleProduct?.summary.earnings)}</p>
                        <p className="top-order-status">ORDER STATUS</p>
                        <p className="top-order-status-text">{products.status}</p>
                        <a
                          target='_blank'
                          rel='noreferrer' href={`${singleProduct.shipmentInfo?.postage_label?.label_url}`}
                        >
                          <IonButton
                            size='small'
                            fill='outline'
                            className='status-bottom-btn1_'
                          >
                            SHIPPING LABEL
                            <img style={{ marginLeft: 10 }} height={12} src='assets/images/download-icon.svg' alt='logo' />
                          </IonButton>
                        </a>



                        {/* -----BOTTOM------ */}
                        <p className="earnings-bottom-title">SOLD DATE</p>
                        <p className="earnings-bottom-text">{new Date(singleProduct.createdAt).toDateString().slice(0 - 11)}</p>
                        <p className="status-bottom-rating">RATING</p>
                        <p className="status-bottom-rating-text">N/A</p>
                        <a
                          target='_blank'
                          rel='noreferrer' href={`https://thenobo.com/api/orders/packing-slip/${products._id}-${userId}.html`}
                        >
                          <IonButton
                            size='small'
                            fill='outline'
                            className='status-bottom-btn2_'
                          >
                            PACKING SLIP
                            <img style={{ marginLeft: 20 }} height={12} src='assets/images/download-icon.svg' alt='logo' />
                          </IonButton>
                        </a>
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


