import { useState, useEffect, forwardRef } from 'react';
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonButton,
  IonInput,
  IonIcon,
  IonToolbar,
  IonModal,
  IonCheckbox,
  useIonViewWillEnter,
} from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import './CreateConversationModal.scss';
import { ConnectionService } from '../services/ConnectionService';
import { MessagingService } from '../services/MessagingService';
import { UserService } from '../services/UserService';

export interface CreateConversationModalProps {
  onCancel?: () => void;
  onOpen?: (convoId: string) => void;
}

export type Ref = HTMLIonModalElement;

const CreateConversationModal = forwardRef<Ref, CreateConversationModalProps>(
  ({ onCancel, onOpen }, ref) => {
    const messagingService = new MessagingService();
    const connectionService = new ConnectionService();
    const userService = new UserService();

    const [selectedUserIds, setSelectedUserIds] = useState<{ [key: number]: boolean }>({});
    const [filter, setFilter] = useState<string>('');
    const [connections, setConnections] = useState<any[]>([]);
    const [isValid, setIsValid] = useState<boolean>(false);

    useIonViewWillEnter(() => {
      reset();
    });

    useEffect(() => {
      reset();

      connectionService
        .getConnections()
        .then(res => res.json())
        .then(data => {
          setConnections(data);
        });
    }, []);

    function reset() {
      setFilter('');
      setSelectedUserIds({});
      setIsValid(false);
    }

    function toggle(userId: number) {
      selectedUserIds[userId] = !selectedUserIds[userId];
      setSelectedUserIds(selectedUserIds);
      setIsValid(Object.values(selectedUserIds).filter(v => v).length > 0);
    }

    async function createConversation() {
      console.log('createConversation()', selectedUserIds);

      const userIds = Object.keys(selectedUserIds).reduce((prev: number[], key: string) => {
        if (selectedUserIds[+key]) {
          prev.push(+key);
        }
        return prev;
      }, []);
      console.log('userIds', userIds);

      const convo = await messagingService.getOrCreateConversation(userIds);
      console.log('convo', convo);

      reset();
      if (onOpen) {
        onOpen(convo.id);
      }
    }

    return (
      <IonModal
        className="create-conversation-container"
        ref={ref}
        backdropDismiss={false}
        swipeToClose={false}
      >
        <IonHeader className="create-conversation-header">
          <IonToolbar className="create-conversation-header-toolbar">
            <IonGrid style={{ backgroundColor: 'white' }}>
              <IonRow>
                <IonCol size="12">
                  <IonItem lines="none">
                    <IonButton
                      buttonType=""
                      color="#9BC9C1"
                      fill="clear"
                      className="cancel-btn"
                      size="large"
                      slot="start"
                      onClick={e => {
                        e.preventDefault();
                        reset();
                        if (onCancel) {
                          onCancel();
                        }
                      }}
                    >
                      Cancel
                    </IonButton>
                    <IonButton
                      buttonType=""
                      className="create-conversation-btn"
                      size="large"
                      disabled={!isValid}
                      slot="end"
                      onClick={e => {
                        e.preventDefault();
                        createConversation();
                      }}
                    >
                      Chat
                    </IonButton>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonContent className="create-conversation-content" scrollY={true}>
          <IonItem className="search-item">
            <IonRow className="search-container">
              <IonCol size="9" className="search-col">
                <IonIcon icon={searchOutline} />
                <IonInput
                  className="search"
                  placeholder="Search"
                  value={filter}
                  onIonChange={(e: any) => setFilter(e.target.value?.toLowerCase())}
                />
              </IonCol>
            </IonRow>
          </IonItem>
          <IonList>
            {connections
              .filter(
                conn =>
                  `${conn.first_name} ${conn.last_name}`.toLowerCase().includes(filter) ||
                  (conn.school || '').toLowerCase().includes(filter) ||
                  (conn.primary_position || '').toLowerCase().includes(filter)
              )
              .map(conn => (
                <IonItem key={conn.id} className="connection-item" lines="none">
                  <IonRow>
                    <IonCol>
                      <div className="connection-container">
                        <IonAvatar>
                          <img
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = '../../assets/images/nobo_logo_round.svg';
                            }}
                            src={conn.profile_image}
                            alt="avatar"
                          />
                        </IonAvatar>
                        <div className="name-text">
                          <div className="position-school">&nbsp;</div>
                          <div className="name">
                            {conn.first_name} {conn.last_name}
                          </div>
                          <div className="position-school">
                            {conn.primary_position} {conn.school}
                          </div>
                        </div>
                        <div className="check">
                          <IonCheckbox
                            onClick={e => {
                              e.preventDefault();
                              toggle(conn.user_id);
                            }}
                            checked={selectedUserIds[conn.user_id]}
                          />
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonItem>
              ))}
          </IonList>
        </IonContent>
      </IonModal>
    );
  }
);

export default CreateConversationModal;
