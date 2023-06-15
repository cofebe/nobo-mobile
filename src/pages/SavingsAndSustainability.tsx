import React from 'react';
import { useState} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/react';
// import DonutGraph from '../components/DonutGraph';
// import './SavingsAndSustainabilityPage.scss';
import { UserService } from '../services/UserService';

const SavingsAndSustainabilityPage: React.FC = () => {
  const pointsData = [75, 25];
  const pointsLabels = ['Current Points', 'Points to Next Reward'];
  const userService = new UserService();
  const [myOrders, setMyOrders] = useState<any[]>();
  const [myTrades, setMyTrades] = useState<any[]>();


  function onLoad() {
    //getOrders
    userService
      .getOrders()
      .then( orders => {
        setMyOrders(orders);
      })
    //getMyTrades
    userService
      .getMyTrades()
      .then( trades => {
        setMyTrades(trades);
      })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Rewards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="rewards-container">
          <IonCard className="rewards-card">
            <IonCardContent>
              <div className="rewards-graph">
                <DonutGraph data={pointsData} labels={pointsLabels} />
              </div>
              <div className="rewards-points">
                <p>You have X points</p>
                <p>Y points to the next reward</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      {/* Show Orders */}
    {/* Show Trades*/}
      </IonContent>
    </IonPage>
  );
};

export default SavingsAndSustainabilityPage;
