import ProfileSummary from '../components/ProfileSections/ProfileSummary';
import { useState, useRef } from 'react';
import { isPlatform } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { NoboProfile, emptyProfile } from '../data/nobo-profile';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  useIonActionSheet,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonLoading,
  IonIcon,
  IonButtons,
  IonModal,
  IonRow,
} from '@ionic/react';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { SubscriptionService } from '../services/SubscriptionService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';

import './Profile.scss';
import ProductList from '../components/ProductList';
import ReviewList from '../components/ReviewList';
import { chevronBackOutline } from 'ionicons/icons';
import { loadingOptions } from '../util';
import Button from '../components/Button';

interface ProfileProps {
  myProfile: boolean;
}

const ProfilePage: React.FC<ProfileProps> = profile => {
  const history = useHistory();
  const authService = new AuthService();
  const userService = new UserService();
  let subscriptionService: any;
  let [userId, setUserId] = useState<string>('');
  const [profileURL, setProfileURL] = useState('');
  const [presentLoading, dismissLoading] = useIonLoading();
  const profileModal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonActionSheet();
  const [presentProfileReportingActionSheet] = useIonActionSheet();
  let [noboProfile, setNoboProfile] = useState<NoboProfile>(emptyProfile);
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [targetSection, setTargetSection] = useState('Feed');
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useIonViewDidEnter(() => {
    reset();

    const onPageLoad = () => {
      loadProfile();

      if (isPlatform('ios') && profile.myProfile) {
        subscriptionService = new SubscriptionService(new InAppPurchase2());
        subscriptionService.register();
        setUserSubscribed(subscriptionService.isSubscribed('com.nobo.athlete.1month'));
      }
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      return () => window.removeEventListener('load', onPageLoad);
    }
  });

  useIonViewDidLeave(() => {
    reset();
  });

  var options = {
    subject: 'Share Profile',
    files: ['', ''],
    url: profileURL,
    chooserTitle: 'Pick an app',
    appPackageName: 'com.apple.social.facebook',
    iPadCoordinates: '0,0,0,0',
  };

  async function reportUser(reportType: string) {
    window.location.href = `mailto:support@thenobo.com?subject=${reportType}&body=${userId}`;
  }

  function shareProfile(result: any) {
    if (result === 'qrCode') {
      profileModal.current?.present();
    } else if (result === 'share') {
      SocialSharing.shareWithOptions(options);
    } else if (result === 'report') {
      showReportingActionSheet();
    }
  }

  function showReportingActionSheet() {
    presentProfileReportingActionSheet({
      cssClass: 'nobo-action-sheet',
      header: 'Report User',
      buttons: [
        {
          text: "It's spam",
          data: {
            action: () => {
              reportUser("It's spam");
            }, // noop
          },
        },
        {
          text: 'Nude or sexual activity',
          data: {
            action: () => {
              reportUser('Nude or sexual activity');
            }, // noop
          },
        },
        {
          text: 'Hate speech or symbols',
          data: {
            action: () => {
              reportUser('Hate speech or symbols');
            }, // noop
          },
        },
        {
          text: 'False Information',
          data: {
            action: () => {
              reportUser('False Information');
            }, // noop
          },
        },
        {
          text: "I just don't like it",
          data: {
            action: () => {
              reportUser("I just don't like it");
            },
          },
        },
        {
          text: 'Bullying or harassment',
          data: {
            action: () => {
              reportUser('Bullying or harassment');
            },
          },
        },
        {
          text: 'Scam or fraud',
          data: {
            action: () => {
              reportUser('Scam or fraud');
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

  function openShare() {
    present({
      cssClass: 'nobo-action-sheet',
      buttons: [
        {
          text: 'Report',
          who: 'notme',
          role: 'destructive',
          data: {
            action: 'report',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ].filter(b => {
        return (
          b.who === 'all' ||
          !b.who ||
          (b.who === 'me' && profile.myProfile) ||
          (b.who === 'notme' && !profile.myProfile)
        );
      }),
      onDidDismiss: ({ detail }) => {
        if (detail.data === undefined) {
          return;
        }

        if (detail.data.action !== undefined) {
          shareProfile(detail.data.action);
        }
      },
    });
  }

  function reset() {
    const nonExistentID = '';
    userId = nonExistentID;
    setUserId(nonExistentID);
    setProfileURL('');
    setNoboProfile(emptyProfile);
  }

  function loadProfile() {
    const addressBarPathName = history.location.pathname;
    let userIdStr: any = addressBarPathName.substring(addressBarPathName.lastIndexOf('/') + 1);

    if (isNaN(userIdStr) && userIdStr.length > 10) {
      userIdStr = userIdStr.substring(userIdStr.lastIndexOf('-') + 1);
    } else {
      const myUserId = authService.getUserId();
      userId = myUserId || '';
    }

    if (userIdStr !== 'my-profile') {
      userId = userIdStr;
    }

    setUserId(userId);
    getProfile(userId);
    checkIfFollowing();
    return userId;
  }

  function getProfile(id: any = '') {
    presentLoading(loadingOptions);
    userService
      .getProfile(id)
      .then(res => res.json())
      .then(data => {
        if (data === null) {
          setNoboProfile(emptyProfile);
        } else {
          if (
            !data['user'].profileBg ||
            data['user'].profileBg === '/NOBO_defaultcoverimage.jpeg'
          ) {
            data['user'].profileBg = 'https://thenobo.com/NOBO_defaultcoverimage.jpeg';
          }
          setNoboProfile(data['user']);
        }
        dismissLoading();
      })
      .catch(() => {
        dismissLoading();
      });
  }

  function checkIfFollowing() {
    userService
      .getFollowers(userId)
      .then(res => res.json())
      .then(data => {
        const followerIds = data.followers.map((follower: any) => follower._id);

        const myUserId = authService.getUserId();
        const isMatching = followerIds.includes(myUserId);
        setIsFollowing(isMatching);
      });
  }

  function followUser() {
    userService.followUser(userId);

    setTimeout(() => {
      checkIfFollowing();
    }, 250);
  }

  function unFollowUser() {
    userService.removeFollowUser(userId);
    setTimeout(() => {
      checkIfFollowing();
    }, 250);
  }

  return (
    <IonPage className="home-page-athlete-profile" style={{ backgroundColor: '#F9FBFB' }}>
      <IonContent className="athlete-profile-content" scrollY={false}>
        {!profile.myProfile && (
          <IonButtons
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '3rem',
              color: 'white',
              zIndex: 101,
            }}
          >
            <IonIcon
              onClick={() => {
                history.goBack();
              }}
              size="large"
              slot="icon-only"
              icon={chevronBackOutline}
            />
          </IonButtons>
        )}

        <IonModal
          ref={profileModal}
          trigger="open-profile-modal"
          initialBreakpoint={0.85}
          breakpoints={[0, 0.75, 0.85]}
        >
          <IonContent className="ion-padding">
            <IonButton
              className="nobo-qr-code-btn-close"
              onClick={() => profileModal.current?.dismiss()}
            >
              Cancel
            </IonButton>
          </IonContent>
          <IonHeader></IonHeader>
        </IonModal>

        <div
          className="profile-banner-container"
          style={{ backgroundImage: `url(${noboProfile.profileBg})` }}
        ></div>
        {profile.myProfile && (
          <div
            onClick={e => {
              e.preventDefault();
              history.push(`/home/style-feed`);
            }}
            className="profile-header-container"
            style={{ backgroundImage: `url('assets/images/my-profile-header.svg')` }}
          ></div>
        )}
        {profile.myProfile && (
          <IonButton
            onClick={e => {
              e.preventDefault();
              history.push(`edit-athlete/${userId}`);
            }}
            fill="clear"
            color="#1A3A35"
            className="nobo-edit-profile-button"
          >
            Edit
          </IonButton>
        )}
        {!profile.myProfile && !isFollowing && (
          <Button
            label="FOLLOW"
            className="nobo-follow-profile-button"
            onClick={() => {
              followUser();
            }}
          ></Button>
        )}
        {!profile.myProfile && isFollowing && (
          <Button
            label="FOLLOWING"
            className="nobo-follow-profile-button"
            onClick={() => {
              unFollowUser();
            }}
          ></Button>
        )}
        <div className="profile-bubble-container">
          <img
            className={`profile-bubble ${userSubscribed && 'profile-bubble-premium-border'}`}
            src={noboProfile.avatar}
            alt="avatar"
          />
        </div>
        <ProfileSummary profile={noboProfile} openSocialShare={openShare}></ProfileSummary>

        <IonRow className="nobo-menu-container">
          <div className="nobo-menu-circle" onClick={() => setTargetSection('Feed')}>
            <div className="circle-background">
              <img
                className={
                  targetSection === 'Feed'
                    ? 'nobo-profile-menu-selected'
                    : 'nobo-profile-menu-not-selected'
                }
                src="assets/images/navigation/nav-profile-items.svg"
                alt="feed"
              />
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={() => setTargetSection('Trades')}>
            <div className="circle-background">
              <img
                className={
                  targetSection === 'Trades'
                    ? 'nobo-profile-menu-selected'
                    : 'nobo-profile-menu-not-selected'
                }
                src="assets/images/navigation/nav-trade.svg"
                alt="trades"
              />
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={() => setTargetSection('Purchase')}>
            <div className="circle-background">
              <img
                className={
                  targetSection === 'Purchase'
                    ? 'nobo-profile-menu-selected'
                    : 'nobo-profile-menu-not-selected'
                }
                src="assets/images/navigation/nav-profile-purchased.svg"
                alt="purchase"
              />
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={() => setTargetSection('Reviews')}>
            <div className="circle-background">
              <img
                className={
                  targetSection === 'Reviews'
                    ? 'nobo-profile-menu-selected'
                    : 'nobo-profile-menu-not-selected'
                }
                src="assets/images/navigation/nav-profile-reviews.svg"
                alt="reviews"
              />
            </div>
          </div>
        </IonRow>
        {targetSection === 'Feed' && <ProductList type="" userId={userId}></ProductList>}
        {targetSection === 'Trades' && <ProductList type="trade" userId={userId}></ProductList>}
        {targetSection === 'Purchase' && <ProductList type="sell" userId={userId}></ProductList>}
        {targetSection === 'Reviews' && <ReviewList reviewData={noboProfile.reviews}></ReviewList>}
        <div style={{ height: '5vh' }}></div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
