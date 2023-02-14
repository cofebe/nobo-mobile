import {
  IonItem,
  IonRow,
  IonCol,
  IonAvatar,
  IonIcon,
  useIonActionSheet,
} from '@ionic/react';
import { ellipsisVertical, statsChartOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FeedItem } from '../data/athlete-feed';
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
}

const FeedListItem: React.FC<FeedListItemProps> = ({
  message,
  trackImpressions = false,
  disableProfileLink = false,
  zoomAction,
}) => {
  const history = useHistory();
  const feedService = new FeedService();
  const reportService = new ReportService();
  const [commentCount, setCommentCount] = useState<number>(
    message.comment_count || 0
  );
  const [likeCount, setLikeCount] = useState<number>(message.like_count || 0);
  const [msgPhotos, setMsgPhotos] = useState(getMessagePhotos(message));

  const [presentActionSheet] = useIonActionSheet();
  const [presentReportingActionSheet] = useIonActionSheet();

  const storage: any = window.localStorage.getItem('persistedState');
  const user = (storage ? JSON.parse(storage) : undefined);
  const [isDeleted, setIsDeleted] = useState<any>(false);

  let userId = 0;
  if (user) {
    userId = user.user['user_id'];
  }

  const commentModal = useRef<HTMLIonModalElement>(null);

  const elementId =
    'feedItem' + message.post_id + (message.is_promoted ? 'p' : '');

  useEffect(() => {
    if (message.sport) {
      if (message.sport[0] === 'w' || message.sport[0] === 'm') {
        message.sport = message.sport.slice(1);
      }
    }

    setMsgPhotos(getMessagePhotos(message));

    if (trackImpressions) {
      const container = document.querySelector('.home-content');
      const elem = document.querySelector('#' + elementId);
      if (container && elem) {
        const options = {
          root: container,
          rootMargin: '0px',
          threshold: 1.0,
        };
        const observer = new IntersectionObserver((entries) => {
          //console.log('*1', entries, entries[0]);
          if (entries.length && entries[0].isIntersecting) {
            console.log(`Tracking impression for post ID ${message.post_id}`);
            feedService.trackImpression(message.post_id);
            observer.unobserve(elem);
          }
        }, options);
        observer.observe(elem);
      }
    }
  }, [message, trackImpressions]);

  function showPostComment() {
    commentModal.current?.present();
  }

  function viewUser_(history: any, userId: number, userType: string) {
    if (!disableProfileLink) {
      viewUser(history, userId, userType, message.post_id);
    }
  }

  const [postURL, setPostURL] = useState(`https://www.urpplus.com/home/post-detail/${message.post_id}`);

  var options = {
    message: `${message.from_name}`,
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
      text: 'View Likes',
      who: 'all',
      data: {
        action: () => {
          console.log('viewLikes');
          history.push(`/home/post-detail/${message.post_id}/likes`);
        },
      },
    },
    //{
    //  text: 'View Interests',
    //  who: 'me',
    //  data: {
    //    action: () => {
    //      console.log('viewInterests');
    //      history.push(`/home/post-detail/${message.post_id}/interests`);
    //    },
    //  },
    //},
    {
      text: 'Promote',
      who: 'me',
      data: {
        action: () => {
          console.log('promotePost');
          history.push(`/home/post-promote/${message.post_id}`);
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
            .removePost(message.post_id)
            .then((res) => res.json())
            .then((data) => {})
            .catch((err) => {
              console.error('Error:', err);
            });
            setIsDeleted(true);
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
    if (message.is_promoted && b.text === 'Promote') {
      // don't allow promoting a post already being promoted
      return false;
    }

    return (
      b.who === 'all' ||
      !b.who ||
      (b.who === 'me' && message.user_id === userId) ||
      (b.who === 'notme' && message.user_id !== userId)
    );
  });

  async function reportPost(reportType: string) {
    console.log('reportPost', reportType);
    let req = {
      user_id: userId,
      user_id_reported: message.user_id,
      post_id_reported: message.post_id,
      category: reportType,
    };
    await reportService.reportPost(req);
  }

  function showReportingActionSheet() {
    console.log('showReportingActionSheet');
    presentReportingActionSheet({
      cssClass: 'urp-action-sheet',
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
        // console.log('showActionSheet:detail', detail);
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
    console.log('showActionSheet');
    presentActionSheet({
      header: 'Post actions',
      cssClass: 'urp-action-sheet',
      //subHeader: 'Subheader',
      buttons: actionSheetButtons,
      onDidDismiss: ({ detail }) => {
        // console.log('showActionSheet:detail', detail);
        const action = detail.data?.action;
        if (typeof action === 'function') {
          action();
        } else {
          console.warn('Unknown action:', detail.data);
        }
      },
    });
  }

  function likePost() {
    console.log('likePost');

    if (message.like_count === undefined) {
      message.like_count = 0;
    }

    if (message.liked_post) {
      message.like_count -= 1;
      setLikeCount(likeCount - 1);
      message.liked_post = false;
      feedService
        .removeLikePost(userId, message.post_id)
        .then((res) => res.json())
        .then((data) => {
          console.log('removeLikePost: ', data);
        })
        .catch((err) => {
          console.error('Error:', err);
          // setTimeout(() => {
          //   console.log("Trying like post again")
          //   likePost()
          // }, 1000)
        });
    } else {
      message.like_count += 1;
      setLikeCount(likeCount + 1);
      message.liked_post = true;
      feedService
        .likePost(userId, message.post_id)
        .then((res) => res.json())
        .then((data) => {
          console.log('LikePost: ', data);
        })
        .catch((err) => {
          console.error('Error:', err);
          // setTimeout(() => {
          //   console.log("Trying like post again")
          //   likePost()
          // }, 1000)
        });
    }
  }

  return (
    ((isDeleted && (
      <p></p>
      )) || (!isDeleted && (
    <IonItem
      lines="none"
      id={elementId}
      className={'feed-item-item ' + (message.is_promoted ? 'promoted' : '')}
      detail={false}
      data-id={message.post_id}
    >
      <IonRow className="feed-item-item-content ion-text-wrap">
        <IonCol size="1">
          <IonAvatar
            className="feed-list-feed-image"
            onClick={(e) => {
              // profile pic clicked
              e.preventDefault();
              viewUser_(history, message.user_id, message.account_type);
            }}
          >
            <img
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = '../../assets/images/urp_logo_round.svg';
              }}
              src={message.profile_image}
              alt="avatar"
            />
          </IonAvatar>
        </IonCol>
        <IonCol
          className="feed-content feed-content-center"
          size="7"
          onClick={(e) => {
            // profile pic clicked
            e.preventDefault();
            viewUser_(history, message.user_id, message.account_type);
          }}
        >
          <div className="feed-list-feed-name">{message.from_name}</div>
        </IonCol>
        <IonCol
          className="feed-content-center feed-content-right"
          size="4"
          onClick={(e) => {
            e.preventDefault();
            viewUser_(history, message.user_id, message.account_type);
          }}
        >
          <div style={{ width: '100%' }}>
            <h2 className="feed-list-urp-badge-line">
              <span>
                {message.sport ? (
                  <img
                    className="feed-list-logo-image"
                    src={`assets/images/urp-badge-${message.sport}.svg`}
                    alt={message.sport}
                  />
                ) : (
                  ''
                )}
              </span>
              <span className="feed-list-feed-primary-sport">
                {(message?.position || '').replace(/"/g, '')}
              </span>
              {message?.rating > 0 && (
                <span className="feed-list-feed-ranking">
                  <p className="feed-list-feed-ranking-text">
                    {message?.rating}
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 -2 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.52447 1.46353C5.67415 1.00287 6.32585 1.00287 6.47553 1.46353L7.23483 3.80041C7.30176 4.00642 7.49374 4.1459 7.71036 4.1459H10.1675C10.6519 4.1459 10.8532 4.76571 10.4614 5.05041L8.47352 6.49468C8.29828 6.622 8.22495 6.84768 8.29188 7.0537L9.05118 9.39058C9.20086 9.85123 8.67362 10.2343 8.28176 9.94959L6.29389 8.50532C6.11865 8.378 5.88135 8.378 5.70611 8.50532L3.71824 9.94959C3.32638 10.2343 2.79914 9.85123 2.94882 9.39058L3.70812 7.0537C3.77505 6.84768 3.70172 6.622 3.52648 6.49468L1.53861 5.05041C1.14675 4.76571 1.34814 4.1459 1.8325 4.1459H4.28964C4.50626 4.1459 4.69824 4.00642 4.76517 3.80041L5.52447 1.46353Z"
                        fill="#00D6B6"
                      />
                    </svg>
                  </p>
                </span>
              )}
              {actionSheetButtons.length > 1 && (
                <IonIcon
                  icon={ellipsisVertical}
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
          className="feed-content feed-content-stats"
          size="11"
          offset="1"
          onClick={(e) => {
            e.preventDefault();
            viewUser_(history, message.user_id, message.account_type);
          }}
        >
          <div>
            {message?.account_type === 'athlete' ? (
              <h3 className="feed-l2">
                <span>{message?.school}</span>
                <span className="feed-border">|</span>
                <span>{message?.height}</span>
                <span className="feed-border">|</span>
                <span>{message?.weight + 'lbs'}</span>
                <span className="feed-border">|</span>
                <span>
                  <span>{message?.year}</span>
                </span>
              </h3>
            ) : (
              <h3 className="feed-l2">
                <span>{message?.school}</span>
              </h3>
            )}
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

            if (e.target.classList.contains('urp-zoom-image-icon')) {
              return false;
            }

            history.push(`/home/post-detail/${message.post_id}`);
          }}
        >
          <div className="feed-list-feed-message" style={{ paddingLeft: 0 }}>
            {message.data}
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
              {msgPhotos.map((mp, i: number) => (
                <div className="urp-image-frame" key={i}>
                  <div
                    className="urp-zoom-image"
                    onClick={(e) => {
                      console.log('zoom');
                      if (zoomAction) {
                        zoomAction(i);
                      }
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <svg
                      className="urp-zoom-image-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      data-name="Layer 1"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path d="M9.707,14.293c.391,.391,.391,1.023,0,1.414l-6.293,6.293h4.586c.553,0,1,.448,1,1s-.447,1-1,1H3c-1.654,0-3-1.346-3-3v-5c0-.552,.447-1,1-1s1,.448,1,1v4.586l6.293-6.293c.391-.391,1.023-.391,1.414,0ZM21,0h-5c-.553,0-1,.448-1,1s.447,1,1,1h4.586l-6.293,6.293c-.391,.391-.391,1.023,0,1.414,.195,.195,.451,.293,.707,.293s.512-.098,.707-.293l6.293-6.293v4.586c0,.552,.447,1,1,1s1-.448,1-1V3c0-1.654-1.346-3-3-3Z" />
                    </svg>
                  </div>
                  {/* <img
                    className='urp-post-image'
                    style={{ paddingTop: '0px', height: 300, sizeMo }}
                    src={mp.replace("'", '').replace("'", '')}
                    alt="Post"
                  /> */}
                  <div
                    className="urp-post-image"
                    style={{
                      backgroundImage: `url(${mp
                        .replace("'", '')
                        .replace("'", '')})`,
                    }}
                  ></div>
                </div>
              ))}
            </Carousel>

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
            {msgPhotos.length === 1 && (
              <div
                style={{
                  bottom: 4,
                  zIndex: 10000,
                  left: 17,
                  right: 4,
                  height: 20,
                  borderTopColor: '#e9e8e2',
                  backgroundColor: 'white',
                  position: 'absolute',
                }}
              ></div>
            )}
          </div>
        </IonCol>
        {message?.video_url && (
          <IonCol className="feed-content" size="12">
            <span>
              <div className="video-container">
                <iframe
                  title="highlight"
                  className="urp-highlight-video"
                  src={message.video_url}
                />
              </div>
            </span>
          </IonCol>
        )}

        {message.is_promoted && (
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
        )}
        <IonCol
          size="12"
          className={`feed-content feed-content-footer ${
            message?.location && 'feed-content-location'
          }`}
        >
          <div className="feed-list-bottom-icons">
            <span className="feed-list-date">
              {message?.location && (
                <div className="feed-content-location-font">
                  {message?.location}
                </div>
              )}
              <span
                className={`${
                  message?.location && 'feed-content-location-font'
                }`}
              >
                {message.date}
              </span>
            </span>
            <div onClick={() => showPostComment()}>
              <div>
                <svg
                  width="20"
                  height="17"
                  viewBox="0 0 13 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.14449 4.51786C2.81792 4.51786 2.5552 4.78058 2.5552 5.10714C2.5552 5.43371 2.81792 5.69643 3.14449 5.69643C3.47105 5.69643 3.73377 5.43371 3.73377 5.10714C3.73377 4.78058 3.47105 4.51786 3.14449 4.51786ZM6.28734 4.51786C5.96078 4.51786 5.69806 4.78058 5.69806 5.10714C5.69806 5.43371 5.96078 5.69643 6.28734 5.69643C6.61391 5.69643 6.87663 5.43371 6.87663 5.10714C6.87663 4.78058 6.61391 4.51786 6.28734 4.51786ZM9.4302 4.51786C9.10364 4.51786 8.84092 4.78058 8.84092 5.10714C8.84092 5.43371 9.10364 5.69643 9.4302 5.69643C9.75676 5.69643 10.0195 5.43371 10.0195 5.10714C10.0195 4.78058 9.75676 4.51786 9.4302 4.51786ZM6.28734 0C2.81547 0 0.00162958 2.28594 0.00162958 5.10714C0.00162958 6.27589 0.490246 7.34643 1.30051 8.20826C0.934665 9.17567 0.173505 9.99576 0.161228 10.0056C-0.000825781 10.1775 -0.0450222 10.4279 0.0482814 10.644C0.141585 10.86 0.355201 11 0.590915 11C2.10096 11 3.29181 10.369 4.00632 9.86317C4.71592 10.0866 5.48199 10.2143 6.28734 10.2143C9.75922 10.2143 12.5731 7.92835 12.5731 5.10714C12.5731 2.28594 9.75922 0 6.28734 0ZM6.28734 9.42857C5.59248 9.42857 4.90498 9.32299 4.24449 9.11429L3.87127 8.99643L3.55208 9.22232C2.98734 9.62254 2.11569 10.0891 1.03288 10.1946C1.32752 9.82388 1.76458 9.20268 2.03467 8.48571L2.209 8.02656L1.87261 7.66808C1.16301 6.91674 0.787344 6.03036 0.787344 5.10714C0.787344 2.72545 3.25498 0.785714 6.28734 0.785714C9.31971 0.785714 11.7873 2.72545 11.7873 5.10714C11.7873 7.48884 9.31971 9.42857 6.28734 9.42857Z"
                    fill="#00D6B6"
                  />
                </svg>
              </div>
              <div>
                <div className="feed-list-urp-comments-count">
                  {message.comment_count}
                </div>
              </div>
            </div>

            {!message.liked_post && (
              <div onClick={() => likePost()}>
                <div>
                  <svg
                    width="20"
                    height="17"
                    viewBox="0 0 13 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7385 0.753744C10.3547 -0.385547 8.28535 -0.196484 7.00057 1.08522L6.50037 1.58611L6.00017 1.08767C4.96423 0.0515088 2.87456 -0.572155 1.26224 0.753744C-0.332309 2.06982 -0.416099 4.43189 1.01087 5.856L5.924 10.7618C6.08142 10.919 6.28963 11 6.49783 11C6.70604 11 6.91424 10.9214 7.07167 10.7618L11.9848 5.856C13.4168 4.43189 13.3331 2.06982 11.7385 0.753744ZM11.4059 5.31091L6.51053 10.2167L1.59486 5.31091C0.619848 4.33858 0.416722 2.48478 1.79037 1.35285C3.18179 0.203742 4.81696 1.03611 5.41618 1.63522L6.50037 2.71804L7.58456 1.63522C8.17363 1.04593 9.82404 0.211108 11.2104 1.35285C12.5815 2.48232 12.3809 4.33613 11.4059 5.31091Z"
                      fill="#00D6B6"
                    />
                  </svg>
                </div>
                <div className="feed-list-urp-likes-count">
                  {message.like_count}
                </div>
              </div>
            )}
            {message.liked_post && (
              <div onClick={() => likePost()}>
                <div>
                  <svg
                    width="20"
                    height="17"
                    viewBox="0 0 13 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.23148 0C7.70197 0.00830248 7.184 0.157306 6.72989 0.431963C6.27578 0.706621 5.90161 1.09721 5.64516 1.56428C5.38871 1.09721 5.01454 0.706621 4.56043 0.431963C4.10632 0.157306 3.58835 0.00830248 3.05884 0C2.21473 0.0369694 1.41944 0.409202 0.846726 1.03538C0.274009 1.66155 -0.0295826 2.49077 0.00227648 3.34186C0.00227648 5.49724 2.25285 7.85124 4.14039 9.44728C4.56183 9.80428 5.09468 10 5.64516 10C6.19565 10 6.72849 9.80428 7.14993 9.44728C9.03747 7.85124 11.288 5.49724 11.288 3.34186C11.3199 2.49077 11.0163 1.66155 10.4436 1.03538C9.87088 0.409202 9.07559 0.0369694 8.23148 0Z"
                      fill="#00D6B6"
                    />
                  </svg>
                </div>
                <div className="feed-list-urp-likes-count">
                  {message.like_count}
                </div>
              </div>
            )}
          </div>
        </IonCol>
      </IonRow>

      <CreateCommentModal
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
      />
    </IonItem>)))
  );
};

export default FeedListItem;
