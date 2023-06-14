import React from 'react'
import './WithdrawalSubmit.scss'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
} from '@ionic/react'
import './ReturnSubmitted.scss'
import { useHistory, } from 'react-router'
import { UserService } from '../services/UserService'










const WithdrawalSubmit:React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  return (
    <IonPage className='withrawal-s-item-main-container'>
    <IonContent className='withrawal-s-content'>
      <IonRow style={{ backgroundColor: '#FEFCF7' }}>
        <IonCol className='withrawal-s-item-header' size='12'>
          <IonCol className='withrawal-s-title-text-container'>REQUEST SUBMITTED</IonCol>
        </IonCol>
      </IonRow>

      <IonRow style={{ marginTop: '10px' }}>
        <IonCol size='12' className='withrawal-s-info-header'>
          <img className='img' height={18} src='assets/images/checkmark-green.svg' alt="" />
        </IonCol>
      </IonRow>



      <div className='withrawal-s-container2'>
        <div className='withrawal-s-desc2'>
        Your funds will be available to your account in 1 - 3 business days
        </div>
      </div>

      <div className="withrawal-s-btn-below">
        <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline' onClick={() => {
          history.replace(`/home/style-feed`)
        }} >BACK TO HOME FEED</IonButton>
      </div>

    </IonContent>
  </IonPage>
  )
}

export default WithdrawalSubmit
