import { IonButton, IonCol, IonContent, IonPage, IonRow, IonTextarea } from '@ionic/react'
import './ReturnPolicy.scss'
import { useHistory } from 'react-router'

const ReturnPolicy = () => {
  const history = useHistory()



  return (
    <IonPage className='return-policy-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='return-policy-back-btn'
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

          <IonCol className='return-policy-title-text-container'>RETURN POLICY</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='return-policy-ion-content'>
        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' style={{ fontWeight: 1000 }}>Return Policy</IonCol>
          <IonCol size='12' className='r-info'>
            For eligible returns you can submit a Return Request located in
            your user account up to 7 days from the date of receiving the item,
            and return the item within 10 days. Items received after 10 days
            or with the tag missing or removed cannot be returned. We’ll notify
            you by email once we have received and processed your return.
            Any items listed at 30% or more off of the original listing price,
            are final sale, and cannot be returned for credit. If you have
            a question about the authenticity of your traded or bought item,
            contact customer service, immediately.
          </IonCol>
        </IonRow>

        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' style={{ fontWeight: 1000 }}>
            Return of Items Shipped to TheNOBO
          </IonCol>
          <IonCol size='12' className='r-info'>
            If TheNOBO determines that your submitted item is unacceptable for trade,
            we reserve the right to return it to you, in which case you as a customer
            are responsible for return shipping fees. If you refuse or are unable to
            pay for return shipping if your item is unacceptable, TheNOBO reserves
            the right to discard the item.
          </IonCol>
        </IonRow>

        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' style={{ fontWeight: 1000 }}>
            Products Eligible for Returns
          </IonCol>
          <IonCol size='12' className='r-info'>
            All trades are final and traded products may not be returned
            unless there is an issue with authentication. Specifically,
            a traded product may not be returned unless the brand,
            product description, or quality are clearly different than
            that described in the product description. All full price
            consigned products are covered by TheNOBO’s return policy.
          </IonCol>
        </IonRow>

        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' style={{ fontWeight: 1000 }}>
          Issuance of Credit for Returns
          </IonCol>
          <IonCol size='12' className='r-info'>
            You will receive an email once your return has been received and processed.
            You can track the status of your return by clicking on Return
            Request in your account. Once completed, we will issue a full
            refund within 15 business days for all full price items.
            All sale items are eligible only for site credit in the
            amount of your purchase.
          </IonCol>
        </IonRow>



      </IonContent>
    </IonPage>
  )
}

export default ReturnPolicy
