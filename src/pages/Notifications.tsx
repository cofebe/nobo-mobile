import {
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonList,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useState } from 'react';
// import "./Notifications.css";
// import UrpHeader from '../components/NoboHeader';
import { NotificationService } from '../services/NotificationService';
import NotificationItem from '../components/NotificationItem';
import { Notification } from '../data/notifications';

const Notifications: React.FC = () => {
  const notificationService = new NotificationService();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  notificationService.resetNotifcationCount();

  useIonViewWillEnter(() => {
    // some initialization code
    loadNotifications(0);
  });

  function loadNotifications(pg: number) {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    notificationService
      .getNotifications(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      });
  }

  return (
    <IonPage>
      {/* <UrpHeader></UrpHeader> */}
      <IonContent className="home-notifications-bg" scrollY={true}>
        <IonList style={{ marginTop: '40px' }}>
          {notifications.map((m) => {
            return <NotificationItem notification={m}></NotificationItem>;
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
