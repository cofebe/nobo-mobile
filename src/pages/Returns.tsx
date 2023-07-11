import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router'
import './Returns.scss'
import { UserService } from '../services/UserService'
import { FullOrder, Product } from '../models'
import { formatPrice } from '../utils'


const Returns: React.FC = () => {
  const history = useHistory()
  const params: any = useParams()
  const userService = new UserService()
  const [productsData, setProductData] = useState<FullOrder[]>([])
  const [returns, setReturns] = useState<any[]>([])

  function getReturns() {
    userService.getReturns()
    .then((res) => {
      console.log(res, 'res')
      setReturns(res);
    })
    .catch((err) => {
      console.log(err, 'Error getting returns');
    })
  }


  useIonViewWillEnter(() => {
  getReturns()

  })




  console.log('returns...', returns)

  return (
    <IonPage className='return-main-container'>
      <IonRow>
        <IonCol className='return-header' size='12'>
          <div
            className='return-back-btn'
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
          <div className='return-title-text-container'>RETURN REQUESTS</div>
        </IonCol>
      </IonRow>

      <IonContent className='return-item-content'>
        {productsData[0]?.products.map((product: Product) => (
          <IonRow key={product._id} className='return-item-container'
            onClick={() => {
              history.push({ pathname: `/purchases/return-details`, state: product })
              console.log(product)
            }}
          >
            <IonCol className='return-item-box' size='12'>
              <p className="return-brand">{product.brand}</p>
              <p className="return-date"> {new Date().toDateString()}  </p>
            </IonCol>
            <IonCol className='return-item-name' size='12'>
              {product.name}
            </IonCol>
            <IonCol className='return-cost-info' size='2.5'>
              <p className="return-cost-title">Cost</p>
              <p className="return-cost">{formatPrice(product.price)}</p>
            </IonCol>
          </IonRow>
        ))}

      </IonContent>
    </IonPage>
  )
}

export default Returns


