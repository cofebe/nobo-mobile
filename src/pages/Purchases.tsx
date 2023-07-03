import { useRef, useState } from 'react'
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react'
import './Purchases.scss'
import { useHistory, } from 'react-router'
import Search from '../components/Search'
import { UserService } from '../services/UserService'
import { FullOrder, OrdersResponse } from '../models'
import { formatPrice, getCardImage, getImageUrl } from '../utils'



const Purchases: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const [productsData, setProductData] = useState<OrdersResponse[]>([])
  const [inputValue, setInputValue] = useState('')


  useIonViewWillEnter(() => {
    userService.getOrders()
      .then((products) => {
        if (products) {
          setProductData([products])
        } else { console.log('something went wrong') }
      })
      .catch((err) => { console.log('err info while fetching products ', err) })
  })



  // Filtering products
  const filteredProduct = productsData[0]?.docs?.filter(product =>
    product.products[0]?.name.toLowerCase().includes(inputValue.toLowerCase(), 0) ||
    product.products[0]?.brand.toLowerCase().includes(inputValue.toLowerCase(), 0)
  );
// console.log(filteredProduct)
  return (
    <IonPage className='purchase-item-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px'  }} size='12'>
          <div
            className='purchases-back-btn'
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

          <IonCol className='purchases-title-text-container'>MY PURCHASES</IonCol>
        </IonCol>
      </IonRow>
      <div className='purchase-item-search-container'>
        <Search
          value={inputValue}
          onChange={(value) => setInputValue(value)}
        />
      </div>
      <IonContent className='purchase-item-content'>

        {/* PURCHASE-ITEMS-CONTAINER */}
        {filteredProduct?.map((product: FullOrder) => (
          <IonRow key={product._id} className='purchase-item-container'>

            <div className='purchase-item-info'>
              <div className='purchase-item-order-date'>
                <p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER DATE</p>
                <p style={{ textAlign: 'center' }}>{new Date(product.updatedAt).toDateString().slice(0 - 11)}</p>
              </div>
              <div className='purchase-item-order-num'>
                <p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER NO.</p>
                <p style={{ textAlign: 'center' }}>{product.uniqueNumber}</p>
              </div>
              <div className='purchase-item-order-payment'>
                <p className='purchase-item-payment-method' >PAYMENT METHOD</p>
                <img className='purchase-details-card-brand' src={getCardImage(product.charge.source.brand)} alt='card brand' />
              </div>
            </div>

            {product.products.map((singleProduct: any) => (
              <IonRow key={singleProduct._id} className='purchase-item' >
                <IonCol size='3' className='purchases-item-img-container'>
                <div className='purchases-item-img'
                  style={{
                    backgroundImage: singleProduct.images?.length
                      ? getImageUrl(singleProduct.images[0]?.url)
                      : '',

                  }}
                  ></div>

                </IonCol>
                <IonCol size='4.5' className='purchse-item-props'>
                  <p className='purchases-item-brand'>{singleProduct.brand}</p>
                  <p className='purchases-item-name'>{singleProduct.name}</p>
                  <p className='purchases-item-price'>{formatPrice(singleProduct.price)}</p>
                </IonCol>
                <IonCol size='3.7' className='purchases-item-status-container'>
                  <p className='purchases-item-status'>STATUS</p>
                  {
                  singleProduct.shipmentInfo?.status === 'delivered'?
                  <p className='purchases-item-status-info'>{singleProduct.shipmentInfo?.status}</p>
                  :
                  <p className='purchases-item-status-info-await'>Awaiting Shipment</p>
                  }

                    <a className='purchases-item-track' href={singleProduct.shipmentInfo?.tracker?.public_url}
                     rel='noreferrer'
                     target='_blank'
                    >TRACK</a>

                </IonCol>
              </IonRow>
            ))}


            <div className='purchase-product-view-container'>
              <p className='purchase-product-view-text'
                onClick={() => {
                  history.push({ pathname: `/settings/purchases/details/${product._id}`, state: product.fromVendors})
                }}
              >
                VIEW DETAILS</p>
            </div>
          </IonRow>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default Purchases
