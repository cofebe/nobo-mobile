import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonAvatar,
  useIonViewWillEnter,
} from '@ionic/react';
import './Conversations.scss';
import Header from '../components/Header';
import { Conversation } from '../models';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { formatAge } from '../utils';

const Conversations: React.FC = () => {
  const userService = new UserService();
  const authService = new AuthService();
  const history = useHistory();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useIonViewWillEnter(async () => {
    console.log('Conversations.useIonViewWillEnter');

    userService.getMyConversations().then(conversations => {
      setConversations(conversations);
    });
  });

  function getOtherUser(c: Conversation) {
    return (c.recipient._id === authService.getUserId() ? c.initiator : c.recipient);
  }

  function getName(c: Conversation) {
    const user = getOtherUser(c);
    return `${user.firstName} ${user.lastName}`;
  }

  function getAvatar(c: Conversation) {
    const user = getOtherUser(c);
    return user.avatar;
  }

  function isUnread(c: Conversation) {
    const lastMessage = c.messages[c.messages.length - 1];
    if (lastMessage.from._id === authService.getUserId()) {
      return false;
    }
    return !lastMessage.receiverDidRead;
  }

  function formatDate(c: Conversation) {
    const lastMessage = c.messages[c.messages.length - 1];
    const dt = new Date(lastMessage.createdAt);
    return formatAge(dt);
  }

  function getText(c: Conversation) {
    const lastMessage = c.messages[c.messages.length - 1];
    return lastMessage.message;
  }

  return (
    <IonPage className="messaging-page">
      <Header title="Conversations" border={false} />
      {conversations.length > 0 ? (
        <IonContent scrollY={true} className="messaging-content">
          <IonList>
            {conversations.map((c) => (
              <IonItem
                key={c._id}
                className="messaging-item"
                lines="none"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/chat/${c._id}`);
                }}
              >
                <IonRow>
                  <IonCol>
                    <IonAvatar>
                      <img src={getAvatar(c)} alt="avatar" />
                    </IonAvatar>
                    <div className="name-text-date-unread">
                      <div className="name-unread">
                        <div className="name">{getName(c)}</div>
                        <div className="unread">
                          {isUnread(c) && (
                            <div className="unread-dot"></div>
                          )}
                        </div>
                      </div>
                      <div className="text-date">
                        <div
                          className={'text ' + (isUnread(c) ? 'unread' : '')}
                        >
                          {getText(c)}
                        </div>
                        <div className="date">
                          {formatDate(c)}
                        </div>
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      ) : (
        <IonContent scrollY={false}>
          <IonRow>
            {conversations.length < 1 && (
              <IonCol class="ion-text-center">
                <img
                  className="logo-image logo-image-margin"
                  src="assets/images/nobo_logo_round.svg"
                  width="150"
                  height="150"
                  alt="logo"
                />
                <div className="nobo-sub-header">No messages.</div>
              </IonCol>
            )}
          </IonRow>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Conversations;
