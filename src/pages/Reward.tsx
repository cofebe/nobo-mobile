import { IonButton, IonCol, IonContent, IonModal, IonPage, IonRow, IonTextarea, useIonViewWillEnter } from '@ionic/react'
import './Reward.scss'
import './Reward.css'
import { useHistory } from 'react-router'
import { useRef, useState } from 'react'
import { UserService } from '../services/UserService'

const Reward = () => {
  const userService = new UserService()
  const history = useHistory()
  const modal = useRef<HTMLIonModalElement>(null)
const [fivePercentCoupon, setfivePercent] = useState<string>('')
const [tenPercentCoupon, setTenPercent] = useState<string>('')
const [fifteenPercentCoupon, setfifteenPercent] = useState<string>('')
const [couponCode, setCouponCode] = useState<string>('')


  const getRewards = () => {
    userService.getRewards()
      .then((rewards) => {
        setfivePercent(rewards.coupons.USD_5_OFF.code)
        setTenPercent(rewards.coupons.USD_10_OFF.code)
        setfifteenPercent(rewards.coupons.USD_15_OFF.code)
      })
      .catch((error) => { console.log('unable to fetch rewards :', error) })
  }

  useIonViewWillEnter(()=>{
    getRewards()
  })

  return (
    <IonPage className='reward-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='reward-back-btn'
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

          <IonCol className='reward-title-text-container'>REWARDS</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='reward-ion-content'>
        <div>
          <IonRow className='reward-header-container'>
            <IonCol className='reward-header-text'>
              <p className='text' style={{ fontWeight: 700 }}>REWARD</p>
            </IonCol>
          </IonRow>

          <IonRow className='reward-trophy-container'
            onClick={() => {
              setCouponCode(fivePercentCoupon)
              modal.current?.present()
            }}
          >
            <IonCol className='reward-trophy-box'>
              <div className="circle">
                <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
              </div>
              <div className="info">
                <p className='info-text-1'>$5 off your Purchase</p>
                <p className='info-text-2'>5 Points | Expires in 1 Year</p>
              </div>
              <div className="arrow">
                <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
              </div>
            </IonCol>
          </IonRow>

          <IonRow className='reward-trophy-container'
            onClick={() => {
              setCouponCode(tenPercentCoupon)
              modal.current?.present()
            }}
          >
            <IonCol className='reward-trophy-box'>
              <div className="circle">
                <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
              </div>
              <div className="info">
                <p className='info-text-1'>$10 off your Purchase</p>
                <p className='info-text-2'>10 Points | Expires in 1 Year</p>
              </div>
              <div className="arrow">
                <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
              </div>
            </IonCol>
          </IonRow>

          <IonRow className='reward-trophy-container'
            onClick={() => {
              setCouponCode(fifteenPercentCoupon)
              modal.current?.present()
            }}
          >
            <IonCol className='reward-trophy-box'>
              <div className="circle">
                <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
              </div>
              <div className="info">
                <p className='info-text-1'>$15 off your Purchase</p>
                <p className='info-text-2'>15 Points | Expires in 1 Year</p>
              </div>
              <div className="arrow">
                <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
              </div>
            </IonCol>
          </IonRow>

          <IonRow className='reward-earn-container'>
            <IonCol className='reward-earn-text'>
              <p className='text' style={{ fontWeight: 700 }}>HOW TO EARN</p>
            </IonCol>
          </IonRow>

          <IonRow className='earn-box-container'>
            <IonCol className='earn-box1' size='2.5'>
              <img className='cart-img' width={22} height={21} src='assets/images/reward-cart.svg' alt="" />
              <p className='buy'>BUY</p>
              <p className='plus'>+1</p>
            </IonCol>

            <IonCol className='earn-box2' size='2.5'>
              <img className='doller' width={22} height={21} src='assets/images/reward-dollar-sign.svg' alt="" />
              <p className='sell'>SELL</p>
              <p className='plus2'>+2</p>
            </IonCol>

            <IonCol className='earn-box3' size='2.5'>
              <img className='refresh' width={22} height={21} src='assets/images/reward-refresh.svg' alt="" />
              <p className='trade'>TRADE</p>
              <p className='plus3'>+3</p>
            </IonCol>

          </IonRow>
        </div>
      </IonContent>
      <IonModal
        className='reward-main-modal'
        ref={modal}
        initialBreakpoint={1}
        breakpoints={[1, 5]}>
        <IonRow className='reward-body'>
          <IonCol size='12' className='reward-header-box'>
            <p className='reward-header-text'>$5 OFF REWARD</p>
          </IonCol>
          <IonCol size='12' className='reward-promo-box'>
            <p className='reward-promo-code'>PROMO CODE</p>
            <p className='reward-promo-text'>{couponCode}</p>
          </IonCol>
          <div className='reward-line'></div>

          <IonCol size='12' className='reward-info-box'>
            <p className='reward-info-text'>
              your exclusive $5 reward is valid on your next purxhase totaling in $5.00 or more before taxed and shipping are applied. This offer code is unique to your email address. Offer excludes gift cards. One time use only. Cannot be applied toward previous transactions. Other exlclusions may apply
            </p>
          </IonCol>
        </IonRow>
      </IonModal>

    </IonPage>
  )
}

export default Reward
