import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonIcon,
  IonRow,
  IonCol,
  IonAvatar,
  IonInput,
  useIonViewWillEnter,
  useIonViewDidLeave,
  useIonLoading,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { searchOutline } from 'ionicons/icons';
import '../styles.scss';
import './Messages.scss';
import { Profile } from '../data/profile';
// import UrpHeader from '../components/NoboHeader';
import CreateConversationModal from '../components/CreateConversationModal';
import { MessagingService } from '../services/MessagingService';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import format from 'date-fns/format';
import sub from 'date-fns/sub';
import isSameDay from 'date-fns/isSameDay';
import isYesterday from 'date-fns/isYesterday';
import { loadingOptions } from '../util';

const Messages: React.FC = () => {
  const messagingService = new MessagingService();
  const userService = new UserService();
  const authService = new AuthService();
  const history = useHistory();
  let [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  let [filter, setFilter] = useState<string>('');

  let [conversations, setConversations] = useState<any[]>([]);
  const [users, setUsers] = useState<any>({});

  const modal = useRef<HTMLIonModalElement>(null);

  let subscriptions: any = {};

  const [watchlistOnly, setWatchListOnly] = useState<boolean>(false);
  const [messages, setMessages] = useState<Profile[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  let storage: any = window.localStorage.getItem('persistedState');
  let user = JSON.parse(storage);

  useIonViewWillEnter(async () => {
    console.log('Messages.useIonViewWillEnter');
    setWatchListOnly(false);
    await loadConversations();

    if (!subscriptions._) {
      subscriptions._ = messagingService
        .getConversationCreates()
        .subscribe(() => {
          loadConversations();
        });
    }

    let watchListItems: any = [];
    userService
      .getWatchlist(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        console.log('Profile: ', data);
        for (let i = 0, il = data.length; i < il; i++) {
          watchListItems.push(data[i].profile);
          console.log('This is the data ', data[i]);
          console.log('This is the notes ', data[i].notes);
          let notesCopy = [...notes];
          notesCopy.push(data[i].notes);
          setNotes(notesCopy);
        }
        console.log('Watchlist: ', watchListItems);
        setMessages(watchListItems);
      });
  });

  useIonViewDidLeave(() => {
    console.log('Messages.useIonViewDidLeave');
    unsubscribe();
  });

  function unsubscribe() {
    console.log('unsubscrtibe');
    for (const key of Object.keys(subscriptions)) {
      subscriptions[key].unsubscribe();
      subscriptions[key] = undefined;
    }
  }

  async function loadConversations() {
    isLoading = true;
    setIsLoading(isLoading);
    presentLoading(loadingOptions);
    try {
      const myUserId = authService.getUserId();
      const convos = await messagingService.getConversations();
      console.log('convos', convos);

      const userIdsMap: any = {};
      for (const convo of convos) {
        convo.userIds = JSON.parse(convo.userIds)
          .map((u: any) => +u)
          .filter((u: any) => u !== myUserId);
        convo.lastMessageCreatedAt = convo.lastMessageCreatedAt
          ? new Date(convo.lastMessageCreatedAt * 1000)
          : null;
        convo.lastReadAt = convo.lastReadAt
          ? new Date(convo.lastReadAt * 1000)
          : null;

        for (const userId of convo.userIds) {
          userIdsMap[userId] = userId;
        }
      }
      //console.log('userIdsMap', userIdsMap);
      convos.sort((a: any, b: any) => {
        if (!b.lastMessageCreatedAt && !a.lastMessageCreatedAt) {
          return 0;
        }
        if (b.lastMessageCreatedAt && !a.lastMessageCreatedAt) {
          return 1;
        }
        if (a.lastMessageCreatedAt && !b.lastMessageCreatedAt) {
          return -1;
        }

        return (
          b.lastMessageCreatedAt.getTime() - a.lastMessageCreatedAt.getTime()
        );
      });

      const promises = Object.keys(userIdsMap).map((userId) =>
        userService.getProfile(+userId)
      );
      Promise.all(promises)
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((users) => {
          //console.log('promises:users', users);
          const usersMap: any = {};
          for (const user of users) {
            usersMap[user.user_id] = {
              id: user.user_id,
              firstName: user.basic_user_profile?.first_name?.String,
              lastName: user.basic_user_profile?.last_name?.String,
              profileImage: user.basic_user_profile?.profile_image?.String,
            };
          }
          console.log('usersMap', usersMap);
          setUsers(usersMap);
          conversations = convos;
          setConversations(convos);

          for (const convo of conversations) {
            if (!subscriptions[convo.id]) {
              subscriptions[convo.id] = messagingService
                .getConversationUpdates(convo.id)
                .subscribe(() => {
                  loadConversations();
                });
            }
          }

          isLoading = false;
          setIsLoading(isLoading);
          dismissLoading();
        })
        .catch((err) => {
          console.error('getProfile:err =', err);

          isLoading = false;
          setIsLoading(isLoading);
          dismissLoading();
        });
    } catch (err) {
      console.error('getConversations:err =', err);

      isLoading = false;
      setIsLoading(isLoading);
      dismissLoading();
    }
  }

  function getUserAvatar(convo: any) {
    const userId = convo.userIds[0];
    const user = users[userId];
    return user.profileImage;
  }

  function getUserName(convo: any) {
    if (convo.userIds.length === 1) {
      const userId = convo.userIds[0];
      const user = users[userId];
      return `${user.firstName} ${user.lastName}`;
    }

    const names = convo.userIds.map((userId: any) => {
      const user = users[userId];
      return user.firstName;
    });
    const finalName = names.pop();
    return `${names.join(', ')} & ${finalName}`;
  }

  function isUnread(convo: any) {
    return convo.lastMessageCreatedAt > convo.lastReadAt;
  }

  function formatDate(dt: any) {
    //console.log('formatDate', val, dt);
    if (!dt) {
      return '';
    }

    const now = new Date();

    if (isSameDay(dt, now)) {
      return format(dt, 'h:mm a');
    }
    if (isYesterday(dt)) {
      return 'Yesterday';
    }
    for (let i = 2; i < 7; i++) {
      const dt2 = sub(now, { days: i });
      if (isSameDay(dt, dt2)) {
        return format(dt, 'EEEE');
      }
    }

    return format(dt, 'P');
  }

  function getText(convo: any) {
    return convo.lastMessageText;
  }

  function sortWatchlist(sort: boolean) {
    if (sort) {
      let watchlistUserId: number[] = [];
      messages.map((val) => {
        watchlistUserId.push(val.user_id);
      });

      let watchlistConversations = conversations.filter((c) => {
        return watchlistUserId.includes(c.userIds[0]);
      });

      setConversations(watchlistConversations);
    } else {
      loadConversations();
    }
  }

  return (
    <IonPage className="messaging-page">
      {/* <UrpHeader></UrpHeader> */}
      {conversations.length > 0 ? (
        <IonContent scrollY={true} className="messaging-content">
          {messages.length > 0 && (
            <IonRow className="filter-container">
              <SwiperSlide
                onClick={() => {
                  setWatchListOnly(!watchlistOnly);
                  sortWatchlist(!watchlistOnly);
                }}
                className={'noselect explore-sports-slide'}
                key="Watchlist"
                data-path="Watchlist"
              >
                <span
                  className={
                    'nobo-explore-account-tab-menu-item ' +
                    (watchlistOnly === true ? 'selected' : '')
                  }
                >
                  Watchlist Only
                </span>
              </SwiperSlide>
            </IonRow>
          )}
          <IonItem className="search-item">
            <IonRow className="search-container">
              <IonCol size="9" className="search-col">
                <IonIcon icon={searchOutline} />
                <IonInput
                  className="search"
                  placeholder="Search"
                  value={filter}
                  onIonChange={(e: any) =>
                    setFilter(e.target.value?.toLowerCase())
                  }
                />
              </IonCol>
            </IonRow>
          </IonItem>
          <IonList>
            {conversations
              .filter((c) => !!c.lastMessageCreatedAt)
              .filter(
                (c) =>
                  getUserName(c).toLowerCase().includes(filter) ||
                  getText(c).toLowerCase().includes(filter)
              )
              .map((c) => (
                <IonItem
                  key={c.id}
                  className="messaging-item"
                  lines="none"
                  onClick={(e) => {
                    e.preventDefault();
                    unsubscribe();
                    history.push(`/chat/${c.id}`);
                  }}
                >
                  <IonRow>
                    <IonCol>
                      {c.userIds.length === 1 ? (
                        <IonAvatar>
                          <img
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src =
                                '../../assets/images/nobo_logo_round.svg';
                            }}
                            src={getUserAvatar(c)}
                            alt="avatar"
                          />
                        </IonAvatar>
                      ) : (
                        <div className="group-avatar">
                          <div>+{c.userIds.length}</div>
                        </div>
                      )}
                      <div className="name-text-date-unread">
                        <div className="text-date">&nbsp;</div>
                        <div className="name-unread">
                          <div className="name">{getUserName(c)}</div>
                          <div className="unread">
                            {isUnread(c) ? (
                              <div className="unread-dot"></div>
                            ) : (
                              ''
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
                            {formatDate(c.lastMessageCreatedAt)}
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
            {!isLoading && conversations.length < 1 && (
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

      <img
        onClick={(e) => {
          e.preventDefault();
          modal.current?.present();
        }}
        className="floating-button"
        src="assets/images/create-post.svg"
        alt="new chat"
      />

      <CreateConversationModal
        ref={modal}
        onCancel={() => {
          modal.current?.dismiss();
        }}
        onOpen={(convoId: string) => {
          modal.current?.dismiss();
          if (convoId) {
            unsubscribe();
            history.push(`/chat/${convoId}`);
          }
        }}
      />
    </IonPage>
  );
};

export default Messages;
