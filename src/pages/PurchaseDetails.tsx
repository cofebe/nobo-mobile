import { useRef, useState } from 'react'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter
} from '@ionic/react'
import './PurchaseDetails.scss'
import './PurchaseDetails.css'
import { useHistory, useParams } from 'react-router'
import { UserService } from '../services/UserService'
import { FullOrder, User } from '../models'
import { formatPrice, getCardImage, getImageUrl } from '../utils'
import SendMessageModal from '../components/SendMessageModal'







const PurchaseDetails: React.FC = () => {
  const userService = new UserService()
  const params: any = useParams()

  const history = useHistory()
  const [productsData, setProductData] = useState<FullOrder[]>([])
  const [returnData, setReturnData] = useState<FullOrder[]>([])
  const sendMessageModal = useRef<HTMLIonModalElement>(null);
  const [data, setData] = useState('')
  const [vendors, setVendors] = useState<string[]>([])
  const [followingList, setFollowingList] = useState<string[]>([])

  const modal = useRef<HTMLIonModalElement>(null)


  function message() {
    // console.log('sending message...')
    // console.log('orderId', params.id)
    // console.log('productId', data)
    sendMessageModal.current?.present();
  }


  const getOrder = () => {
    userService.getOrder(params.id)
      .then((products: FullOrder) => {
        if (products) {
          setProductData([products])
        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  }

  const getMe = () => {
    userService
      .getMe()
      .then((user: User) => {
        setFollowingList(user.following)
      })
  }


  useIonViewWillEnter(() => {
    const data: any = history.location.state
    setVendors(data)
    getOrder()
    getMe()

  })


  const followVendor = (sellerId: any) => {
    if (!followingList.includes(sellerId, 0)) {
      userService.followUser(sellerId)
        .then(() => {
          getMe()
        })

    } else {
      userService.removeFollowUser(sellerId)
        .then(() => {
          getMe()
        })
    }


  };


  // const sellers = vendors.filter((ar: any) => followingList.includes(ar, 0))

  return (
    <IonPage className='order-details-item-main-container'>
      <IonHeader className='order-details-item-header'>
        <IonToolbar className='order-details-item-header-toolbar'>
          <IonGrid>
            <IonRow>
              <IonCol size='12' className='order-details-item-title'>
                <div
                  className='order-details-item-back-button'
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.goBack();
                  }}
                >
                  <img src='assets/images/arrow-left.svg' alt='back' />
                </div>

                <p className='order-details-item-back-text'>Back To All Purchases</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>

      <IonContent className='order-details-item-content'>

        {/* PURCHASE-ITEMS-CONTAINER */}
        {productsData.map((product: any) => (
          <IonRow key={product.uniqueNumber} className='order-details-item-container'>

            <div className='order-details-item-info'>
              <div className='order-details-item-order-date'>
                <p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER DATE</p>
                <p style={{ textAlign: 'center' }}>
                  {new Date(product.updatedAt).toDateString().slice(0 - 11)}
                </p>
              </div>
              <div className='order-details-item-order-num'>
                <p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER NO.</p>
                <p style={{ textAlign: 'center' }}>{product.uniqueNumber}</p>
              </div>
              <div className='order-details-item-order-payment'>
                <p style={{ color: '#ACACAC', textAlign: 'center' }} >PAYMENT METHOD</p>
                <img className='order-details-card-brand' src={getCardImage(product.charge.source.brand)} alt='card brand' />

              </div>
              <div className='order-details-item-order-status'>
                <p style={{ color: '#ACACAC', textAlign: 'center' }}>STATUS</p>
                <p style={{ color: '#42D60E', textAlign: 'center' }}>{product.status}</p>
              </div>
            </div>


            {product.products.map((singleProduct: any, index:any) => (
              <IonRow className='order-details-item' key={index}>
                <IonCol className='order-details-vendor-container' size='12'>
                  <p className='order-details-purchased-from'>Purchased From</p>
                  <p className='order-details-vendor-name'>{singleProduct.vendor.displayName}</p>
                  <p className='order-details-return-icon'
                    onClick={() => {
                      modal.current?.present()
                      setReturnData(singleProduct)
                    }}

                  >
                    <img src='assets/images/menu-dots.svg' alt="menu" />
                  </p>
                </IonCol>
                <IonCol size='12' className='order-details-img-props'>
                  <div className='order-details-img-box'
                    style={{
                      backgroundImage: singleProduct.images?.length
                        ? getImageUrl(singleProduct.images[0]?.url)
                        : '',
                    }}
                  ></div>

                  <div className='order-details-item-info'>
                    <p className='order-details-brand'>{singleProduct.brand}</p>
                    <p className='order-details-name'>{singleProduct.name}</p>
                    <p className='order-details-price'>{formatPrice(singleProduct.price)}</p>
                  </div>

                  <div className='order-details-showmore'>
                    <p className='order-details-text' style={{}}>
                      show more
                    </p>
                  </div>

                </IonCol>
                <IonCol className='order-details-item-msg-flw'>
                  <IonButton size='small'
                    className='single-order-btn'
                    onClick={
                      () => {
                        message()
                        setData(singleProduct._id)
                      }
                    }
                    style={{ marginLeft: '-2px' }}
                  >MESSAGE SELLER
                  </IonButton>

                  <IonButton
                    size='small'
                    className='single-order-btn'
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      followVendor(singleProduct.vendor._id)
                    }}
                  >{

                      followingList.includes(singleProduct.vendor._id, 0) ? 'FOLLOWING' : 'FOLLOW SELLER'

                    }</IonButton>

                </IonCol>
              </IonRow>
            ))}

            <div className='order-details-value-line'></div>

            <div style={{ marginLeft: '20px', marginRight: '20px' }}>
              <IonRow className='order-details-subtotal'>
                <IonCol className='order-details-subtotal-title' size='12'>ORDER SUMMARY</IonCol>
              </IonRow>
              <IonRow className='order-details-general-class'>
                <IonCol>ORDER SUBTOTAL</IonCol>
                <IonCol className='order-details-general-col'>{formatPrice(product.subtotal)}</IonCol>
              </IonRow>
              <IonRow className='order-details-general-class'>
                <IonCol >SHIPPING</IonCol>
                <IonCol className='order-details-general-col'>{formatPrice(product.shipping)}</IonCol>
              </IonRow>
              <IonRow className='order-details-general-class'>
                <IonCol >SALES TAX</IonCol>
                <IonCol className='order-details-general-col'>{formatPrice(product.salesTax)}</IonCol>
              </IonRow>
              <IonRow className='order-details-general-class'>
                <IonCol >DISCOUNT CODE</IonCol>
                <IonCol style={{ color: '#D6980E' }} className='order-details-general-col'>
                  {formatPrice(product?.products?.summary?.coupon)}
                </IonCol>
              </IonRow>
            </div>
            <div className='order-details-value-line2'></div>

            <div style={{ marginLeft: '20px', marginRight: '20px' }}>
              <IonRow style={{ color: '#D6980E', fontWeight: 700 }} className='order-details-general-class'>
                <IonCol >TOTAL</IonCol>
                <IonCol
                  className='order-details-general-col'>
                  {formatPrice(product.total)}
                </IonCol>
              </IonRow>
            </div>

            <div className='order-details-value-line'></div>

            <div style={{ marginLeft: '20px', marginRight: '20px' }} >
              <IonRow style={{ marginBottom: '14px' }}>
                <IonCol size='12' className='order-details-summary-title'>PAYMENT METHOD</IonCol>
                <IonCol style={{ fontWeight: 500 }} className='order-details-payment-method' size='12' >
                  <img className='order-details-card-brand' src={getCardImage(product.charge.source.brand)} alt='card brand' />
                  <p style={{ width: '74px' }}>**** {product.charge.payment_method_details.card.last4}</p>
                  <p style={{ width: '74px' }}>
                    Exp.{product?.charge.payment_method_details.card.exp_month}
                    /{product?.charge.payment_method_details.card.exp_year.toString().slice(-2)}
                  </p>
                  <p>{product.customer.firstName + ' ' + product.customer.lastName}</p>
                </IonCol>
              </IonRow>


              <IonRow style={{ marginBottom: '14px' }}>
                <IonCol size='12' className='order-details-summary-title'>BILLING ADDRESS</IonCol>
                <IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.address1}</IonCol>
                <IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.city}</IonCol>
                <IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.state}</IonCol>
                <IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.postalCode}</IonCol>
                <IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.phone}</IonCol>
              </IonRow>
            </div>

          </IonRow>
        ))}
      </IonContent>

      <SendMessageModal
        ref={sendMessageModal}
        productId={data}
        orderId={params.id}
        onCancel={() => {
          sendMessageModal.current?.dismiss();
        }}
        onClose={() => {
          sendMessageModal.current?.dismiss();
        }}
      />

      <IonModal
        ref={modal} trigger='open-return-modal' initialBreakpoint={1} breakpoints={[0, 5]}
        className='purchase-details-return-ion'
      >
        <IonContent  >
          <IonRow className="purchase-details-return-box">
            <IonCol style={{ fontWeight: '500px' }} size='12'
              onClick={() => {
                console.log('returnDtata', returnData)
                history.push({ pathname: `/purchases/return-details`, state: returnData })
                modal.current?.dismiss()
              }}
              className='purchase-details-return-text'
            >RETURN REQUEST
            </IonCol>
          </IonRow>
        </IonContent>
      </IonModal>


    </IonPage>
  )
}

export default PurchaseDetails
