import { IonButton, IonCol, IonContent, IonPage, IonRow, IonTextarea } from '@ionic/react'
import './HelpSupportShipping.scss'
import { useHistory } from 'react-router'

const HelpSupportShipping = () => {
  const history = useHistory()



  return (
    <IonPage className='help-support-shipping-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='help-support-shipping-back-btn'
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

          <IonCol className='help-support-shipping-title-text-container'>SHIPPING</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='help-support-shipping-ion-content'>
        <IonRow className='help-support-shipping-container-1'>
          <IonCol className='contact' size='12'>CONTACT <span className='support'>SUPPORT</span></IonCol>
          <IonCol className='email' size='12'>Customerservice@thenobo.com</IonCol>
          <IonCol className='info' size='12'>
            Make sure to include your TheNOBO account email and
            specific details of the problems you're experiencing
          </IonCol>
          <IonCol className='faq' size='12'>Check out our <span className='support'>FAQ</span> for quick solutions </IonCol>

        </IonRow>



      </IonContent>
    </IonPage>
  )
}

export default HelpSupportShipping
