import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './ReturnRequest.scss'
import { UserService } from '../services/UserService'
import Search from '../components/Search'
import { FullOrder, OrdersResponse } from '../models'


const ReturnRequest: React.FC = () => {
  const history = useHistory()

  const userService = new UserService()
  // const salesData: any = history.location.state
  const [allSales, setAllSales] = useState<OrdersResponse[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [dropDown, setDropDownArray] = useState<string[]>([]);






  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })


  return (
    <IonPage className='return-r-main-container'>
      <IonRow>
        <IonCol className='return-r-header' size='12'>
          <div
            className='return-r-back-btn'
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
          <div className='return-r-title-text-container'>Back to Requests</div>
        </IonCol>
      </IonRow>

      <IonContent className='return-r-item-content'>
            <IonRow style={{padding:'0px'}}>
              <IonCol className='return-r-item-prop-container' size='12'>
                <img height={90} src="assets/images/test/item.png" alt="" />
                <div className='return-r-brand-name-box'>
                  <p className='return-r-item-brand'>Chanel</p>
                  <p className='return-r-item-name'>Taupe HandBag</p>
                </div>
                <div className='return-r-vendor-info'>
                  <p className='return-r-vendor'>Purchased from</p>
                  <p className='return-r-vendor-name'>@lauraClark</p>
                </div>
                <div className='return-r-purchased-info'>
                  <p className='return-r-title'>Priced Paid</p>
                  <p className='return-r-price'>$800</p>
                </div>
              </IonCol>
            </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default ReturnRequest


