import {
  IonItem,
  IonRow,
  IonCol,
  IonAvatar,
  IonIcon,
  useIonActionSheet,
} from '@ionic/react';
import { ellipsisHorizontal, statsChartOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { FeedService } from '../services/FeedService';
import { ReportService } from '../services/ReportService';
import CreateCommentModal from '../components/CreateCommentModal';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
import './FeedListItem.scss';
import './carousel.min.css';
import { getMessagePhotos, viewUser } from '../util';
var Carousel = require('react-responsive-carousel').Carousel;

interface FeedListItemProps {
  message: FeedItem;
  trackImpressions?: boolean;
  disableProfileLink?: boolean;
  zoomAction?: Function;
  refreshFeed?: Function;
}

interface FeedItem {
  likes: any[];
  images: { url: string, originalName: string }[];
  _id: string;
  user: {
    _id: string;
    avatar: string;
    displayName: string;
    tradeCloset: number;
    sellCloset: number;
  };
  template: string;
  feedText: string;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const FeedListItem: React.FC<FeedListItemProps> = ({
  message,
  trackImpressions = false,
  disableProfileLink = false,
  zoomAction,
  refreshFeed,
}) => {
  const history = useHistory();
  const authService = new AuthService();
  const feedService = new FeedService();
  const reportService = new ReportService();
  console.log("Post Detail: ", message)
  // const [commentCount, setCommentCount] = useState<number>(
  //   message.comment_count || 0
  // );
  // const [likeCount, setLikeCount] = useState<number>(message.like_count || 0);
  // const [msgPhotos, setMsgPhotos] = useState(getMessagePhotos(message));

  const [presentActionSheet] = useIonActionSheet();
  const [presentReportingActionSheet] = useIonActionSheet();

  const storage: any = window.localStorage.getItem('persistedState');
  const user = (storage ? JSON.parse(storage) : undefined);
  const [isDeleted, setIsDeleted] = useState<any>(false);

  let myUserId = authService.getUserId();
  let userId = 0;
  if (user) {
    userId = user.user['user_id'];
  }

  const commentModal = useRef<HTMLIonModalElement>(null);

  // const elementId =
  //   'feedItem' + message.post_id + (message.is_promoted ? 'p' : '');

  useEffect(() => {
    // if (message.sport) {
    //   if (message.sport[0] === 'w' || message.sport[0] === 'm') {
    //     message.sport = message.sport.slice(1);
    //   }
    // }

    // setMsgPhotos(getMessagePhotos(message));

    // if (trackImpressions) {
    //   const container = document.querySelector('.home-content');
    //   const elem = document.querySelector('#' + elementId);
    //   if (container && elem) {
    //     const options = {
    //       root: container,
    //       rootMargin: '0px',
    //       threshold: 1.0,
    //     };
    //     const observer = new IntersectionObserver((entries) => {
    //       //console.log('*1', entries, entries[0]);
    //       if (entries.length && entries[0].isIntersecting) {
    //         console.log(`Tracking impression for post ID ${message.post_id}`);
    //         feedService.trackImpression(message.post_id);
    //         observer.unobserve(elem);
    //       }
    //     }, options);
    //     observer.observe(elem);
    //   }
    // }
  }, [message, trackImpressions]);

  function showPostComment() {
    commentModal.current?.present();
  }

  function viewUser_(history: any, userId: number, userType: string) {
    if (!disableProfileLink) {
      // viewUser(history, userId, userType, message.post_id);
    }
  }

  const [postURL, setPostURL] = useState(`https://www.noboplus.com/home/post-detail/${message._id}`);

  var options = {
    message: `Share Post`,
    subject: 'Share Post',
    files: ['', ''],
    url: postURL,
    chooserTitle: 'Pick an app',
    appPackageName: 'com.apple.social.facebook',
    iPadCoordinates: '0,0,0,0',
  };

  const actionSheetButtons = [
    {
      text: 'Report Post',
      who: 'notme',
      role: 'destructive',
      data: {
        action: () => {
          console.log('reportPost');
          showReportingActionSheet();
        },
      },
    },
    {
      text: 'Share Post',
      who: 'all',
      data: {
        action: () => {
          console.log('sharePost');
          SocialSharing.shareWithOptions(options);
        },
      },
    },
    {
      text: 'Delete Post',
      who: 'me',
      role: 'destructive',
      data: {
        action: () => {
          feedService
            .removePost(message._id)
            .then((res) => res.json())
            .then((data) => {
              setIsDeleted(true);
              if (refreshFeed !== undefined) {
                refreshFeed();
              }
            })
            .catch((err) => {
              console.error('Error:', err);
            });
        },
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: () => {}, // noop
      },
    },
  ].filter((b) => {
    return (
      b.who === 'all' ||
      !b.who ||
      (b.who === 'me' && message.user._id === myUserId) ||
      (b.who === 'notme' && message.user._id !== myUserId)
    );
  });

  async function reportPost(reportType: string) {
    console.log('reportPost', reportType);

    window.location.href = `mailto:support@thenobo.com?subject=${reportType}&body=${message.user._id}`;
  }

  function showReportingActionSheet() {
    console.log('showReportingActionSheet');
    presentReportingActionSheet({
      cssClass: 'nobo-action-sheet',
      header: 'Report Post',
      //subHeader: 'Subheader',
      buttons: [
        {
          text: "It's spam",
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost("It's spam");
            }, // noop
          },
        },
        {
          text: 'Nude or sexual activity',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost('Nude or sexual activity');
            }, // noop
          },
        },
        {
          text: 'Hate speech or symbols',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost('Hate speech or symbols');
            }, // noop
          },
        },
        {
          text: 'False Information',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost('False Information');
            }, // noop
          },
        },
        {
          text: "I just don't like it",
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost("I just don't like it");
            }, // noop
          },
        },
        {
          text: 'Bullying or harassment',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost('Bullying or harassment');
            }, // noop
          },
        },
        {
          text: 'Scam or fraud',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportPost('Scam or fraud');
            }, // noop
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: () => {}, // noop
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        const action = detail.data?.action;
        if (typeof action === 'function') {
          action();
        } else {
          console.warn('Unknown action:', detail.data);
        }
      },
    });
  }

  function showActionSheet() {
    presentActionSheet({
      cssClass: 'nobo-action-sheet',
      buttons: actionSheetButtons,
      onDidDismiss: ({ detail }) => {
        const action = detail.data?.action;
        if (typeof action === 'function') {
          action();
        } else {
          console.warn('Unknown action:', detail.data);
        }
      },
    });
  }

  function likePost(messageId: string) {
    console.log('likePost');

    let req = {
      itemId: messageId
    }

    feedService
      .likePost(req)
      .then((res) => res.json())
      .then((data) => {
        console.log('LikePost: ', data);
        if (refreshFeed !== undefined) {
          refreshFeed();
        }
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }

  function getTimeDifferenceString(date: Date) {
    const now = new Date();
    const difference = now.getTime() - date.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (difference < minute) {
      return "just now";
    } else if (difference < hour) {
      const minutes = Math.floor(difference / minute);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (difference < day) {
      const hours = Math.floor(difference / hour);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else {
      const days = Math.floor(difference / day);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }
  }

  return (
    ((isDeleted && (
      <p></p>
      )) || (!isDeleted && (
    <IonItem
      lines="none"
      // id={elementId}
      className={'feed-item-item'}
      detail={false}
      // data-id={message.post_id}
    >
      <IonRow className="feed-item-item-content ion-text-wrap">
        <IonCol size="2">
          <IonAvatar
            className="feed-list-feed-image"
            onClick={(e) => {
              e.preventDefault();
              history.push(`/home/profile/${message.user._id}`)
            }}
          >
            <img
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                // currentTarget.src = '../../assets/images/nobo_logo_round.svg';
              }}
              src={message?.user.avatar || ""}
              alt="avatar"
            />
          </IonAvatar>
        </IonCol>
        <IonCol
          className="feed-content feed-content-center"
          size="8"
          onClick={(e) => {
            e.preventDefault();
            history.push(`/post-detail/${message._id}`)
          }}
        >
          <div className="feed-list-feed-name">{message.user.displayName}</div>
        </IonCol>
        <IonCol
          className="feed-content-center feed-content-right"
          size="2"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <div style={{ width: '100%' }}>
            <h2 className="feed-list-nobo-badge-line">
              {actionSheetButtons.length > 1 && (
                <IonIcon
                  size="1px"
                  icon={ellipsisHorizontal}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showActionSheet();
                  }}
                />
              )}
            </h2>
          </div>
        </IonCol>
        <IonCol
          className="feed-content"
          size="12"
          onClick={(e: any) => {
            console.log('e.target.classList', e.target.classList);
            e.preventDefault();
            if (e.target.classList.contains('control-arrow')) {
              return false;
            }

            if (e.target.classList.contains('nobo-zoom-image-icon')) {
              return false;
            }

            // history.push(`/home/post-detail/${message.post_id}`);
          }}
        >
          <div className="feed-list-feed-message" style={{ paddingLeft: 0 }}>
            <div></div>
            <Carousel
              showArrows={false}
              dynamicHeight={false}
              showThumbs={false}
              onChange={() => {}}
              onClickItem={() => {}}
              onClickThumb={() => {}}
              //renderIndicator={true}
              // renderIndicator={(onClickHandler:any, isSelected:boolean, index:any, label:string) => {
              //   const defStyle = { marginLeft: 20, color: "white", cursor: "pointer" };
              //   const style = isSelected
              //     ? { ...defStyle, color: "red" }
              //     : { ...defStyle };
              //   return (
              //     <span
              //       style={style}
              //       onClick={onClickHandler}
              //       onKeyDown={onClickHandler}
              //       // value={index}
              //       key={index}
              //       role="button"
              //       tabIndex={0}
              //       aria-label={`${label} ${index + 1}`}
              //     >
              //       {"cust " + index}
              //     </span>
              //   );
              // }}
            >
              {message.images.length > 0 && message.images.map((mp, i: number) => (
                <div className="nobo-image-frame" key={i}>
                  {/* <img
                    className='nobo-post-image'
                    style={{ paddingTop: '0px', height: 300, sizeMo }}
                    src={mp.replace("'", '').replace("'", '')}
                    alt="Post"
                  /> */}
                  <div
                    className="nobo-post-image"
                    style={{
                      backgroundImage: `url(${mp.url
                        .replace("'", '')
                        .replace("'", '')})`,
                    }}
                  >
                    <div className="nobo-image-options-container">
                      <div onClick={() => likePost(message._id)}>
                        <div>
                          <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z" fill="black"/>
                          </svg>
                        </div>
                        <div className="feed-list-nobo-likes-count">
                          {message.likes.length}
                        </div>
                      </div>
                      <div onClick={() => showPostComment()}>
                        <div>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_98_3490)">
                            <path d="M4.99983 0.625C2.23811 0.625 -0.00016859 2.44336 -0.00016859 4.6875C-0.00016859 5.61719 0.388503 6.46875 1.03303 7.1543C0.742019 7.92383 0.13655 8.57617 0.126785 8.58398C-0.00212171 8.7207 -0.037278 8.91992 0.0369408 9.0918C0.11116 9.26367 0.281081 9.375 0.468581 9.375C1.66975 9.375 2.61702 8.87305 3.18538 8.4707C3.74983 8.64844 4.35921 8.75 4.99983 8.75C7.76155 8.75 9.99983 6.93164 9.99983 4.6875C9.99983 2.44336 7.76155 0.625 4.99983 0.625ZM4.99983 7.8125C4.47835 7.8125 3.96272 7.73242 3.46858 7.57617L3.02522 7.43555L2.64436 7.70508C2.36507 7.90234 1.98225 8.12305 1.52132 8.27148C1.66389 8.03516 1.80257 7.76953 1.90999 7.48633L2.11702 6.9375L1.71468 6.51172C1.36116 6.13477 0.937331 5.51172 0.937331 4.6875C0.937331 2.96484 2.7596 1.5625 4.99983 1.5625C7.24007 1.5625 9.06233 2.96484 9.06233 4.6875C9.06233 6.41016 7.24007 7.8125 4.99983 7.8125Z" fill="black"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_98_3490">
                            <rect width="10" height="10" fill="white"/>
                            </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div>
                          <div className="feed-list-nobo-comments-count">
                            {message.comments.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
              {message.images.length > 0 && (
                <div className="feed-item-text" dangerouslySetInnerHTML={{__html: message.feedText}}></div>
              )}
              {message.feedText && !(message.images && message.images[0]) && (
                <div
                  className="image-grid-container image-grid-container-text"
                  style={{minWidth: '168px', minHeight: '168px', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'none', padding: '2rem', position: 'relative'}}
                  >
                  <div className="feed-item-text feed-item-text-large" dangerouslySetInnerHTML={{__html: message.feedText}}></div>
                  <div className="nobo-image-options-container">
                    <div onClick={() => likePost(message._id)}>
                      <div>
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z" fill="black"/>
                        </svg>
                      </div>
                      <div className="feed-list-nobo-likes-count">
                        {message.likes.length}
                      </div>
                    </div>
                    <div onClick={() => showPostComment()}>
                      <div>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_98_3490)">
                          <path d="M4.99983 0.625C2.23811 0.625 -0.00016859 2.44336 -0.00016859 4.6875C-0.00016859 5.61719 0.388503 6.46875 1.03303 7.1543C0.742019 7.92383 0.13655 8.57617 0.126785 8.58398C-0.00212171 8.7207 -0.037278 8.91992 0.0369408 9.0918C0.11116 9.26367 0.281081 9.375 0.468581 9.375C1.66975 9.375 2.61702 8.87305 3.18538 8.4707C3.74983 8.64844 4.35921 8.75 4.99983 8.75C7.76155 8.75 9.99983 6.93164 9.99983 4.6875C9.99983 2.44336 7.76155 0.625 4.99983 0.625ZM4.99983 7.8125C4.47835 7.8125 3.96272 7.73242 3.46858 7.57617L3.02522 7.43555L2.64436 7.70508C2.36507 7.90234 1.98225 8.12305 1.52132 8.27148C1.66389 8.03516 1.80257 7.76953 1.90999 7.48633L2.11702 6.9375L1.71468 6.51172C1.36116 6.13477 0.937331 5.51172 0.937331 4.6875C0.937331 2.96484 2.7596 1.5625 4.99983 1.5625C7.24007 1.5625 9.06233 2.96484 9.06233 4.6875C9.06233 6.41016 7.24007 7.8125 4.99983 7.8125Z" fill="black"/>
                          </g>
                          <defs>
                          <clipPath id="clip0_98_3490">
                          <rect width="10" height="10" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div>
                        <div className="feed-list-nobo-comments-count">
                          {message.comments.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="feed-item-date">{getTimeDifferenceString(new Date(message.createdAt))}</div>
{/*              { message.images.length === 0 && (
                <div className="nobo-image-options-container">
                  <div onClick={() => likePost(message._id)}>
                    <div>
                      <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z" fill="black"/>
                      </svg>
                    </div>
                    <div className="feed-list-nobo-likes-count">
                      {message.likes.length}
                    </div>
                  </div>
                  <div onClick={() => showPostComment()}>
                    <div>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_98_3490)">
                        <path d="M4.99983 0.625C2.23811 0.625 -0.00016859 2.44336 -0.00016859 4.6875C-0.00016859 5.61719 0.388503 6.46875 1.03303 7.1543C0.742019 7.92383 0.13655 8.57617 0.126785 8.58398C-0.00212171 8.7207 -0.037278 8.91992 0.0369408 9.0918C0.11116 9.26367 0.281081 9.375 0.468581 9.375C1.66975 9.375 2.61702 8.87305 3.18538 8.4707C3.74983 8.64844 4.35921 8.75 4.99983 8.75C7.76155 8.75 9.99983 6.93164 9.99983 4.6875C9.99983 2.44336 7.76155 0.625 4.99983 0.625ZM4.99983 7.8125C4.47835 7.8125 3.96272 7.73242 3.46858 7.57617L3.02522 7.43555L2.64436 7.70508C2.36507 7.90234 1.98225 8.12305 1.52132 8.27148C1.66389 8.03516 1.80257 7.76953 1.90999 7.48633L2.11702 6.9375L1.71468 6.51172C1.36116 6.13477 0.937331 5.51172 0.937331 4.6875C0.937331 2.96484 2.7596 1.5625 4.99983 1.5625C7.24007 1.5625 9.06233 2.96484 9.06233 4.6875C9.06233 6.41016 7.24007 7.8125 4.99983 7.8125Z" fill="black"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_98_3490">
                        <rect width="10" height="10" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <div className="feed-list-nobo-comments-count">
                        {message.comments.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}*/}
{/*              { message.images.length > 0 && (
                message.feedText
              )}*/}
            {/* <Swiper
              spaceBetween={10}
              slidesPerView={1}
              centeredSlides={false}
              onImagesReady={(swiper:any)=>{
                swiper.width = getRealDynamicSwiperSize(swiper);
              }}
              width={(msgPhotos?.length * 50 || 0)}
            >
              {msgPhotos.map((mp) => (
                <div>
                  <SwiperSlide
                    className={'noselect explore-sports-slide'}
                    key={mp}
                    data-path={mp}
                  >
                    <img
                      style={{ paddingTop: '24px', height: 200 }}
                      src={mp.replace("'", '').replace("'", '')}
                      alt="Post"
                    />
                  </SwiperSlide>
                </div>
              ))}
            </Swiper> */}
          </div>
        </IonCol>
{/*        {message?.video_url && (
          <IonCol className="feed-content" size="12">
            <span>
              <div className="video-container">
                <iframe
                  title="highlight"
                  className="nobo-highlight-video"
                  src={message.video_url}
                />
              </div>
            </span>
          </IonCol>
        )}*/}

{/*        {message.is_promoted && (
          <IonCol className="feed-content feed-content-image" size="12">
            <span className="feed-list-promoted">Promoted</span>
            {message.user_id === userId && (
              <IonIcon
                icon={statsChartOutline}
                className="feed-list-stats"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/home/post-stats/${message.post_id}`);
                }}
              />
            )}
          </IonCol>
        )}*/}
        <IonCol
          size="12"
          className={`feed-content feed-content-footer`}
        >
        </IonCol>
      </IonRow>

{/*      <CreateCommentModal
        ref={commentModal}
        postId={message?.post_id}
        onCancel={() => {
          commentModal.current?.dismiss();
        }}
        onClose={() => {
          message.comment_count = (message.comment_count || 0) + 1;
          setCommentCount(commentCount + 1);
          commentModal.current?.dismiss();
        }}
      />*/}
    </IonItem>)))
  );
};

export default FeedListItem;
