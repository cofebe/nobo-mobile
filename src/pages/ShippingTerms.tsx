import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react'
import './ShippingTerms.scss'
import { useHistory } from 'react-router'

const ShippingTerms = () => {
  const history = useHistory()



  return (
    <IonPage className='shipping-terms-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='shipping-terms-back-btn'
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

          <IonCol className='shipping-terms-title-text-container'>SHIPPING</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='shipping-terms-ion-content'>
        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' style={{ marginBottom: '20px' }}>Shipping</IonCol>
          <IonCol size='12' className='r-info'>
            Consignment items are shipped from the seller to the
            buyer via USPS. Once an item is purchased, the consignor
            may print a shipping label from within their account on TheNOBO website.
            TheNOBO ships all trade orders via USPS.
          </IonCol>
        </IonRow>

        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' >

            Package Tracking
          </IonCol>
          <IonCol size='12' className='r-info'>
            We will send an email notification including tracking
            information when your package has shipped. You may view the status
            of your order and obtain tracking information in My Account.
            Delivery Insurance
            TheNOBO packages are insured by USPS.
          </IonCol>
        </IonRow>

        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' >
            Sales Tax
          </IonCol>
          <IonCol size='12' className='r-info'>
            TheNOBO has a fiduciary responsibility and is obligated
            by law to collect sales tax on orders shipped to U.S.
            jurisdictions that charge sales tax.
          </IonCol>
        </IonRow>

        <IonRow className='r-policy-container'>
          <IonCol size='12' className='r-policy' >
            Regions
          </IonCol>
          <IonCol size='12' className='r-info'>
            At present, we only accept consignment & items for
            trade from individuals within the United States
          </IonCol>
        </IonRow>



      </IonContent>
    </IonPage>
  )
}

export default ShippingTerms
