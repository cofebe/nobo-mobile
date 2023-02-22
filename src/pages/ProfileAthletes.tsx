import ProfileSummary from '../components/ProfileSections/ProfileSummary';
import { useState, useRef, useEffect } from 'react';
import { isPlatform } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { AthleteProfile, emptyProfile } from '../data/athlete-detail';
import { ReactComponent as Sports247Icon } from '../components/sports247-icon.svg';
import { ReactComponent as HudleIcon } from '../components/hudl-icon.svg';
import { ReactComponent as MaxPrepsIcon } from '../components/max-prep-white-icon.svg';
import { ReactComponent as RivalsIcon } from '../components/rivals-icon.svg';
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
  useIonLoading,
  IonIcon,
  IonButtons,
  IonModal,
  IonRow,
  //useIonToast,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import { UserService } from '../services/UserService';
import { ReportService } from '../services/ReportService';
import { SubscriptionService } from '../services/SubscriptionService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';

import './ProfileAthletes.scss';
import AcademicsSection, {
  AcademicData,
} from '../components/ProfileSections/AcademicsSection';
import ProfileFollowButton from '../components/ProfileFollowButton';
import HighlightsSection from '../components/ProfileSections/HighlightsSection';
import ProductList from '../components/ProductList';
import OffersSection from '../components/ProfileSections/OffersSection';
import AwardsSection from '../components/ProfileSections/AwardsSection';
import NILDealsSection from '../components/ProfileSections/NILDealsSection';
import MeasurementsSection, {
  MeasurementData,
} from '../components/ProfileSections/MeasurementsSection';
import PraiseSection from '../components/ProfileSections/PraiseSection';
import GameScheduleSection from '../components/ProfileSections/GameScheduleSection';
import ArticlesSection from '../components/ProfileSections/ArticlesSection';
import PostsSection from '../components/ProfileSections/PostsSection';
import ExperienceSection from '../components/ProfileSections/ExperienceSection';
import PersonalTrainingSection from '../components/ProfileSections/PersonalTrainingSection';
import StatsSection from '../components/ProfileSections/StatsSection';
import QrCode from '../components/QrCode';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { chevronBackOutline } from 'ionicons/icons';
import { loadingOptions } from '../util';
import { Profile } from '../data/profile';

interface ProfileAthleteProps {
  myProfile: boolean;
}

