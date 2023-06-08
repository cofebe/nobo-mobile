import { IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import './Returns.scss'
import { UserService } from '../services/UserService'
import Search from '../components/Search'
import { FullOrder, OrdersResponse } from '../models'


const Returns: React.FC = () => {
  const history = useHistory()

  const userService = new UserService()
  // const salesData: any = history.location.state
  const [allSales, setAllSales] = useState<OrdersResponse[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [dropDown, setDropDownArray] = useState<string[]>([]);






  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

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
    <IonPage className='return-main-container'>
      <IonRow>
        <IonCol className='return-header' size='12'>
          <div
            className='return-back-btn'
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
          <div className='return-title-text-container'>RETURN REQUESTS</div>
        </IonCol>
      </IonRow>

      <IonContent className='return-item-content'>
        <IonRow className='return-item-container'
        onClick={()=>{
          history.push('/settings/returns/4')
        }}
        >
          <IonCol className='return-item-box' size='12'>
            <p className="return-brand">Channel</p>
            <p className="return-date">Submitted feb 5 2022</p>
          </IonCol>
          <IonCol className='return-item-name' size='12'>
            HandBag
          </IonCol>
          <IonCol className='return-cost-info' size='2.5'>
            <p className="return-cost-title">Cost</p>
            <p className="return-cost">$120</p>
          </IonCol>


        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default Returns


