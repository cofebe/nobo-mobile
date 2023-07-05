import React, { useState } from 'react'
import './PurchasesSavings.scss'
import { IonPage, IonRow, IonCol, useIonViewWillEnter } from '@ionic/react'
import { UserService } from '../services/UserService'
import { OrdersResponse } from '../models'

const PurchasesSavings = () => {
  const userService = new UserService()
  const [myOrders, setMyOrders] = useState<OrdersResponse[]>([]);


  const getOrder = () => {
    userService
      .getOrders()
      .then(orders => {
        if (orders) {
          setMyOrders([orders]);
        }
      });
  }

  useIonViewWillEnter(() => {
    getOrder()
  })



  return (
    <IonRow className='purchase-s-main-container'>
    { myOrders[0]?.docs.map((order)=>(
      <>
      <IonCol className='purchase-s-box' size='3'>{order.status}</IonCol>
      <IonCol size='1.5'></IonCol>
      <IonCol className='purchase-s-box' style={{ backgroundColor: 'green' }} size='2.5'>2</IonCol>
      <IonCol className='purchase-s-box' style={{ backgroundColor: 'yellow' }} size='2.5'>3</IonCol>
      <IonCol className='purchase-s-box' style={{ backgroundColor: 'gray' }} size='2.5'>4</IonCol>
      </>
    )) }
    </IonRow>
  )
}

export default PurchasesSavings
