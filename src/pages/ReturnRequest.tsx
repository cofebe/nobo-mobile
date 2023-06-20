import {
  IonButton,
  IonCol,
  IonContent,
  IonModal,
  IonPage,
  IonRow,
  IonTextarea,
  useIonViewWillEnter
} from '@ionic/react'
import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router'
import './ReturnRequest.scss'
import './ReturnRequest.css'
import Input from '../components/Input'
import { Product } from '../models'
import { formatPrice, getImageUrl } from '../utils'


const ReturnRequest: React.FC = () => {
  const history = useHistory()
  const [productsData, setProductData] = useState<any[]>([])




  const modal = useRef<HTMLIonModalElement>(null)
  const dismiss = () => {
    modal.current?.dismiss()
  }

  const [textValue, setTextValue] = useState<any>('')
  const [reasonForReturn, setReasonForReturn] = useState('')

  useIonViewWillEnter(() => {
    console.log(history.location.state)
    setProductData([history.location.state])
  })



  return (
    <IonPage className='return-r-main-container'>
      <IonRow>
        <IonCol className='return-r-header' size='12'>
          <div
            className='return-r-back-btn'
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
          <div className='return-r-title-text-container'>Back to Requests</div>
        </IonCol>
      </IonRow>

      <IonContent className='return-r-item-content'>
        <IonRow style={{ padding: '0px', marginTop: '17px' }}>
          {productsData?.map((product: Product) => (

            <IonCol key={product._id} className='return-r-item-prop-container' size='12'>

              <div className='img-container'
                style={{
                  backgroundImage: product.images?.length
                    ? getImageUrl(product.images[0]?.url)
                    : '',
                }}
              > </div>

              <div className="right-props">
                <div className='return-r-brand-name-box' >
                  <p className='return-r-item-brand'>{product.brand}</p>
                  <p className='return-r-item-name'>{product.name}</p>
                </div>
                <div className='return-r-vendor-info'>
                  <p className='return-r-vendor'>Purchased from</p>
                  <p className='return-r-vendor-name'>@{product.vendor.displayName}</p>
                </div>
                <div className='return-r-purchased-info'>
                  <p className='return-r-title'>Priced Paid</p>
                  <p className='return-r-price'>{formatPrice(product.price)}</p>
                </div>
              </div>

            </IonCol>
          ))}
          <IonCol className='return-input-container' size='12'>
            <Input
              placeholder='REASON FOR RETURN'
              value={reasonForReturn}
              className='return-input'
              onChange={(e) => { setReasonForReturn(e) }}
            />
            <div id='open-modal' onClick={() => { dismiss() }} className='img'>
              <img src="assets/images/down-arrow.svg" alt="" />
            </div>

          </IonCol>
          <IonCol size='12' className='return-item-testarea-box'>
            <IonTextarea
              className='return-item-testarea'
              placeholder='NOTES'
              spellcheck={true}
              title='post'
              autocapitalize='on sentence'
              maxlength={350}
              autoGrow={true}
              rows={5}
              value={textValue}
              onIonChange={e => {
                setTextValue(e.target.value);
              }}
            ></IonTextarea>
          </IonCol>
        </IonRow>
        <div className="return-s-btn-below">
          <IonButton className='btn' onClick={() => {
          }} >
            SUBMIT
          </IonButton>
        </div>
      </IonContent>

      <IonModal ref={modal} trigger='open-modal' initialBreakpoint={0.8} breakpoints={[0, 1]}>
        <IonPage className='return-modal-container'>
          <IonRow>
            <IonCol size='12' className='return-reason-title' >REASON FOR RETURN</IonCol>
            <IonCol size='12' className='return-reason-title2'
              onClick={() => {
                setReasonForReturn('AUTHENTICITY CONCERNS')
                dismiss()
              }}
            >AUTHENTICITY CONCERNS</IonCol>
            <IonCol size='12' className='return-reason-title2'
              onClick={() => {
                setReasonForReturn('ITEM IS NOT AS DESCRIBED')
                dismiss()
              }}
            >ITEM IS NOT AS DESCRIBED</IonCol>
            <IonCol size='12' className='return-reason-title2'
              onClick={() => {
                setReasonForReturn('WRONG SIZE')
                dismiss()
              }}
            >WRONG SIZE</IonCol>
            <IonCol size='12' className='return-reason-title2'
              onClick={() => {
                setReasonForReturn('OTHERS')
                dismiss()
              }}
            >OTHERS</IonCol>

          </IonRow>
        </IonPage>
      </IonModal>

    </IonPage>
  )
}

export default ReturnRequest


