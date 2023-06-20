import React from "react";
import { useState} from "react";
import { useHistory, useParams } from "react-router";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonRow, IonCol } from "@ionic/react";
import DonutGraph from "../components/DonutGraph";
import { FullOrder, OrdersResponse, TradesResponse } from "../models"
import "./SavingsAndSustainability.scss";
import { UserService } from "../services/UserService";
import Toggle from '../components/Toggle';

const SavingsAndSustainabilityPage: React.FC = () => {
  const history = useHistory()
  const pointsData = [3, 5];
  const pointsLabels = ["Current Points", "Points to Next Reward"];
  const userService = new UserService();
  const [myOrders, setMyOrders] = useState<OrdersResponse[]>();
  const [myTrades, setMyTrades] = useState<TradesResponse[]>();
  const [points, setPoints] = useState<number>();
  const [savingsAmount, setSavingsAmount] = useState<string>("");

  const [isToggled, setIsToggled] = useState(false);
  const myPurchasesText = "PURCHASE SAVINGS";
  const mySavingsText = "TRADE SAVINGS";

  const handleClick = () => {
      setIsToggled(!isToggled);
  }

  function onLoad() {
    userService
      .getOrders()
      .then( orders => {
        if(orders) {
          setMyOrders([orders]);
        }
      });

    userService
      .getMyTrades()
      .then( trades => {
        if(trades) {
          setMyTrades([trades]);
        }
      });

    userService
      .getRewards()
      .then( reward => {
        if(reward) {
          setPoints(reward.point)
        }
      })

    console.log(points)
    setPoints(5)
  }

  return (
    <IonPage className="savings-page">
      <IonRow>
        <IonCol className="savings-header" size="12">
          <div
            className="savings-back-btn"
            onClick={() => {
              history.goBack()
            }}
          >
            <img
              height={23}
              src="assets/images/arrow-left.svg"
              alt="logo"
            />
          </div>
          <div className="savings-title-text-container">SAVINGS & SUSTAINABILITY</div>
        </IonCol>
        <IonCol className="savings-header" size="12">
          <div className="savings-title-text-container savings-sub-title" style={{textAlign: "left"}}>REWARDS</div>
        </IonCol>
      </IonRow>
      <IonContent className="rewards-content">
        <div className="rewards-container">
          <IonCard className="rewards-card">
            <IonCardContent>
              <IonRow>
                <IonCol className="savings-header" size="6">
                  <div className="rewards-graph">
                    <DonutGraph data={pointsData} labels={pointsLabels} />
                  </div>
                </IonCol>
                <IonCol className="savings-header" size="6">
                  <div className="rewards-points">
                    <p className="savings-text">{pointsData[1]} POINTS FROM YOUR NEXT REWARD!</p>
                    <p className="savings-details">DETAILS</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
        </div>
      <IonRow>
        <IonCol className="savings-header" size="12">
          <div className="savings-title-text-container savings-sub-title" style={{textAlign: "left"}}>SAVINGS</div>
        </IonCol>
        <IonCol className="savings-header" size="12">
          <p className="savings-amount">${savingsAmount || "0.00"}</p>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="savings-header" size="12">
          <div className="savings-title-text-container savings-sub-title" style={{textAlign: "left"}}>SUSTAINABILITY</div>
        </IonCol>
        <IonCol className="savings-header" size="12">
          <div className="rewards-graph">
            <DonutGraph data={pointsData} labels={pointsLabels} />
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <Toggle
            className={`toggle-switch-savings ${isToggled ? 'checked' : ''}`}
            labelOne={myPurchasesText}
            labelTwo={mySavingsText}
            isToggled={isToggled}
            onClick={handleClick}>
        </Toggle>
      </IonRow>
      {/* Show Orders */}
    {/* Show Trades*/}
      </IonContent>
    </IonPage>
  );
};

export default SavingsAndSustainabilityPage;