const ProfileAthletes: React.FC<ProfileAthleteProps> = (profileAthlete) => {
  const history = useHistory();
  const userService = new UserService();
  const reportService = new ReportService();
  let subscriptionService: any;
  // const subscriptionService = new SubscriptionService(new InAppPurchase2());
  let [userId, setUserId] = useState<number>(0);
  const [profileURL, setProfileURL] = useState('');
  const [presentLoading, dismissLoading] = useIonLoading();
  const profileModal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonActionSheet();
  const [presentProfileReportingActionSheet] = useIonActionSheet();
  let [athleteProfile, setAthleteProfile] =
    useState<AthleteProfile>(emptyProfile);
  const [socialData, setSocialData] = useState<any>({});
  let [fullAthleteProfile, setFullAthleteProfile] = useState<Profile>();

  const [measurementData, setMeasurementData] = useState<
    MeasurementData | undefined
  >();
  const [academicsData, setAcademicData] = useState<AcademicData | undefined>();

  const [targetSection, setTargetSection] = useState('Feed');

  const [profileItems, setProfileItems] = useState<string[]>(['assets/images/test/product.jpeg', 'assets/images/test/product.jpeg', 'assets/images/test/product.jpeg', 'assets/images/test/product.jpeg']);

  const [arrayOfSocials, setArrayOfSocials] = useState<string[]>([]);

  const [userSubscribed, setUserSubscribed] = useState(false);

  const [slides, setSlides] = useState<any[]>([
    { name: 'Feed', section: '/option', state: 'Feed' },
    { name: 'Trade', section: '/option', state: 'Trade' },
    { name: 'Purchased', section: '/option', state: 'Purchased' },
    { name: 'Review', section: '/option', state: 'Review' },
  ]);

  const isDesktop = isPlatform('desktop');
  const isMobileWeb = isPlatform('mobileweb');
  let isBrowser = isDesktop || isMobileWeb;
  if (environment.disableBrowser) {
    isBrowser = false;
  }

  useIonViewDidEnter(() => {
    reset();
    console.log('useIonViewDidEnter userId: ', userId);

    const onPageLoad = () => {
      loadProfile();

      userService.recordProfileVisit(userId, history.location);

      if (
        !environment.disableBrowser &&
        isPlatform('ios') &&
        profileAthlete.myProfile
      ) {
        subscriptionService = new SubscriptionService(new InAppPurchase2());
        subscriptionService.register();
        setUserSubscribed(
          subscriptionService.isSubscribed('com.nobo.athlete.1month')
        );
      }
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  });

  useIonViewDidLeave(() => {
    console.log('useIonViewDidLeave');
    reset();
  });

  useEffect(() => {
    if (userSubscribed && profileAthlete.myProfile) {
      setSlides([
        { name: 'Highlights', section: '/option', state: 'Highlights' },
        { name: 'Stats', section: '/option', state: 'Stats' },
        { name: 'Academics', section: '/option', state: 'Academics' },
        { name: 'Awards', section: '/option', state: 'Awards' },
        { name: 'Measurements', section: '/option', state: 'Measurements' },
        { name: 'Experience', section: '/option', state: 'Experience' },
        { name: 'Offers', section: '/option', state: 'Offers' },
        { name: 'Praise', section: '/option', state: 'Praise' },
        { name: 'Posts', section: '/option', state: 'Posts' },
        { name: 'Schedule', section: '/option', state: 'GameSchedule' },
        { name: 'Articles', section: '/option', state: 'Articles' },
        { name: 'NIL', section: '/option', state: 'NILDeals' },
        {
          name: 'Personal Training',
          section: '/option',
          state: 'PersonalTraining',
        },
      ]);
    }
  }, [userSubscribed]);

  var options = {
    subject: 'Share Athlete Profile',
    files: ['', ''],
    url: profileURL,
    chooserTitle: 'Pick an app',
    appPackageName: 'com.apple.social.facebook',
    iPadCoordinates: '0,0,0,0',
  };

  async function reportUser(reportType: string) {
    console.log('reportPost', reportType);
    let req = {
      user_id: myUserId,
      user_id_reported: userId,
      category: reportType,
    };
    await reportService.reportUser(req);
  }

  function shareProfile(result: any) {
    console.log('shareProfile', result);
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
      //subHeader: 'Subheader',
      buttons: [
        {
          text: "It's spam",
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser("It's spam");
            }, // noop
          },
        },
        {
          text: 'Nude or sexual activity',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser('Nude or sexual activity');
            }, // noop
          },
        },
        {
          text: 'Hate speech or symbols',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser('Hate speech or symbols');
            }, // noop
          },
        },
        {
          text: 'False Information',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser('False Information');
            }, // noop
          },
        },
        {
          text: "I just don't like it",
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser("I just don't like it");
            }, // noop
          },
        },
        {
          text: 'Bullying or harassment',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser('Bullying or harassment');
            }, // noop
          },
        },
        {
          text: 'Scam or fraud',
          // role: 'destructive',
          // icon: 'warning',
          data: {
            action: () => {
              reportUser('Scam or fraud');
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
          text: 'QR Code',
          who: 'all',
          data: {
            action: 'qrCode',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ].filter((b) => {
        return (
          b.who === 'all' ||
          !b.who ||
          (b.who === 'me' && profileAthlete.myProfile) ||
          (b.who === 'notme' && !profileAthlete.myProfile)
        );
      }),
      onDidDismiss: ({ detail }) => {
        if (detail.data == undefined) return;

        if (detail.data.action !== undefined) {
          shareProfile(detail.data.action);
        }
      },
    });
  }

  function reset() {
    let nonExistentID = 0;
    userId = nonExistentID;
    setUserId(nonExistentID);
    setProfileURL('');
    setAthleteProfile(emptyProfile);
    setMeasurementData(undefined);
    setAcademicData(undefined);
    setTargetSection('Feed');
    setArrayOfSocials([]);
    setSocialData({});
  }

  let storage: any = window.localStorage.getItem('persistedState');
  let user = storage ? JSON.parse(storage) : undefined;
  const myUserId = user?.user['user_id'];

  function loadProfile() {
    let addressBarPathName = history.location.pathname;
    userId = 0;

    let userIdStr: any = addressBarPathName.substring(
      addressBarPathName.lastIndexOf('/') + 1
    );
    if (isNaN(userIdStr)) {
      userIdStr = userIdStr.substring(userIdStr.lastIndexOf('-') + 1);
    }
    userId = parseInt(userIdStr);
    console.log('View User Profile: ', userId);
    console.log('myProfile value: ', profileAthlete.myProfile);

    if (
      profileAthlete.myProfile ||
      userId < 1 ||
      isNaN(userId) ||
      userId === undefined
    ) {
      console.log('myProfile : ', myUserId);
      userId = myUserId;
    }

    setUserId(userId);
    //updateActionMenu();
    getProfile(userId);
    return userId;
  }

  function updateActionMenu() {
    setProfileURL(`https://www.noboplus.com/home/athlete-profile/${userId}`);
    console.log('Profile URL: ', profileURL);
  }

  // function showMessage(message: string) {
  //   // let mess = `Connection Request Sent to ${coachProfile.fromName}`;
  //   let errColor = "primary";

  //   present({
  //     buttons: [{ handler: () => dismiss() }],
  //     message,
  //     color: errColor,
  //     duration: 5000,
  //     position: "top",
  //     onDidDismiss: () => console.log("dismissed"),
  //     onWillDismiss: () => console.log("will dismiss"),
  //   });
  // }

  function getProfile(id: number = 0) {
    if (id < 1 || isNaN(id) || id === undefined) {
      console.log('Userid not set: ', id);
      return;
    }
    console.log('GetProfile: ', id);

    presentLoading(loadingOptions);
    userService
      .getProfile(id)
      .then((res) => res.json())
      .then((data) => {
        console.log('Profile: ', data);
        if (data === null) {
          console.log('Done');
          athleteProfile = emptyProfile;
          setAthleteProfile(emptyProfile);
        } else {
          setFullAthleteProfile(data);
          let updateProfile = {
            rating: data.athlete_user_profile.rating.Int16,
            fromName:
              data.basic_user_profile.first_name.String +
              ' ' +
              data.basic_user_profile.last_name.String,
            firstName: data.basic_user_profile.first_name.String,
            lastName: data.basic_user_profile.last_name.String,
            subject: 'New event: Trip to Vegas',
            date: '9:32pm May 8, 2022',
            data: data.basic_user_profile.bio
              ? data.basic_user_profile.bio.String
              : '',
            id: data.user_id,
            school: data.basic_user_profile.school
              ? data.basic_user_profile.school.String
              : '',
            height: data.athlete_user_profile.height
              ? data.athlete_user_profile.height.String
              : '',
            weight: data.athlete_user_profile.weight
              ? data.athlete_user_profile.weight.String
              : '',
            year: data.basic_user_profile.class_year
              ? data.basic_user_profile.class_year.String
              : '',
            profilePic:
              data.basic_user_profile.profile_image?.String ||
              `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/pictures/${userId}/profile.jpeg?fail`,
            bannerPic:
              data.basic_user_profile.banner_image?.String ||
              `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/pictures/${userId}/banner.jpeg?fail`,
            sport: data.athlete_user_profile.primary_sport
              ? data.athlete_user_profile.primary_sport.String
              : '',
            position: data.athlete_user_profile.primary_position
              ? data.athlete_user_profile.primary_position.String.replace(
                  /"/g,
                  ''
                )
              : '',
            highlights: data.athlete_user_profile.highlights
              ? data.athlete_user_profile.highlights
              : [],
            stats: data.athlete_user_profile.athlete_stats?.stats2
              ? data.athlete_user_profile.athlete_stats?.stats2
              : [],
            academics: data.athlete_user_profile.athlete_academics
              ? data.athlete_user_profile.athlete_academics
              : [],
            offers: data.athlete_user_profile.athlete_offers
              ? data.athlete_user_profile.athlete_offers
              : [],
            awards: data.athlete_user_profile.athlete_awards
              ? data.athlete_user_profile.athlete_awards
              : [],
            measurements: data.athlete_user_profile.athlete_measurements
              ? data.athlete_user_profile.athlete_measurements
              : {},
            country: data.basic_user_profile.country
              ? data.basic_user_profile.country.String.replace(/"/g, '')
              : '',
            state: data.basic_user_profile.state
              ? data.basic_user_profile.state.String.replace(/"/g, '')
              : '',
            city: data.basic_user_profile.city
              ? data.basic_user_profile.city.String
              : '',
            gpa: data.athlete_user_profile.gpa
              ? data.athlete_user_profile.gpa.String
              : '',
            sat: data.athlete_user_profile.sat
              ? data.athlete_user_profile.sat.String
              : '',
            act: data.athlete_user_profile.act
              ? data.athlete_user_profile.act.String
              : '',
            extraCurriculars: data.athlete_user_profile.extra_curriculars
              ? data.athlete_user_profile.extra_curriculars
              : [],
            socialLinks: data.athlete_user_profile.social_links
              ? data.athlete_user_profile.social_links.String.replace(
                  '{',
                  ''
                ).replace('}', '')
              : '',
            otherSports: data.athlete_user_profile.other_sports
              ? data.athlete_user_profile.other_sports
              : [],
            experiences: data.athlete_user_profile.athlete_experiences
              ? data.athlete_user_profile.athlete_experiences
              : [],
          };
          let listOfSocials = updateProfile.socialLinks.split(',');
          console.log('Socials: ', listOfSocials);
          !profileAthlete.myProfile &&
            setUserSubscribed(data.is_premium?.String === 'true');
          setArrayOfSocials(listOfSocials);
          athleteProfile = updateProfile;
          setAthleteProfile(updateProfile);
          setMeasurementData(data?.athlete_user_profile?.athlete_measurements);
          setAcademicData({
            gpa: data?.athlete_user_profile?.gpa?.String,
            sat: data?.athlete_user_profile?.sat?.String,
            act: data?.athlete_user_profile?.act?.String,
            extracurriculars: data?.athlete_user_profile?.extra_curriculars,
          });
          setSocialData(data?.social_data);

          updateActionMenu();

          if (!profileAthlete.myProfile) {
            let nextURL = `https://www.noboplus.com/home/athlete-profile/${data.basic_user_profile.first_name.String}-${data.basic_user_profile.last_name.String}-${id}`;
            if (window.location.origin.includes('localhost')) {
              nextURL = `http://localhost:3000/home/athlete-profile/${data.basic_user_profile.first_name.String}-${data.basic_user_profile.last_name.String}-${id}`;
            }
            const nextTitle = 'URP+ Athlete Profile';
            // document.title = `${data.basic_user_profile.first_name.String} ${data.basic_user_profile.last_name.String} | URP+ `
            const nextState = { additionalInformation: 'URP+ Athlete Profile' };
            window.history.replaceState(nextState, nextTitle, nextURL);
          }
        }
        dismissLoading();
      })
      .catch(() => {
        dismissLoading();
      });
  }

  return (
    <IonPage className="home-page-athlete-profile" style={{ backgroundColor: '#F9FBFB' }}>
    <IonContent className="athlete-profile-content" scrollY={true}>
      {!isBrowser && !profileAthlete.myProfile && (
        <IonButtons
          style={{
            position: "absolute",
            left: "1.5rem",
            top: "3rem",
            color: "white",
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
            <QrCode value={profileURL} name={athleteProfile.fromName}></QrCode>
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
          style={{ backgroundImage: `url(${athleteProfile.bannerPic})` }}
        ></div>
        {profileAthlete.myProfile && (
          <IonButton
            onClick={(e) => {
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
        <div className="profile-bubble-container">
          <img
            className={`profile-bubble ${
              userSubscribed && 'profile-bubble-premium-border'
            }`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = '../../assets/images/urp-default-banner.png';
            }}
            src={athleteProfile.profilePic}
            alt="avatar"
          />
        </div>
        <ProfileSummary
          profile={athleteProfile}
          openSocialShare={openShare}
        ></ProfileSummary>

        <IonRow className="nobo-menu-container">
          <div className="nobo-menu-circle" onClick={ () => setTargetSection('Feed')}>
            <div className="circle-background">
              <img className={targetSection === 'Feed' ? 'nobo-profile-menu-selected' : ''} src="assets/images/navigation/nav-profile-items.svg"/>
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={ () => setTargetSection('Trades')}>
            <div className="circle-background">
              <img className={targetSection === 'Trades' ? 'nobo-profile-menu-selected' : ''} src="assets/images/navigation/nav-trade.svg"/>
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={ () => setTargetSection('Purchase')}>
            <div className="circle-background">
              <img className={targetSection === 'Purchase' ? 'nobo-profile-menu-selected' : ''} src="assets/images/navigation/nav-profile-purchased.svg"/>
            </div>
          </div>
          <div className="nobo-menu-circle" onClick={ () => setTargetSection('Reviews')}>
            <div className="circle-background">
              <img className={targetSection === 'Reviews' ? 'nobo-profile-menu-selected' : ''} src="assets/images/navigation/nav-profile-reviews.svg"/>
            </div>
          </div>
        </IonRow>
        {targetSection === 'Feed' && (
          <ProductList type="" images={profileItems}></ProductList>
        )}
        {targetSection === 'Trades' && (
          <ProductList type="trades" images={profileItems}></ProductList>
        )}
        {targetSection === 'Purchase' && (
          <ProductList type="purchase" images={profileItems}></ProductList>
        )}
        {targetSection === 'Reviews' && (
          /*<ReviewList images={profileItems}></ReviewList*/
          <p>Reviews</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfileAthletes;
