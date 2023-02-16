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

  const [targetSection, setTargetSection] = useState('Highlights');

  const [arrayOfSocials, setArrayOfSocials] = useState<string[]>([]);

  const [userSubscribed, setUserSubscribed] = useState(false);

  const [slides, setSlides] = useState<any[]>([
    { name: 'Highlights', section: '/option', state: 'Highlights' },
    { name: 'Stats', section: '/option', state: 'Stats' },
    { name: 'Academics', section: '/option', state: 'Academics' },
    { name: 'Awards', section: '/option', state: 'Awards' },
    { name: 'Measurements', section: '/option', state: 'Measurements' },
    { name: 'Experience', section: '/option', state: 'Experience' },
    { name: 'Offers', section: '/option', state: 'Offers' },

    { name: 'Praise', section: '/option', state: 'Praise' },
    { name: 'Posts', section: '/option', state: 'Posts' },
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
    setTargetSection('Highlights');
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
    <IonContent className="athlete-profile-content" scrollY={false}>
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
        <div className="profile-bubble-container">
          <img
            className={`profile-bubble ${
              userSubscribed && 'profile-bubble-premium-border'
            }`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = '../../assets/images/nobo-default-banner.png';
            }}
            src={athleteProfile.profilePic}
            alt="avatar"
          />
        </div>
        <ProfileSummary
          profile={athleteProfile}
          openSocialShare={openShare}
        ></ProfileSummary>
        <div className="profile-action-social">
          <div>
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
                Edit Profile
              </IonButton>
            )}
            {!isBrowser && myUserId !== athleteProfile.id && (
              <ProfileFollowButton
                userId={athleteProfile.id}
                data={socialData}
                athleteProfile={fullAthleteProfile}
              />
            )}
          </div>

          <div>
            <div className="nobo-social-tops">
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('247sports.com') && (
                  <Sports247Icon
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[4],
                        '_blank',
                        'location=yes'
                      )
                    }
                  />
                )}
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('hudl.com') && (
                  <HudleIcon
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[3],
                        '_blank',
                        'location=yes'
                      )
                    }
                  />
                )}
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('rivals.com') && (
                  <RivalsIcon
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[5],
                        '_blank',
                        'location=yes'
                      )
                    }
                  />
                )}
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('maxpreps.com') && (
                  <MaxPrepsIcon
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[6],
                        '_blank',
                        'location=yes'
                      )
                    }
                  />
                )}
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('instagram.com') && (
                  <svg
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[0],
                        '_blank',
                        'location=yes'
                      )
                    }
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.50167 3.65419C5.3734 3.65419 3.65672 5.37125 3.65672 7.5C3.65672 9.62875 5.3734 11.3458 7.50167 11.3458C9.62995 11.3458 11.3466 9.62875 11.3466 7.5C11.3466 5.37125 9.62995 3.65419 7.50167 3.65419ZM7.50167 10.0003C6.12633 10.0003 5.00195 8.879 5.00195 7.5C5.00195 6.121 6.12298 4.99972 7.50167 4.99972C8.88037 4.99972 10.0014 6.121 10.0014 7.5C10.0014 8.879 8.87702 10.0003 7.50167 10.0003ZM12.4007 3.49688C12.4007 3.99559 11.9992 4.3939 11.5039 4.3939C11.0053 4.3939 10.6071 3.99225 10.6071 3.49688C10.6071 3.00151 11.0086 2.59985 11.5039 2.59985C11.9992 2.59985 12.4007 3.00151 12.4007 3.49688ZM14.9473 4.40729C14.8904 3.20568 14.616 2.1413 13.7359 1.26436C12.8592 0.387426 11.795 0.112964 10.5937 0.0527167C9.35555 -0.0175722 5.64445 -0.0175722 4.4063 0.0527167C3.20831 0.109617 2.14417 0.384079 1.26408 1.26102C0.383993 2.13796 0.112939 3.20233 0.052705 4.40394C-0.0175683 5.64236 -0.0175683 9.35429 0.052705 10.5927C0.109593 11.7943 0.383993 12.8587 1.26408 13.7356C2.14417 14.6126 3.20496 14.887 4.4063 14.9473C5.64445 15.0176 9.35555 15.0176 10.5937 14.9473C11.795 14.8904 12.8592 14.6159 13.7359 13.7356C14.6127 12.8587 14.8871 11.7943 14.9473 10.5927C15.0176 9.35429 15.0176 5.64571 14.9473 4.40729ZM13.3477 11.9215C13.0867 12.5775 12.5814 13.083 11.9222 13.3474C10.935 13.739 8.59258 13.6486 7.50167 13.6486C6.41076 13.6486 4.06497 13.7356 3.08115 13.3474C2.42526 13.0863 1.91997 12.5809 1.65561 11.9215C1.26408 10.9341 1.35443 8.59115 1.35443 7.5C1.35443 6.40885 1.26743 4.06253 1.65561 3.07849C1.91662 2.42246 2.42192 1.91705 3.08115 1.65263C4.06832 1.26102 6.41076 1.35139 7.50167 1.35139C8.59258 1.35139 10.9384 1.26436 11.9222 1.65263C12.5781 1.9137 13.0834 2.41911 13.3477 3.07849C13.7393 4.06588 13.6489 6.40885 13.6489 7.5C13.6489 8.59115 13.7393 10.9375 13.3477 11.9215Z"
                      fill="#1A3A35"
                    />
                  </svg>
                )}
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('twitter.com') && (
                  <svg
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[1],
                        '_blank',
                        'location=yes'
                      )
                    }
                    width="19"
                    height="15"
                    viewBox="0 0 19 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5703 3.73827C16.582 3.90232 16.582 4.06641 16.582 4.23047C16.582 9.23435 12.7735 15 5.81251 15C3.66796 15 1.67579 14.3789 0 13.3008C0.304699 13.3359 0.597638 13.3477 0.91406 13.3477C2.68356 13.3477 4.31249 12.75 5.61328 11.7305C3.94922 11.6953 2.55468 10.6055 2.0742 9.10547C2.3086 9.1406 2.54296 9.16405 2.78907 9.16405C3.12891 9.16405 3.46878 9.11715 3.78516 9.03516C2.05079 8.68357 0.749969 7.16015 0.749969 5.32031V5.27345C1.25386 5.5547 1.83984 5.73048 2.46089 5.75389C1.44136 5.07419 0.773416 3.91405 0.773416 2.60154C0.773416 1.89842 0.960881 1.25389 1.28903 0.691389C3.15232 2.98826 5.95311 4.48824 9.09371 4.65233C9.03513 4.37108 8.99996 4.07814 8.99996 3.78516C8.99996 1.6992 10.6875 0 12.7851 0C13.875 0 14.8593 0.45703 15.5507 1.19531C16.4062 1.03126 17.2265 0.714835 17.9531 0.281252C17.6718 1.16018 17.0742 1.89846 16.289 2.36718C17.0508 2.28519 17.789 2.0742 18.4687 1.78126C17.9532 2.53123 17.3086 3.19917 16.5703 3.73827Z"
                      fill="#1A3A35"
                    />
                  </svg>
                )}
              {athleteProfile.socialLinks &&
                athleteProfile.socialLinks.includes('tiktok.com') && (
                  <svg
                    onClick={(e) =>
                      InAppBrowser.create(
                        arrayOfSocials[2],
                        '_blank',
                        'location=yes'
                      )
                    }
                    style={{ marginLeft: '7px' }}
                    width="13"
                    height="15"
                    viewBox="0 0 13 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 6.16651C11.6713 6.16651 10.4395 5.73899 9.43444 5.01271V10.2536C9.43444 12.8712 7.31809 15 4.71722 15C3.71216 15 2.77977 14.6812 2.01386 14.14C0.797592 13.2806 0 11.8592 0 10.2536C0 7.63594 2.11635 5.50648 4.71784 5.50648C4.93401 5.50648 5.14521 5.52461 5.35331 5.55273V6.16338V8.18534C5.15205 8.12221 4.9396 8.08534 4.71784 8.08534C3.53015 8.08534 2.5636 9.05788 2.5636 10.2536C2.5636 11.0861 3.03321 11.8092 3.71899 12.1724C4.01778 12.3305 4.35756 12.4211 4.71846 12.4211C5.87882 12.4211 6.8255 11.4924 6.86898 10.3348L6.87084 0H9.43382C9.43382 0.223759 9.45556 0.441893 9.49407 0.654402C9.67484 1.63694 10.2544 2.4801 11.0576 3.007C11.6166 3.37389 12.2838 3.58827 12.9994 3.58827V6.16651H13Z"
                      fill="#1A3A35"
                    />
                  </svg>
                )}
            </div>
          </div>
        </div>

        <div className="nobo-menu-container">
          <div className="nobo-menu-container-shadow">
            <Swiper
              spaceBetween={1}
              slidesPerView={4}
              centeredSlides={false}
              observer={true}
              width={340}
            >
              {slides.map((s) => (
                <SwiperSlide
                  onClick={() => {
                    if (s.name === '') {
                    } else {
                      setTargetSection(s.state);
                    }
                  }}
                  className={'noselect explore-sports-slide'}
                  key={s.name}
                  data-path={s.section}
                >
                  <span
                    className={
                      'nobo-tab-menu-item ' +
                      (targetSection === s.state ? 'selected' : '')
                    }
                  >
                    {s.name}
                  </span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {targetSection === 'Highlights' && (
          <HighlightsSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll nobo-highlight-video-container"
            data={{ title: 'Highlights Title' }}
            highlights={athleteProfile.highlights}
            myProfile={profileAthlete.myProfile}
            athleteProfile={athleteProfile}
            isPremium={userSubscribed}
          ></HighlightsSection>
        )}
        {targetSection === 'Stats' && (
          <StatsSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            profile={athleteProfile}
            myProfile={profileAthlete.myProfile}
          ></StatsSection>
        )}
        {targetSection === 'Academics' && (
          <AcademicsSection
            userId={userId}
            className="nobo-academics-section nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Academic Title' }}
            academicData={academicsData}
            myProfile={profileAthlete.myProfile}
          ></AcademicsSection>
        )}
        {targetSection === 'Offers' && (
          <OffersSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Offers Title' }}
            offers={athleteProfile.offers}
            myProfile={profileAthlete.myProfile}
          ></OffersSection>
        )}
        {targetSection === 'Awards' && (
          <AwardsSection
            userId={userId}
            className="nobo-awards-section nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Awards Title' }}
            awardsString={athleteProfile.awards}
            myProfile={profileAthlete.myProfile}
          ></AwardsSection>
        )}
        {targetSection === 'Measurements' && (
          <MeasurementsSection
            userId={userId}
            className="nobo-measurement-section nobo-profile-section nobo-profile-section-scroll"
            measurementData={measurementData}
            data={{ title: 'Measurements Title' }}
            myProfile={profileAthlete.myProfile}
          ></MeasurementsSection>
        )}
        {targetSection === 'Experience' && (
          <ExperienceSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Experience Title' }}
            sport={athleteProfile.sport}
            experiencesString={athleteProfile.experiences}
            myProfile={profileAthlete.myProfile}
          ></ExperienceSection>
        )}
        {targetSection === 'Praise' && (
          <PraiseSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Praise Title' }}
            myProfile={profileAthlete.myProfile}
          ></PraiseSection>
        )}
        {targetSection === 'Posts' && (
          <PostsSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Posts Title' }}
            myProfile={profileAthlete.myProfile}
            userType="athlete"
          ></PostsSection>
        )}
        {targetSection === 'GameSchedule' && (
          <GameScheduleSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            profile={athleteProfile}
            myProfile={profileAthlete.myProfile}
          ></GameScheduleSection>
        )}
        {targetSection === 'Articles' && (
          <ArticlesSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Articles Title' }}
            myProfile={profileAthlete.myProfile}
            userType="athlete"
          ></ArticlesSection>
        )}
        {targetSection === 'NILDeals' && (
          <NILDealsSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'NIL Deals Title' }}
            myProfile={profileAthlete.myProfile}
            userType="athlete"
          ></NILDealsSection>
        )}
        {targetSection === 'PersonalTraining' && (
          <PersonalTrainingSection
            userId={userId}
            className="nobo-profile-section nobo-profile-section-scroll"
            data={{ title: 'Personal Training Title' }}
            myProfile={profileAthlete.myProfile}
            userType="athlete"
          ></PersonalTrainingSection>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfileAthletes;
