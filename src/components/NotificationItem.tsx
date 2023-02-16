import { IonItem, IonRow, IonCol, IonAvatar, IonIcon } from '@ionic/react';
import { statsChartOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Notification } from '../data/notifications';
import './Notifications.css';


interface NotificationsItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationsItemProps> = ({notification}) => {

  return (
    <IonRow className="nobo-notification-container">
      <IonCol className="nobo-notification-name" size="5">
        {notification.subject}
      </IonCol>
      <IonCol className="nobo-notification-message" size="6">
        {notification.message}
      </IonCol>
    </IonRow>
  )
}

export default NotificationItem;