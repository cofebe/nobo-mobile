import { IonButton, IonCol, IonContent, IonPage, IonRow, IonTextarea } from '@ionic/react'
import './HelpSupport.scss'
import { useHistory } from 'react-router'

const HelpSupport = () => {
  const history = useHistory()



  return (
    <IonPage className='help-support-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='help-support-back-btn'
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

          <IonCol className='help-support-title-text-container'>HELP</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='help-support-ion-content'>
        <IonRow className='help-support-container-1'>
          <IonCol className='contact' size='12'>CONTACT <span className='support'>SUPPORT</span></IonCol>
          <IonCol className='email' size='12'>Customerservice@thenobo.com</IonCol>
          <IonCol className='info' size='12'>
            Make sure to include your TheNOBO account email and
            specific details of the problems you're experiencing
          </IonCol>
          <IonCol className='faq' size='12'>Check out our <span className='support' onClick={()=>{
            history.push('/settings/faq')
          }}>FAQ</span> for quick solutions </IonCol>

        </IonRow>



      </IonContent>
    </IonPage>
  )
}

export default HelpSupport
