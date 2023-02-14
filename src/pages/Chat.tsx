import { useState } from 'react';
import { useHistory } from "react-router-dom";
import {
  IonButtons,
  IonContent,
  IonIcon,
  IonHeader,
  IonPage,
  IonToolbar,
  IonAvatar,
  IonTextarea,
  IonButton,
  useIonViewWillEnter,
  useIonViewDidLeave,
  IonText,
} from '@ionic/react';
import './Chat.scss';
import { closeCircleOutline, chevronBackOutline } from "ionicons/icons";
import { MessagingService } from "../services/MessagingService";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import { viewUser } from '../util';
import ImageZoom from '../components/ImageZoom';
import { NotificationService } from "../services/NotificationService";

const NEW_SECTION_PIVOT_SECONDS = 3600;

const Chat: React.FC = () => {
  const messagingService = new MessagingService();
  const userService = new UserService();
  const authService = new AuthService();
  const notificationService = new NotificationService();
  const history = useHistory();
  const [text, setText] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  let [messages, setMessages] = useState<any[]>([]);
  let [nextToken, setNextToken] = useState<string>('');
  const [usersMap, setUsersMap] = useState<any>({});
  const [me, setMe] = useState<any>({});
  const [them, setThem] = useState<any>([]);
  const [now, setNow] = useState<Date>(new Date());
  let [imageUrl, setImageUrl] = useState<string>('');
  let [imageMimeType, setImageMimeType] = useState<string>('');
  const [zoomImageUrl, setZoomImageUrl] = useState<string>('');

  const convoId = getConvoId();
  let timerInterval: any = null;
  let subscription: any = null;

  let atBottomOfListElem: HTMLElement | null;
  let atTopOfListElem: HTMLElement | null;
  let containerListElem: HTMLElement | null;

  //console.log("Chat: ", convoId);

  useIonViewWillEnter(() => {
    // load in parallel
    reset();

    Promise.all([
      loadUsers(),
      getMessages(),
    ]).then(() => {
      scrollToBottom();
    });

    if (!timerInterval) {
      timerInterval = setInterval(() => {
        setNow(new Date());
      }, 60000);
    }

    if (!atBottomOfListElem) {
      atBottomOfListElem = document.querySelector('#bottomOfList');
    }
    if (!atTopOfListElem) {
      atTopOfListElem = document.querySelector('#topOfList');
    }
    if (!containerListElem) {
      containerListElem = document.querySelector('.chat-page-content');
    }
    //console.log('**', atBottomOfListElem, atTopOfListElem, containerListElem);

    setText('');
    setIsEmpty(true);
    setImageUrl('');
    setImageMimeType('');
  });

  useIonViewDidLeave(() => {
    console.log('useIonViewDidLeave');
    reset();
  });

  function reset() {
    //console.log('reset');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }

    setText('');
    setIsEmpty(true);
    setImageUrl('');
    setImageMimeType('');
  }

  function isVisible(elem: HTMLElement) {
    if (!containerListElem) {
      containerListElem = document.querySelector('.chat-page-content');
    }
    if (elem && containerListElem) {
      const elemBounds = elem.getBoundingClientRect();
      const parentBounds = containerListElem.getBoundingClientRect();
      const isVisible = (elemBounds.top >= parentBounds.top && elemBounds.top < parentBounds.bottom);
      return isVisible;
    }
    console.warn('Unknown elem or containerListElem!');
    return false;
  }

  function isAtTop() {
    if (!atTopOfListElem) {
      atTopOfListElem = document.querySelector('#topOfList');
    }
    if (atTopOfListElem) {
      return isVisible(atTopOfListElem);
    }
    console.warn('Cannot find atTopOfListElem!');
    return false;
  }

  function isAtBottom() {
    if (!atBottomOfListElem) {
      atBottomOfListElem = document.querySelector('#bottomOfList');
    }
    if (atBottomOfListElem) {
      return isVisible(atBottomOfListElem);
    }
    console.warn('Cannot find atBottomOfListElem!');
    return false;
  }

  function scroll(e: any) {
    //console.log('scroll', e);
    if (!!nextToken && isAtTop()) {
      //console.log('scroll:isAtTop = true')
      getMessages();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      console.log('scrollToBottom');
      if (atBottomOfListElem) {
        atBottomOfListElem.scrollIntoView();
      }
    }, 50);
  }

  function loadUsers() {
    return new Promise((resolve, reject) => {
      console.log('Chat.loadUsers()', convoId, nextToken);
      const myUserId = authService.getUserID();
      messagingService.getConversation(convoId)
        .then(convo => {
          //console.log('convo', convo);
          if (!convo) {
            resolve(null);
            return;
          }

          const userIds = JSON.parse(convo.userIds);
          const promises = userIds.map((id: string) => userService.getProfile(+id));
          //console.log('promises', promises);
          Promise.all(promises)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(users => {
              //console.log('users', users);
              const usersMap: any = {};
              const themList = [];
              for (const user of users) {
                //console.log('user', user);
                const u = {
                  user_id: user.user_id,
                  user_type: user.user_type.String,
                  first_name: user.basic_user_profile.first_name.String,
                  last_name: user.basic_user_profile.last_name.String,
                  profile_image: user.basic_user_profile.profile_image.String,
                  is_premiium: user.is_premium?.String === "true",
                };
                usersMap[u.user_id] = u;

                if (u.user_id === myUserId) {
                  setMe(u);
                  //console.log('me', u);
                } else {
                  themList.push(u);
                }
              }
              //console.log('usersMap', usersMap);
              //console.log('them', themList);
              setUsersMap(usersMap);
              setThem(themList);
              //console.log('~loadUsers');
              resolve(null);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  async function getMessages() {
    console.log('Chat.getMessages()', convoId, nextToken);
    const ret = await messagingService.getMessages(convoId, nextToken);

    const newMsgs = parseMessages((ret.items || []), [], messages);
    //console.log('newMsgs', newMsgs);
    messages = newMsgs;
    setMessages(newMsgs);

    if (messages.length) {
      const lastMessage = messages[messages.length - 1];
      messagingService.markConversationRead(convoId, lastMessage.createdAt.getTime() / 1000);
    }

    nextToken = ret.nextToken;
    setNextToken(ret.nextToken);

    if (!subscription) {
      subscription = messagingService.getNewMessages(convoId).subscribe((message: any) => {
        const scroll = isAtBottom();
        //console.log('onNewMessage', message, messages);
        const newMsgs = parseMessages(messages, [message]);
        //console.log('newMsgs', newMsgs);
        messages = newMsgs;
        setMessages(newMsgs);

        messagingService.markConversationRead(convoId, message.createdAt.getTime() / 1000);

        if (scroll) {
          scrollToBottom();
        }
      });
    }

    //console.log('~getMessages()');
    return null;
  }

  function parseMessages(messages: any[], newerMessages: any[] = [], olderMessages: any[] = []) {
    //console.log('parseMessages', messages, newerMessages, olderMessages);
    let msgs = olderMessages.concat(messages).concat(newerMessages);
    //console.log('msgs', msgs);
    for (const msg of msgs) {
      msg.createdAt = getDate(msg.createdAt);
    }

    msgs.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    let prev = null;
    for (const msg of msgs) {
      msg.previousUserId = prev?.userId;
      msg.previousCreatedAt = getDate(prev?.createdAt);

      if (msg.previousCreatedAt) {
        const diff = Math.abs(msg.createdAt.getTime() - msg.previousCreatedAt.getTime());
        msg.newSection = (diff > NEW_SECTION_PIVOT_SECONDS * 1000);
      } else {
        msg.newSection = true;
      }
      prev = msg;
    }

    return msgs;
  }

  function getConvoId() {
    const parts = history.location.pathname.split('/');
    const convoid = parts[parts.length - 1];
    return convoid;
  }

  async function send() {
    console.log('Chat.send()', convoId, text, imageUrl, imageMimeType);
    try {
      /*const res =*/ await messagingService.createMessage(convoId, text.trim(), imageUrl, imageMimeType);
      //console.log('createMessage:res =', res);

      notificationService
        .SendNotification(me.user_id, them[0].user_id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })

      setText('');
      setIsEmpty(true);
      setImageUrl('');
      setImageMimeType('');
    } catch (e) {
      console.error('Error sending chat message:', e);
    }
  }

  async function attach(e: any) {
    console.log('Chat.attach()', e);

    if (!e?.target?.files?.length) {
      return;
    }

    const file = e.target.files[0];
    //console.log('attach:file', file);
    const res: any = await messagingService.uploadFile(convoId, file);
    //console.log('attach:res', res);
    const resJson: any = await res.json();
    //console.log('attach:resJson', resJson);

    imageUrl = resJson.photo_url;
    setImageUrl(imageUrl);
    imageMimeType = file.type;
    setImageMimeType(imageMimeType);
  }

  function getDate(val: any) {
    //console.log('getDate', val, typeof val);
    if (!val) {
      return null;
    }

    let dt = null;
    if (typeof val === 'number') {
      if (val > 2082715199) { // 12/31/2035; just a way to determine if it's milliseconds or seconds
        dt = new Date(val);
      } else {
        dt = new Date(val * 1000);
      }
    } else if (typeof val === 'string') {
      dt = new Date(val);
    } else {
      dt = val;
    }
    return dt;
  }

  function formatDate(val: any, previousVal?: any) {
    const dt = getDate(val);
    const prevDt = getDate(previousVal);
    //console.log('formatDate', val, dt, previousVal, prevDt);
    if (!dt) {
      return '';
    }

    // if messages are within 15 seconds of each other, don't show the date
    if (prevDt) {
      const prevDiff = Math.abs(dt.getTime() - prevDt.getTime());
      if (prevDiff < NEW_SECTION_PIVOT_SECONDS * 1000) {
        return '';
      }
    }

    const diff = Math.abs((now.getTime() - dt.getTime()) / 1000);
    const diffMinutes = Math.round(diff / 60);
    //console.log('**', dt, now, diff, diffMinutes);
    if (diffMinutes < 60) {
      return formatDistance(dt, now, { addSuffix: true });
    }

    if (now.getDay() === dt.getDay()) {
      return 'Today at ' + format(dt, 'h:mm a');
    }

    return format(dt, 'P') + ' at ' + format(dt, 'h:mm a');
  }

  function getClassName(msg: any, isImage?: boolean) {
    const classNames = ['message-container'];
    classNames.push(msg.userId === me.user_id ? 'mine' : 'theirs');
    if (msg.userId === msg.previousUserId && !msg.newSection) {
      classNames.push('continue');
    } else if (!isImage && msg.fileUrl) {
      classNames.push('continue');
    }
    if (isImage) {
      classNames.push('image');
    }
    return classNames.join(' ');
  }

  function getUserName() {
    if (them.length === 0) {
      return '';
    }

    if (them.length === 1) {
      const user = them[0];
      return `${user.first_name} ${user.last_name}`;
    }

    const names = them.map((user: any) => {
      return user.first_name;
    });
    const finalName = names.pop();
    return `${names.join(', ')} & ${finalName}`;
  }

  return (
    <IonPage className="chat-page">
      <ImageZoom show={!!zoomImageUrl} imageUrl={zoomImageUrl} onClose={() => setZoomImageUrl('')} />
      <IonHeader>
        <IonToolbar
          style={{
            padding: "40px 10px 10px 10px",
          }}
        >
          <IonButtons slot="start">
            <IonIcon
              slot="icon-only"
              icon={chevronBackOutline}
              onClick={() => {
                history.goBack();
              }}
            />
            <IonText className="header-names">
              {them.length <= 1 ? (
                <IonAvatar className="avatar" onClick={(e) => {
                  e.preventDefault();
                  viewUser(history, them[0].userId, them[0].userType);
                }}>
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = '../../assets/images/urp_logo_round.svg';
                    }}
                    src={them[0]?.profile_image}
                    alt="avatar"
                  />
                </IonAvatar>
              ) : (
                <div className="group-avatar">
                  <div>
                    +{them.length}
                  </div>
                </div>
              )}
              <div className="names">
                {getUserName()}
              </div>
            </IonText>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="chat-page-content" scrollY={true} scrollEvents={true} onIonScrollEnd={(e) => scroll(e)}>
        {!!nextToken ? (
          <div id="topOfList">Loading...</div>
        ) : ''}
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.newSection ? (
              <div className="section-header">
                <div className="section-text">{formatDate(msg.createdAt)}</div>
              </div>
            ) : ''}
            {msg.fileUrl ? (
              <div className={getClassName(msg, true)}>
                <IonAvatar className="avatar">
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = '../../assets/images/urp_logo_round.svg';
                    }}
                    src={usersMap[msg.userId]?.profile_image}
                    alt="avatar"
                  />
                </IonAvatar>
                <div className="message-content"
                  onClick={(e) => {
                    e.preventDefault();
                    setZoomImageUrl(msg.fileUrl);
                  }}
                >
                  <div className="text"><img src={msg.fileUrl} alt="chat" /></div>
                  <div className="date">{formatDate(msg.createdAt, msg.userId === msg.previousUserId ? msg.previousCreatedAt : null)}</div>
                </div>
              </div>
            ) : ''}
            {msg.text ? (
              <div className={getClassName(msg)}>
                <IonAvatar className="avatar">
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = '../../assets/images/urp_logo_round.svg';
                    }}
                    src={usersMap[msg.userId]?.profile_image}
                    alt="avatar"
                  />
                </IonAvatar>
                <div className="message-content">
                  <div className="text" dangerouslySetInnerHTML={{ __html: (msg.text || '').replace(/\n/g, '<br/>') }}></div>
                  <div className="date">{formatDate(msg.createdAt, msg.userId === msg.previousUserId ? msg.previousCreatedAt : null)}</div>
                </div>
              </div>
            ) : ''}
          </div>
        ))}
        <div id="bottomOfList"></div>
      </IonContent>
      <div className="chat-footer">
        <div className="left">
          <div className="add-file-container">
            <input
              type="file"
              className={isEmpty ? '' : 'disabled'}
              disabled={!!imageUrl}
              accept="image/*"
              onChange={(e) => attach(e)}
            />
            <IonIcon
              className={'chat-footer-add ' + (!imageUrl ? '' : 'disabled')}
              src="assets/images/chat-add.svg"
            ></IonIcon>
          </div>
        </div>
        <div className="right">
          {imageUrl ? (
            <div className="image-container">
              <div className="image">
                <IonIcon icon={closeCircleOutline} onClick={(e) => {
                  console.log('*3');
                  setImageUrl('');
                  setImageMimeType('');
                }}></IonIcon>
                <img src={imageUrl} alt="chat" />
              </div>
            </div>
          ) : ''}
          <div className="input-container">
            <IonTextarea
              autoGrow={true}
              autocapitalize="sentences"
              enterkeyhint="enter"
              placeholder="Start typing..."
              rows={1}
              debounce={50}
              value={text}
              onIonChange={(e) => {
                const val = e.detail.value || '';
                setText(val);
                setIsEmpty(val.trim().length === 0)
              }}>
              <IonButton
                disabled={isEmpty && !imageUrl}
                onClick={(e) => {
                  e.preventDefault();
                  send();
                }}>
                Send
              </IonButton>
            </IonTextarea>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Chat;
