import { IonButton, IonCol, IonContent, IonPage, IonRow, IonTextarea } from '@ionic/react'
import './Faq.scss'
import { useHistory } from 'react-router'

const Faq = () => {
  const history = useHistory()



  return (
    <IonPage className='faq-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='faq-back-btn'
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

          <IonCol className='faq-title-text-container'>FAQs</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='faq-ion-content'>
        <IonRow className='faq-text-container'>
          <IonCol className='faq-text-box'>How do you list an item with NOBO?</IonCol>
        </IonRow>
        <IonRow className='faq-text-container'>
          <IonCol className='faq-text-box'>What happens when your consignment item is purchased?</IonCol>
        </IonRow>




      </IonContent>
    </IonPage>
  )
}

export default Faq
