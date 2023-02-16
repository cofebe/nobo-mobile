import {
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  useIonViewWillEnter
} from '@ionic/react';
import './UrpHeader.scss';
import { useHistory } from "react-router-dom";
import { NotificationService } from '../services/NotificationService';
import { useState } from 'react';

const UrpHeader: React.FC = () => {
  const history = useHistory();
  const notificationService = new NotificationService();

  const [badgeCount, setBadgeCount] = useState<number>(notificationService.getNotifcationCount());

  // useIonViewWillEnter( () => {
  //   update();
  // })

  // function update() {
  //   console.log("Update start")
  //   setTimeout( () => {
  //     setBadgeCount(notificationService.getNotifcationCount())
  //     console.log("updated header")
  //   }, 1000)
  //   update();
  // }

  return (
      <IonHeader className="home-header">
        <IonToolbar className="home-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="9" style={{ paddingLeft: "2rem" }}>
                <div className="nobo-float-logo">
                  <img
                    src="assets/images/nobo_logo_withtagline.png"
                    width="53px"
                    height="30px"
                    alt="logo with tagline"
                  />
                </div>
              </IonCol>
              <IonCol
                size="3"
                style={{ textAlign: "center", alignSelf: "self-end" }}
              >
                <img
                  src="assets/images/bell.svg"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/home/notifications");
                  }}
                  width="25"
                  alt="notifications"
                />
                { badgeCount > 0 && (<IonBadge style={{position: 'absolute', left: '25px', top: '-5px'}}>{badgeCount}</IonBadge>)}
                <img
                  style={{ marginLeft: "1rem" }}
                  className="ion-margin-start"
                  src="assets/images/gear.svg"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/settings");
                  }}
                  width="25"
                  alt="settings"
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
  );
};

export default UrpHeader;
