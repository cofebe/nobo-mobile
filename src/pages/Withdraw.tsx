import React, { useRef, useState } from 'react'
import './Withdraw.scss'
import './Withdraw.css'
import { IonButton, IonCol, IonContent, IonModal, IonPage, IonRow, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react'
import Header from '../components/Header'
import { UserService } from '../services/UserService'
import { formatPrice } from '../utils'
import Input from '../components/Input'
import { useHistory } from 'react-router'

interface AccResponse {
  availableFunds: number
  pendingFunds: number
}
interface FundsResponse {
  success: boolean
}

const Withdraw: React.FC = () => {
  const history = useHistory()
  const userService = new UserService()
  const [pendingFunds, setPendingFunds] = useState<number>(0)
  const [availableFunds, setAvailableFunds] = useState<number>(0)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<boolean>(false);


  // email check...
  const emailCheck = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const modal = useRef<HTMLIonModalElement>(null)
  const present = () => {
    modal.current?.present()
  }
  const dismiss = () => {
    modal.current?.dismiss()
  }

  const loadBalance = () => {
    userService.getAccount()
      .then((res: AccResponse) => {
        setPendingFunds(res.pendingFunds)
        setAvailableFunds(res.availableFunds)
        console.log('res', res)
      })
      .catch((error) => { console.log('err getting acc details', error) })
  }

  useIonViewWillEnter(() => {
    loadBalance()
   setError(false)

  })
  useIonViewWillLeave(() => {
   setError(false)
  })

  const transferFunds = (paypal: string, email: string) => {
    userService.transferFunds(paypal, email)
      .then((res: FundsResponse) => {
        if (res.success) {
          dismiss()
          history.push('/settings/withdraw/submitted')
        } else {
          console.log('transfer failed')
        }
      })
      .catch((error) => { console.log('err getting acc details', error) })
  }

  const validateInput = () => {
    if (email.length < 6) {
      return false;
    } else {
      return true
    }
  }

  return (
    <IonPage className='withdraw-main-container'>
      <Header title='WITHDRAWAL REQUESTS' />
      <IonContent className='withdraw-content'>

        <IonRow className='withraw-card-container'>
          <IonCol className='withraw-card'>
            <div className="status">PENDING FUNDS</div>
            <div className="balance">{formatPrice(pendingFunds)}</div>
            <div className="info">
              TheNOBO may hold your funds from
              a sale for up to 21 days after your
              item has been delivered to the buyer
              to ensure the security of the transaction.
              Once the sale has been confirmed, the funds
              will no longer be pending and appear as “Available Funds.”

            </div>
          </IonCol>
        </IonRow>
        <IonRow className='withraw-card-container'>
          <IonCol className='withraw-card'>
            <div className="status">AVAILABLE FUNDS</div>
            <div className="balance">{formatPrice(availableFunds)}</div>
            <div className="info">
              TheNOBO may hold your funds from
              a sale for up to 21 days after your
              item has been delivered to the buyer
              to ensure the security of the transaction.
              Once the sale has been confirmed, the funds
              will no longer be pending and appear as “Available Funds.”

            </div>
          </IonCol>
        </IonRow>
        <IonRow className='withdraw-payment-method'>
          <IonCol className='title'>Select Payout Method</IonCol>
        </IonRow>
        <IonRow className='withdraw-payment-method-box'>

          <IonCol size='5.5' className='payment-box'
            onClick={() => {
              present()
            }}
          >
            <div className='img-container'>
              <img className='' height={78} src='assets/images/test/your-bank-eclips.svg' alt="" />
              <img className='img' height={74} src='assets/images/test/paypal-tab.svg' alt="" />
            </div>
            <div className="info1">PayPal</div>
            <div className="info2">5 business days</div>
          </IonCol>

          {/* <IonCol size='5.5' className='payment-box'> */}
          {/* <div className='img-container'>
              <img className='' height={78} src='assets/images/test/your-bank-eclips.svg' alt="" />
              <img className='img2' height={43} src='assets/images/test/bank.svg' alt="" />
            </div> */}
          {/* <div className="info1">PayPal</div> */}
          {/* <div className="info3">Add your Bank 1-3 Business Days</div> */}
          {/* </IonCol> */}
        </IonRow>

        {/* {showInput && (<IonRow className='withdraw-payment-input-container'>
          <IonCol size='12'>
            <Input
              className='withdraw-input'
              placeholder='EMAIL ADDRESS'
              value={email}
              onChange={(val) => {
                setEmail(val)
              }}
            ></Input>
          </IonCol>
          <div className="withrawal-r-btn-below">
            <IonButton style={{ backgroundColor: 'white' }} className='btn'
              onClick={() => {
                transferFunds('paypal', email)
              }} >TRANSFER FUNDS</IonButton>
          </div>
        </IonRow>)} */}

      </IonContent>

      <IonModal
        ref={modal} trigger='open-return-modal' initialBreakpoint={1} breakpoints={[0, 5]}
        className='withdraw-details-ion'
      >
        <IonContent  >
          <IonRow className='withdraw-payment-input-container'>
            <IonCol size='12' className='withdraw-payment-input-box'>
              <Input
                className={`withdraw-input ${error ? 'invalid-text-color' : ''}`}
                errorMessage={error ? 'Enter a valid email address' : ''}
                placeholder='EMAIL ADDRESS'
                value={email}
                onChange={(val) => {
                  setEmail(val)
                  if (!emailCheck(val)) {
                    setError(true);
                  } else {
                    setError(false);
                  }
                }}
              ></Input>

            </IonCol>
            <IonCol size='12' className='btn-container'>
              <IonButton
                style={{  width:350, height:51 }} className='btn'
                onClick={() => {
                  transferFunds('paypal', email)
                }}
                disabled={!validateInput() || error}
              >
                TRANSFER FUNDS
              </IonButton>
            </IonCol>
          </IonRow>
        </IonContent>
      </IonModal>

    </IonPage>
  )
}

export default Withdraw
