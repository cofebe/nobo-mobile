import { IonCol, IonContent, IonModal, IonPage, IonRow, useIonToast, useIonViewWillEnter } from '@ionic/react'
import './Reward.scss'
import './Reward.css'
import { useHistory } from 'react-router'
import { useRef, useState } from 'react'
import { UserService } from '../services/UserService'
import { Clipboard } from '@capacitor/clipboard';
import DonutGraph from '../components/DonutGraph'


const Reward = () => {
  const userService = new UserService()
  const history = useHistory()
  const modal = useRef<HTMLIonModalElement>(null)
  const [fivePercentCoupon, setFivePercent] = useState<string>('')
  const [tenPercentCoupon, setTenPercent] = useState<string>('')
  const [fifteenPercentCoupon, setFifteenPercent] = useState<string>('')
  const [twentyPercentCoupon, setTwentyPercentCoupon] = useState<string>('')
  const [twentyFivePercentCoupon, setTwentyFivePercentCoupon] = useState<string>('')
  const [thirtyPercentCoupon, setThirtyPercentCoupon] = useState<string>('')
  const [thirtyFivePercentCoupon, setThirtyFivePercentCoupon] = useState<string>('')
  const [rewardPoints, setRewardPoints] = useState<number>(0)
  const [untilNextReward, setUntilNextReward] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('')
  const [rewardType, setRewardType] = useState<string>('')
  const [activeCoupon, setActiveCoupon] = useState(false)
  const [valid5Percents, setValid5Percents] = useState(false)
  const [valid10Percents, setValid10Percents] = useState(false)
  const [valid15Percents, setValid15Percents] = useState(false)
  const [valid20Percents, setValid20Percents] = useState(false)
  const [valid25Percents, setValid25Percents] = useState(false)
  const [valid30Percents, setValid30Percents] = useState(false)
  const [valid35Percents, setValid35Percents] = useState(false)
  const [present] = useIonToast();

  const pointsData = [rewardPoints, untilNextReward];

  const pointsLabels = ["Current Points", "Points to Next Reward"];

  const presentToast = (position: 'top' | 'middle' | 'bottom') => {
    present({
      message: `${couponCode} Copied to clipboard`,
      duration: 1000,
      position: position,
    });
  };

  const writeToClipboard = async (code: string) => {
    await Clipboard.write({
      string: `${code}`
    });
    presentToast('top')
    modal.current?.dismiss()
  };

  useIonViewWillEnter(() => {
    userService
      .getRewards()
      .then((rewards) => {
        if (rewards) {
          console.log("Got Rewards: ", rewards)
          setValid5Percents(rewards.coupons?.USD_5_OFF?.active || false)
          setValid10Percents(rewards.coupons?.USD_10_OFF?.active || false)
          setValid15Percents(rewards.coupons?.USD_15_OFF?.active || false)
          setValid20Percents(rewards.coupons?.USD_20_OFF?.active || false)
          setValid25Percents(rewards.coupons?.USD_25_OFF?.active || false)
          setValid30Percents(rewards.coupons?.USD_30_OFF?.active || false)
          setValid35Percents(rewards.coupons?.USD_35_OFF?.active || false)
          setRewardPoints(rewards.points)
          setFivePercent(rewards.coupons?.USD_5_OFF?.code)
          setTenPercent(rewards.coupons?.USD_10_OFF?.code)
          setFifteenPercent(rewards.coupons?.USD_15_OFF?.code)
          setTwentyPercentCoupon(rewards.coupons?.USD_20_OFF?.code)
          setTwentyFivePercentCoupon(rewards.coupons?.USD_25_OFF?.code)
          setThirtyPercentCoupon(rewards.coupons?.USD_30_OFF?.code)
          setThirtyFivePercentCoupon(rewards.coupons?.USD_35_OFF?.code)
          setUntilNextReward(rewards?.pointsTillNextReward)
        }
      })
      .catch((error) => {
        console.log('unable to fetch rewards :', error)
      })
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

          <IonRow className='rewards-graph-container'>
            <IonCol className='rewards-graph-box' style={{ height: 100 }}>
              <DonutGraph data={pointsData} labels={pointsLabels} > </DonutGraph>
              <p className='reward-g-text'>+{rewardPoints}</p>
            </IonCol>
          </IonRow>
          <IonRow className='rewards-point-r-container'>
            <IonCol className='rewards-point-r-box'>
              <p className='rewards-point-r-text'>{untilNextReward} POINTS FROM YOUR NEXT REWARD</p>

            </IonCol>
          </IonRow>

          <div style={{ marginTop: '39px' }}>
            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 4) {
                  setActiveCoupon(valid5Percents)
                  setCouponCode(fivePercentCoupon)
                  setRewardType('5% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 5 ? 'reward-trophy-box2' : 'reward-trophy-box'} >
                <div
                  className={rewardPoints > 4 ? 'circle2' : 'circle'}>
                  {/* className={rewardPoints > 4 && rewardPoints < 9 ? 'circle2' :'circle'}> */}
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>5% off your Purchase</p>
                  <p className='info-text-2'>5 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 4 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>

            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 9) {
                  setActiveCoupon(valid10Percents)
                  setCouponCode(tenPercentCoupon)
                  setRewardType('10% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 9 ? 'reward-trophy-box2' : 'reward-trophy-box'}>
                <div
                  className={rewardPoints > 9 ? 'circle2' : 'circle'}
                >
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>10% off your Purchase</p>
                  <p className='info-text-2'>10 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 9 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>

            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 19) {
                  setCouponCode(fifteenPercentCoupon)
                  setActiveCoupon(valid15Percents)
                  setRewardType('15% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 19 ? 'reward-trophy-box2' : 'reward-trophy-box'}>
                <div
                  className={rewardPoints > 19 ? 'circle2' : 'circle'}
                >
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>15% off your Purchase</p>
                  <p className='info-text-2'>15 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 19 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>
            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 49) {
                  setCouponCode(twentyPercentCoupon)
                  setActiveCoupon(valid20Percents)
                  setRewardType('20% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 49 ? 'reward-trophy-box2' : 'reward-trophy-box'}>
                <div
                  className={rewardPoints > 49 ? 'circle2' : 'circle'}
                >
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>20% off your Purchase</p>
                  <p className='info-text-2'>50 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 49 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>
            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 100) {
                  setCouponCode(twentyFivePercentCoupon)
                  setActiveCoupon(valid25Percents)
                  setRewardType('25% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 99 ? 'reward-trophy-box2' : 'reward-trophy-box'}>
                <div
                  className={rewardPoints > 99 ? 'circle2' : 'circle'}
                >
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>25% off your Purchase</p>
                  <p className='info-text-2'>100 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 99 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>
            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 149) {
                  setCouponCode(thirtyPercentCoupon)
                  setActiveCoupon(valid30Percents)
                  setRewardType('30% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 149 ? 'reward-trophy-box2' : 'reward-trophy-box'}>
                <div
                  className={rewardPoints > 149 ? 'circle2' : 'circle'}
                >
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>30% off your Purchase</p>
                  <p className='info-text-2'>150 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 149 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>
            <IonRow className='reward-trophy-container'
              onClick={() => {
                if (rewardPoints > 199) {
                  setCouponCode(thirtyFivePercentCoupon)
                  setActiveCoupon(valid35Percents)
                  setRewardType('35% OFF YOUR PURCHASE')
                  modal.current?.present()
                }
              }}
            >
              <IonCol className={rewardPoints > 199 ? 'reward-trophy-box2' : 'reward-trophy-box'}>
                <div
                  className={rewardPoints > 199 ? 'circle2' : 'circle'}
                >
                  <img width={25} height={24} src='assets/images/reward-trophy.svg' alt="" />
                </div>
                <div className="info">
                  <p className='info-text-1' style={{ fontSize: 12 }}>35% off your Purchase</p>
                  <p className='info-text-2'>200 Points | Expires in 1 Year</p>
                </div>
                <div className="arrow">
                  {rewardPoints > 199 ?
                    <img width={20} height={16} src='assets/images/reward-arrow-color.svg' alt="" />
                    :
                    <img width={20} height={16} src='assets/images/reward-arrow.svg' alt="" />
                  }
                </div>
              </IonCol>
            </IonRow>
          </div>

          <IonRow className='reward-earn-container'>
            <IonCol className='reward-earn-text'>
              <p className='text' style={{ fontWeight: 700 }}>HOW TO EARN</p>
            </IonCol>
          </IonRow>

          <IonRow className='earn-box-container' >

            <IonCol className='earn-box1' size='4'>
            <div className='container-flex'>
              <p className='buy'>LIST AN ITEM</p>
              <div>
                <img className='cart-img' width={22} height={21} src='assets/images/reward-dollar-sign.svg' alt="" />
              </div>
              <p className='plus'>+1</p>
            </div>
            </IonCol>

            <IonCol className='earn-box2' size='4'>
            <div className='container-flex'>
              <p className='sell'>BUY / SELL</p>
              <div>
               <img className='doller' width={22} height={21} src='assets/images/reward-cart.svg' alt="" />
              </div>
              <p className='plus2'>+2</p>
            </div>
            </IonCol>

            <IonCol className='earn-box3' size='4'>
              <div className='container-flex'>
                <p className='trade'>TRADE</p>
                <div>
                  <img className='refresh' width={22} height={21} src='assets/images/reward-refresh.svg' alt="" />
                </div>
                <p className='plus3'>+3</p>
              </div>
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
            <p className='reward-header-text'>{rewardType}</p>
          </IonCol>
          <IonCol size='12' className='reward-promo-box'>
            <p className='reward-promo-code'>PROMO CODE</p>
            <p className='reward-promo-text'>{couponCode}</p>

            <div
              className='reward-copy-box'
              onClick={() => {
                writeToClipboard(couponCode)
              }}
            >
              <img className='reward-copy-img' width={18} height={21}
                src='assets/images/reward-copy.svg' alt=""
              />
              <p className='reward-copy-text'>Copy</p>
            </div>
            {activeCoupon ? '' : <p style={{ color: 'red', marginLeft: 30 }}>USED</p>}

          </IonCol>
          <div className='reward-line'></div>

          <IonCol size='12' className='reward-info-box'>
            <p className='reward-info-text'>
              Your exclusive reward is valid on your next purchase totaling in X% off before taxed and shipping are applied. This offer code is unique to your email address. Offer excludes gift cards. One time use only. Cannot be applied toward previous transactions. Other exclusions may apply            </p>
          </IonCol>
        </IonRow>
      </IonModal>

    </IonPage>
  )
}

export default Reward
