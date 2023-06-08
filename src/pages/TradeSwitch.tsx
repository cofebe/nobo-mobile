import { useState } from 'react'
import {
  IonCol,
  IonContent,
  IonPage,
  IonRow,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from '@ionic/react'
import './TradeSwitch.scss'
import { useHistory, } from 'react-router'
import MyTrade from './MyTrade'
import TradeCompleted from './TradeCompleted'



const TradeSwitch: React.FC = () => {
  const history = useHistory()
  const [toggle, setToggle] = useState(false)

useIonViewDidEnter(()=>{
  // setToggle(true)

})



  console.log(toggle)
  return (
    <IonPage className='t-item-main-container'>
      <IonRow>
        <IonCol className='t-item-header' size='12'>
          <div
            className='t-item-back-btn'
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
          <IonCol className='t-item-title-text-container'>SWITCH</IonCol>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size='12' className='t-item-info-header'>
          <div
            onClick={() => {
              setToggle(!toggle)

            }}
          >
            {toggle ? <img src='assets/images/trade-offer.svg' alt="" />
              : <img src='assets/images/trades-completed.svg' alt="" />}
          </div>
        </IonCol>
      </IonRow>
      <IonContent className='t-item-content'>
        {toggle ?( <MyTrade /> ):( <TradeCompleted />)}
      </IonContent>
    </IonPage>
  )
}

export default TradeSwitch
