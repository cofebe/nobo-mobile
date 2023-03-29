import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import './Notifications.scss';
import Header from '../components/Header';
import { UserService } from '../services/UserService';
import { Notification } from '../models';

const Notifications: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);

  useIonViewWillEnter(() => {
    userService.getNotifications().then(notifications => {
      console.log('notifications', notifications);
      const unreadNotifications = notifications.filter(n => !n.readStatus);
      setUnreadNotifications(unreadNotifications);
      setReadNotifications(notifications.filter(n => n.readStatus));

      userService.markNotificationsAsRead(unreadNotifications.map(n => n._id)).then(() => {
        console.log('marked as read:', unreadNotifications);
      });
    });
  });

  function getImage(note: Notification) {
    return `url(${note.nid === 13 ? '/assets/images/smiley.svg' : note.image})`;
  }

  function getText(note: Notification) {
    return note.message
      .replace(/href="\/profile\/([^/]+)\/feed/, 'href="/home/profile/$1');
  }

  function getDate(note: Notification) {
    const dt = new Date(note.createdAt);
    const now = new Date();
    const diff = now.getTime() - dt.getTime();
    const seconds = Math.round(diff / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.round(hours / 24);
    return `${days}d`;
  }

  function select(note: Notification) {
    if (note.nid === 1) {
      history.push('/home/messages');
      return;
    }
  }

  function remove(note: Notification) {
    console.log('remove', note);
    if (note.readStatus) {
      setReadNotifications(readNotifications.filter(n => n._id !== note._id));
    } else {
      setUnreadNotifications(unreadNotifications.filter(n => n._id !== note._id));
    }
    document.querySelector('ion-item-sliding')?.closeOpened();
  }

  return (
    <IonPage className="notifications-container">
      <Header title="Notifications" showBackButton={false}>
        <img src="assets/images/nobo_logo.png" className="logo" alt="logo" />
      </Header>
      <IonContent className="notifications-content">
        <IonList>
          <IonItem lines="none" className="header">
            <div className="header">
              Unread
            </div>
          </IonItem>
          {unreadNotifications.length ? (
            <>
              {unreadNotifications.map((note, index) => (
                <IonItemSliding className="notification-container" key={index}>
                  <IonItem lines="none" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    select(note);
                  }}>
                    <div className="notification">
                      <div className="image" style={{ backgroundImage: getImage(note) }}></div>
                      <div className="text" dangerouslySetInnerHTML={{ __html: getText(note) }}></div>
                      <div className="date">{getDate(note)}</div>
                    </div>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption expandable onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(note);
                    }} className="remove-item">
                      <img src="/assets/images/trashcan.png" alt="delete" />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </>
          ) : (
            <div className="no-items">Nothing to see here...</div>
          )}
          <IonItem lines="none" className="header">
            <div className="header">
              Read
            </div>
          </IonItem>
          {readNotifications.length ? (
            <>
              {readNotifications.map((note, index) => (
                <IonItemSliding className="notification-container" key={index}>
                  <IonItem lines="none" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    select(note);
                  }}>
                    <div className="notification">
                      <div className="image" style={{ backgroundImage: getImage(note) }}></div>
                      <div className="text" dangerouslySetInnerHTML={{ __html: getText(note) }}></div>
                      <div className="date">{getDate(note)}</div>
                    </div>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption expandable onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(note);
                    }} className="remove-item">
                      <IonIcon icon={trashOutline} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </>
          ) : (
            <div className="no-items">Nothing to see here...</div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
