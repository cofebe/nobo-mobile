import ProfileSummary from '../components/ProfileSections/ProfileSummary';
import { useState, useRef } from 'react';
import { IonCol, IonTitle, isPlatform } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { NoboProfile, emptyProfile } from '../data/nobo-profile';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
import { environment } from '../environments/environment';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  useIonActionSheet,
  useIonViewDidEnter,
  useIonViewDidLeave,
  IonIcon,
  IonButtons,
  IonModal,
  IonRow,
} from '@ionic/react';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';

import './Profile.scss';
import './Profile.css';
import ProductList from '../components/ProductList';
import ReviewList from '../components/ReviewList';
import { chevronBackOutline } from 'ionicons/icons';
import { loadingOptions } from '../util';
import Button from '../components/Button';
import { getImageUrl } from '../utils';

interface ProfileProps {
  myProfile: boolean;
}

const ProfilePage: React.FC<ProfileProps> = profile => {
  const history = useHistory();
  const authService = new AuthService();
  const userService = new UserService();
  let [userId, setUserId] = useState<string>('');
  const [profileURL, setProfileURL] = useState('');
  const profileModal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonActionSheet();
  const [presentProfileReportingActionSheet] = useIonActionSheet();
  let [noboProfile, setNoboProfile] = useState<NoboProfile>(emptyProfile);
  const [targetSection, setTargetSection] = useState('Feed');
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const welcomeModal = useRef<HTMLIonModalElement>(null)


  useIonViewDidEnter(() => {
    reset();
    modalSwitch();
    const onPageLoad = () => {
      loadProfile();
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      return () => window.removeEventListener('load', onPageLoad);
    }
  });

  const modalSwitch = () => {
    const newUser = localStorage.getItem('newUser');
    if (newUser) {
      welcomeModal.current?.present()
      // console.log('we found new newUser');
    } else {
      // console.log('no newUser');
    }
  };

  // const welcomeModal = () =>{

  // }

  useIonViewDidLeave(() => {
    reset();
    localStorage.removeItem('newUser');
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
    if (result === 'share') {
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
            action: () => { }, // noop
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
          text: 'Share',
          who: 'all',
          data: {
            action: 'share',
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
   console.log("Profile.tsx:loadProfile");

    const addressBarPathName = history.location.pathname;
    let userIdStr: any = addressBarPathName.substring(addressBarPathName.lastIndexOf('/') + 1);

    if (isNaN(userIdStr) && userIdStr.length > 10) {
      userIdStr = userIdStr.substring(userIdStr.lastIndexOf('-') + 1);
    } else {
      const myUserId = authService.getUserId();
      userId = myUserId || '';
    }

    if (userIdStr !== 'my-profile' && userIdStr !== 'style-feed') {
      userId = userIdStr;
    }

    setUserId(userId);
    getProfile(userId);
    checkIfFollowing();
    return userId;
  }

  function getProfile(id: any = '') {
      console.log("Profile.tsx:getProfile");
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
          setProfileURL(`${environment.serverUrl}/profile/${data['user']._id}/feed`)
        }
      })
      .catch(() => { });
  }

  function checkIfFollowing() {
    console.log("Profile.tsx:checkIfFollowing");

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
    <div className="stylefeed-page">
      <IonContent className="athlete-profile-content" scrollY={false}>
        {!profile.myProfile && (
          <IonButtons
            style={{
              position: 'absolute',
              left: '20px',
              top: '90px',
              zIndex: 101,
            }}
            onClick={() => {
              history.goBack();
            }}
          >
             <img
            height={38}
            src="assets/images/arrow-left.svg"
            alt="logo"
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
            className="profile-create-post"
            onClick={e => {
              e.preventDefault();
              history.push('/home/post-create');
            }}
          >
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_1150_5872)">
              <path
                d="M30.5 36C30.5 32.9624 32.9624 30.5 36 30.5H42.157H45H47.843H54C57.0376 30.5 59.5 32.9624 59.5 36V54C59.5 57.0376 57.0376 59.5 54 59.5H45H36C32.9624 59.5 30.5 57.0376 30.5 54V36Z"
                stroke="black"
                shape-rendering="crispEdges"
              />
            </g>
            <path
              d="M52.0625 45.0312C52.0625 45.5835 51.6148 46.0357 51.0625 46.0357H46.0357V51.0625C46.0357 51.6148 45.5835 52.0625 45.0312 52.0625C44.479 52.0625 44.0268 51.6148 44.0268 51.0625V46.0357H39C38.4477 46.0357 38 45.5835 38 45.0312C38 44.479 38.4477 44.0268 39 44.0268H44.0268V39C44.0268 38.4477 44.479 38 45.0312 38C45.5835 38 46.0357 38.4477 46.0357 39V44.0268H51.0625C51.6148 44.0268 52.0625 44.479 52.0625 45.0312Z"
              fill="black"
            />
            <defs>
              <filter
                id="filter0_d_1150_5872"
                x="0"
                y="0"
                width="90"
                height="90"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="15" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.87451 0 0 0 0 0.87451 0 0 0 0 0.87451 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1150_5872"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1150_5872"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
        <div
          className="profile-banner-container"
          style={{ backgroundImage: `url(${noboProfile.profileBg})` }}
        >
        </div>
        {profile.myProfile && (
          <IonButton
            onClick={e => {
              e.preventDefault();
              history.push(`/home/profile-edit`);
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
            className="nobo-un-follow-profile-button"
            onClick={() => {
              unFollowUser();
            }}
          ></Button>
        )}
        <div className="profile-bubble-container">
          <img className="profile-bubble" src={noboProfile.avatar} alt="avatar" />
        </div>
        <ProfileSummary profile={noboProfile} openSocialShare={openShare}></ProfileSummary>

        <IonRow className="nobo-menu-container" >
          <div className="nobo-menu-circle" onClick={() => setTargetSection('Feed')}>
            <div className="circle-background">

              <img
                // className={
                //   targetSection === 'Feed'
                //     ? 'nobo-profile-menu-selected'
                //     : 'nobo-profile-menu-not-selected'
                // }

                className='nobo-profile-menu-selected2'
                src={targetSection === 'Feed' ?
                  "assets/images/navigation/feeds-dark.svg"
                  : "assets/images/navigation/feeds-gray.svg"}
                alt="feed"
              />
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={() => setTargetSection('Trades')}>
            <div className="circle-background">
              <img
                // className={
                //   targetSection === 'Trades'
                //     ? 'nobo-profile-menu-selected'
                //     : 'nobo-profile-menu-not-selected'
                // }
                src={targetSection === 'Trades' ?
                  "assets/images/navigation/trades-dark.svg"
                  : "assets/images/navigation/trades-gray.svg"}
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
        {targetSection === 'Feed' && <ProductList type="" userId={userId} isLoggedUser={profile.myProfile}></ProductList>}
        {targetSection === 'Trades' && <ProductList type="trade" userId={userId} isLoggedUser={profile.myProfile}></ProductList>}
        {targetSection === 'Purchase' && <ProductList type="sell" userId={userId} isLoggedUser={profile.myProfile}></ProductList>}
        {targetSection === 'Reviews' && <ReviewList reviewData={noboProfile.reviews} isLoggedUser={profile.myProfile}></ReviewList>}
        <div style={{ height: '5vh' }}></div>
      </IonContent>


      <IonModal id="example-modal" ref={welcomeModal} trigger="open-modal">
        <IonRow className='welcome-main-container'>
          <IonCol size='12' className='welcome-title-container'>
            <p className='welcome-title-text'>
              Check out your style feed post!
            </p>
          </IonCol>

          <IonCol size='12' className='welcome-img-container'>
            <div className='welcome-img-box'>
              <img height={114} className='welcome-profile-img' src={noboProfile.avatar} alt="" />
            </div>
          </IonCol>

          <IonCol size='12' className='welcome-body-info'>
            <p className='welcome-body-text'>Go to your style feed to connect with the community!</p>
          </IonCol>

          <IonCol size='12' className='welcome-btn-container'>
            <Button
              className='welcome-btn'
              label='VIEW MY POST'
              onClick={() => {
                localStorage.removeItem('newUser');
                history.push(`/home/style-feed`);
                welcomeModal.current?.dismiss()
              }}
            />
          </IonCol>

          <IonCol size='12' className='welcome-btn-container2'
            onClick={() => {
              localStorage.removeItem('newUser');
              welcomeModal.current?.dismiss()
            }}
          >
            <p className='welcome-btn2'>MAYBE LATER</p>
          </IonCol>

        </IonRow>
      </IonModal>
    </div>
  );
};

export default ProfilePage;
