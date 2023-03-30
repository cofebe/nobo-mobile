import { useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonTextarea,
  IonButton,
  useIonViewWillEnter,
  useIonViewDidLeave,
} from '@ionic/react';
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';
import './Chat.scss';
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import {
  Message,
  MessageUser,
  Conversation,
  Product,
} from '../models';
import { getImageUrl, formatPrice, getMinTradeFee, getMaxTradeFee } from '../utils';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import Header from '../components/Header';

const NEW_SECTION_PIVOT_SECONDS = 3600;

const Chat: React.FC = () => {
  const params: any = useParams();
  const history = useHistory();
  const userService = new UserService();
  const authService = new AuthService();
  const [text, setText] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [me, setMe] = useState<MessageUser>();
  const [them, setThem] = useState<MessageUser>();
  const [now, setNow] = useState<Date>(new Date());
  const [product, setProduct] = useState<Product>();
  const [showNext, setShowNext] = useState<boolean>(false);
  const [showPrevious, setShowPrevious] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<string>('');
  const [image1, setImage1] = useState<string>();
  const [image2, setImage2] = useState<string>();
  const [imageIndex, setImageIndex] = useState<number>(0);

  let timerInterval: any = null;

  let atBottomOfListElem: HTMLElement | null;

  //console.log("Chat: ", convoId);

  useIonViewWillEnter(() => {
    reset();

    userService.getConversation(params.id).then(convo => {
      setConversation(convo);
      if (convo) {
        setMessages(parseMessages(convo.messages));
        const userId = authService.getUserId();
        setMe(convo.initiator._id === userId ? convo.initiator : convo.recipient);
        setThem(convo.initiator._id === userId ? convo.recipient : convo.initiator);

        if (convo.product) {
          setProduct(convo.product);

          setImageSource(convo.product.images[0].url);
          setShowPrevious(false);
          setShowNext(convo.product.images.length > 2);
          setImageIndex(0);
          setImage1(convo.product.images[0].url);
          setImage2(
            convo.product.images.length > 1 ? convo.product.images[1].url : ''
         );
        }
      }
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
    //console.log('**', atBottomOfListElem, atTopOfListElem, containerListElem);

    setText('');
    setIsEmpty(true);
  });

  function parseMessages(messages: Message[]) {
    for (const msg of messages) {
      msg.date = new Date(msg.createdAt);
    }

    messages.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    let prev = null;
    for (const msg of messages) {
      msg.previousUserId = prev?.from._id;
      msg.previousCreatedAt = getDate(prev?.createdAt);

      if (msg.previousCreatedAt) {
        const diff = Math.abs(msg.date.getTime() - msg.previousCreatedAt.getTime());
        msg.newSection = (diff > NEW_SECTION_PIVOT_SECONDS * 1000);
      } else {
        msg.newSection = true;
      }
      prev = msg;
    }

    return messages;
  }

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

    setText('');
    setIsEmpty(true);
  }

  function scrollToBottom() {
    setTimeout(() => {
      console.log('scrollToBottom', atBottomOfListElem);
      if (atBottomOfListElem) {
        atBottomOfListElem.scrollIntoView();
      }
    }, 50);
  }

  function updateImages(index: number) {
    setImageIndex(index);
    if (product) {
      setImage1(product.images[index].url);
      setImage2(product.images[index + 1].url);
      setShowPrevious(index > 0);
      setShowNext(product.images.length > index + 2);
    }
  }

  function previousImage() {
    if (imageIndex > 0) {
      updateImages(imageIndex - 1);
    }
  }

  function nextImage() {
    if (product) {
      if (imageIndex < product.images.length - 2) {
        updateImages(imageIndex + 1);
      }
    }
  }

  function fixMessages(msgs: Message[]) {
    for (const msg of msgs) {
      if (typeof(msg.from) === 'string') {
        const from: MessageUser = (msg.from === me?._id ? me : them)!;
        msg.from = from;
      }
    }
    return msgs;
  }

  async function send() {
    console.log('Chat.send()', params.id, text);
    try {
      const convo = await userService.sendReply(params.id, text);
      setConversation(convo);
      const msgs = fixMessages(convo.messages);
      setMessages(parseMessages(msgs));
      setText('');
      setIsEmpty(true);
      scrollToBottom();
    } catch (e) {
      console.error('Error sending chat message:', e);
    }
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

    return format(dt, 'LLL d') + ', ' + format(dt, 'h:mm a');
  }

  function getClassName(msg: Message, isImage?: boolean) {
    const classNames = ['message-container'];
    classNames.push(msg.from._id === me?._id ? 'mine' : 'theirs');
    if (msg.from._id === msg.previousUserId && !msg.newSection) {
      classNames.push('continue');
    }
    if (isImage) {
      classNames.push('image');
    }
    return classNames.join(' ');
  }

  function getName(user: MessageUser|undefined) {
    return `${user?.firstName} ${user?.lastName}`;
  }

  return (
    <IonPage className="chat-page">
      <Header border={false} title="">
        <div className="titles" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (them) {
            history.push(`/home/profile/${them._id}`);
          }
        }}>
          <IonAvatar>
            <img src={them?.avatar} alt="avatar" />
          </IonAvatar>
          <div className="title">
            {getName(them)}
          </div>
        </div>
      </Header>
      <IonContent className="chat-page-content" scrollY={true}>
        {messages.map((msg, index) => (
          <div key={msg._id}>
            {msg.newSection && (
              <div className="section-header">
                <div className="section-text">{formatDate(msg.createdAt)}</div>
              </div>
            )}
            {index === 0 && product && (
              <IonGrid className="product-details-card">
                <IonRow className="product-images-row">
                  <IonCol size="3" className="product-images">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        previousImage();
                      }}
                      className={
                        'scroller ' + (showPrevious ? 'enabled' : 'disabled')
                      }
                    >
                      <IonIcon icon={caretUpOutline} />
                    </div>

                    {image1 ? (
                      <div
                        style={{ backgroundImage: getImageUrl(image1) }}
                        className="img"
                        onClick={(e) => {
                          setImageSource(image1);
                        }}
                      ></div>
                    ) : (
                      ''
                    )}
                    {image2 ? (
                      <div
                        style={{ backgroundImage: getImageUrl(image2) }}
                        className="img"
                        onClick={(e) => {
                          setImageSource(image2);
                        }}
                      ></div>
                    ) : (
                      ''
                    )}

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextImage();
                      }}
                      className={'scroller ' + (showNext ? 'enabled' : 'disabled')}
                    >
                      <IonIcon icon={caretDownOutline} />
                    </div>
                  </IonCol>
                  <IonCol size="6" className="product-large">
                    <div
                      style={{ backgroundImage: getImageUrl(imageSource) }}
                      className="img"
                    ></div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="product-brand">{product.brand}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="product-name">{product.name}</IonCol>
                </IonRow>
                <IonRow>
                  {product.action === 'trade' ? (
                    <IonCol className="product-price">
                      <span>Est. Price</span>{' '}
                      {formatPrice(getMinTradeFee(product.price))} -{' '}
                      {formatPrice(getMaxTradeFee(product.price))}
                    </IonCol>
                  ) : (
                    <IonCol className="product-price">
                      <span>Cost</span> {formatPrice(product.price)}
                    </IonCol>
                  )}
                </IonRow>
              </IonGrid>
            )}
            <div className={getClassName(msg)}>
              <IonAvatar className="avatar">
                <img src={msg.from.avatar} alt="avatar" />
              </IonAvatar>
              <div className="message-content">
                <div className="text" dangerouslySetInnerHTML={{ __html: (msg.message || '').replace(/\n/g, '<br/>') }}></div>
                {/*<div className="date">{formatDate(msg.createdAt, msg.userId === msg.previousUserId ? msg.previousCreatedAt : null)}</div>*/}
              </div>
            </div>
          </div>
        ))}
        <div id="bottomOfList"></div>
      </IonContent>
      <div className="chat-footer">
        <div className="right">
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
                disabled={isEmpty}
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
