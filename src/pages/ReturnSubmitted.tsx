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



const ReturnSubmitted: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()







  // const product: any = tradesData


  return (
    <IonPage className='return-s-item-main-container'>
      <IonContent className='return-s-content'>
        <IonRow style={{ backgroundColor: '#FEFCF7' }}>
          <IonCol className='return-s-item-header' size='12'>
            <IonCol className='return-s-title-text-container'>RETURN SUBMITTED</IonCol>
          </IonCol>
        </IonRow>

        <IonRow style={{ marginTop: '10px' }}>
          <IonCol size='12' className='return-s-info-header'>
            <img className='img' height={18} src='assets/images/checkmark-green.svg' alt="" />
          </IonCol>
        </IonRow>



        <div className='return-s-container2'>
          <div className='return-s-desc2'>
            YOUR RETURN HAS BEEN SUBMITTED. PLEASE SHIP YOUR ITEM BACK TO US
            WITHIN 10 DAYS AND WE WILL FOLLOW UP WITH YOU VIA EMAIL
          </div>
        </div>
        <IonGrid>
          <IonRow style={{padding:'0px'}}>
            <IonCol size='12' className='return-s-info-body'>
            For eligible returns you can submit a Return Request located
            in your user account up to 7 days from the date of receiving
            the item. The item must then also be shipped back out to us,
            within 10 days. Items received with the tag missing or removed
             will be rejected. You will be notified  by email once we have
             received and processed your return.

            </IonCol>
          </IonRow>

        </IonGrid>
        <div className="return-s-btn-below">
          <IonButton className='btn' onClick={() => {
            history.replace('/settings/returns')
          }} >VIEW MY RETURN REQUEST</IonButton>

          <IonButton style={{ backgroundColor: 'white' }} className='btn' fill='outline' onClick={() => {
            history.replace(`/home/style-feed`)
          }} >BACK TO HOME FEED</IonButton>
        </div>

      </IonContent>
    </IonPage>
  )
}

export default ReturnSubmitted
