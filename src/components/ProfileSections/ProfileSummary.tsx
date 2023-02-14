import { IonItem, IonRow, IonCol, IonGrid, isPlatform } from '@ionic/react';
import './ProfileSummary.scss';
import { useEffect, useState } from 'react';
import { AthleteProfile } from '../../data/athlete-detail';
import ProfileActionMenu, { ActionListItem } from '../ProfileActionMenu';

interface ProfileSummaryProps {
  profile: AthleteProfile;
  openSocialShare: Function;
}
const previewCharLen = 160;
const FeedListItem: React.FC<ProfileSummaryProps> = ({
  profile,
  openSocialShare,
}) => {
  const [previewMode, setPreviewMode] = useState(true);
  const [myProfile, setMyProfile] = useState<AthleteProfile>(profile);

  useEffect(() => {
    setMyProfile(profile);
  }, [profile]);

  const renderSportBadge = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football':
        return (
          <img
            alt="football"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-football.svg"
          />
        );
      case 'wbasketball':
        return (
          <img
            alt="basketball"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-basketball.svg"
          />
        );
      case 'mbasketball':
        return (
          <img
            alt="basketball"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-basketball.svg"
          />
        );
      case 'baseball':
        return (
          <img
            alt="baseball"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-softball.svg"
          />
        );
      case 'msoccer':
        return (
          <img
            alt="soccer"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-soccer.svg"
          />
        );
      case 'wsoccer':
        return (
          <img
            alt="soccer"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-soccer.svg"
          />
        );
      case 'mvolleyball':
        return (
          <img
            alt="volleyball"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-volleyball.svg"
          />
        );
      case 'wvolleyball':
        return (
          <img
            alt="volleyball"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-volleyball.svg"
          />
        );
      case 'wlacrosse':
        return (
          <img
            alt="lacrosse"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-lacrosse.svg"
          />
        );
      case 'mlacrosse':
        return (
          <img
            alt="lacrosse"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-lacrosse.svg"
          />
        );
      case 'softball':
        return (
          <img
            alt="softball"
            style={{ height: '1.3rem' }}
            className="logo-image"
            src="assets/images/urp-badge-softball.svg"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={
        'profile-summary-athlete ' + (isPlatform('desktop') ? 'desktop' : '')
      }
    >
      {!isPlatform('desktop') ? (
        <IonGrid className="mobile-only stats-grid">
          <IonRow style={{ maxHeight: '48px' }}>
            <IonCol offset="3" size="7" className="profile-name">
              <div>{myProfile.fromName}</div>
              <div style={{ paddingTop: '8px' }} className="urp-location-pin">
                <svg
                  width="9"
                  height="13"
                  viewBox="0 0 9 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.03753 12.4151C0.632109 7.47826 0 6.97159 0 5.15723C0 2.67194 2.01471 0.657227 4.5 0.657227C6.98529 0.657227 9 2.67194 9 5.15723C9 6.97159 8.36789 7.47826 4.96247 12.4151C4.73899 12.7379 4.26098 12.7379 4.03753 12.4151ZM4.5 7.03223C5.53554 7.03223 6.375 6.19276 6.375 5.15723C6.375 4.12169 5.53554 3.28223 4.5 3.28223C3.46446 3.28223 2.625 4.12169 2.625 5.15723C2.625 6.19276 3.46446 7.03223 4.5 7.03223Z"
                    fill="#3C91E6"
                  />
                </svg>
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {myProfile.country}
                </div>
              </div>
              {/* <div>
                <svg
                  width="100"
                  height="30"
                  viewBox="0 0 101 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {myProfile.rating > 0 && (
                    <path
                      d="M7.69195 1.70133C7.82918 1.21608 8.51698 1.21608 8.65421 1.70133L9.90513 6.12472C9.96602 6.34002 10.1625 6.48866 10.3863 6.48866H14.5669C15.0344 6.48866 15.2462 7.07295 14.8874 7.3725L11.3911 10.291C11.2396 10.4175 11.1767 10.6211 11.2304 10.8109L12.5369 15.4311C12.6708 15.9043 12.1129 16.2661 11.7354 15.951L8.4935 13.2448C8.30796 13.0899 8.0382 13.0899 7.85266 13.2448L4.61076 15.951C4.23329 16.2661 3.67541 15.9043 3.80922 15.4311L5.11578 10.8109C5.16947 10.6211 5.10651 10.4175 4.95507 10.291L1.45881 7.3725C1.09997 7.07295 1.31179 6.48866 1.77923 6.48866H5.9599C6.18364 6.48866 6.38014 6.34002 6.44103 6.12472L7.69195 1.70133Z"
                      fill="#00D6B6"
                    />
                  )}
                  {myProfile?.rating > 1 && (
                    <path
                      d="M28.8458 1.70133C28.983 1.21608 29.6708 1.21608 29.808 1.70133L31.0589 6.12472C31.1198 6.34002 31.3163 6.48866 31.5401 6.48866H35.7207C36.1882 6.48866 36.4 7.07295 36.0411 7.3725L32.5449 10.291C32.3934 10.4175 32.3305 10.6211 32.3842 10.8109L33.6907 15.4311C33.8245 15.9043 33.2667 16.2661 32.8892 15.951L29.6473 13.2448C29.4618 13.0899 29.192 13.0899 29.0065 13.2448L25.7646 15.951C25.3871 16.2661 24.8292 15.9043 24.963 15.4311L26.2696 10.8109C26.3233 10.6211 26.2603 10.4175 26.1089 10.291L22.6126 7.3725C22.2538 7.07295 22.4656 6.48866 22.933 6.48866H27.1137C27.3374 6.48866 27.5339 6.34002 27.5948 6.12472L28.8458 1.70133Z"
                      fill="#00D6B6"
                    />
                  )}
                  {myProfile?.rating > 2 && (
                    <path
                      d="M49.9996 1.70133C50.1368 1.21608 50.8246 1.21608 50.9618 1.70133L52.2127 6.12472C52.2736 6.34002 52.4701 6.48866 52.6939 6.48866H56.8746C57.342 6.48866 57.5538 7.07295 57.195 7.3725L53.6987 10.291C53.5473 10.4175 53.4843 10.6211 53.538 10.8109L54.8446 15.4311C54.9784 15.9043 54.4205 16.2661 54.043 15.951L50.8011 13.2448C50.6156 13.0899 50.3458 13.0899 50.1603 13.2448L46.9184 15.951C46.5409 16.2661 45.983 15.9043 46.1168 15.4311L47.4234 10.8109C47.4771 10.6211 47.4141 10.4175 47.2627 10.291L43.7664 7.3725C43.4076 7.07295 43.6194 6.48866 44.0868 6.48866H48.2675C48.4913 6.48866 48.6878 6.34002 48.7486 6.12472L49.9996 1.70133Z"
                      fill="#00D6B6"
                    />
                  )}
                  {myProfile?.rating > 3 && (
                    <path
                      d="M71.1534 1.70133C71.2906 1.21608 71.9784 1.21608 72.1156 1.70133L73.3665 6.12472C73.4274 6.34002 73.6239 6.48866 73.8477 6.48866H78.0283C78.4958 6.48866 78.7076 7.07295 78.3488 7.3725L74.8525 10.291C74.7011 10.4175 74.6381 10.6211 74.6918 10.8109L75.9984 15.4311C76.1322 15.9043 75.5743 16.2661 75.1968 15.951L71.9549 13.2448C71.7694 13.0899 71.4996 13.0899 71.3141 13.2448L68.0722 15.951C67.6947 16.2661 67.1368 15.9043 67.2706 15.4311L68.5772 10.8109C68.6309 10.6211 68.5679 10.4175 68.4165 10.291L64.9202 7.3725C64.5614 7.07295 64.7732 6.48866 65.2407 6.48866H69.4213C69.6451 6.48866 69.8416 6.34002 69.9024 6.12472L71.1534 1.70133Z"
                      fill="#00D6B6"
                    />
                  )}
                  {myProfile?.rating > 4 && (
                    <path
                      d="M92.3072 1.70133C92.4444 1.21608 93.1322 1.21608 93.2694 1.70133L94.5204 6.12472C94.5812 6.34002 94.7777 6.48866 95.0015 6.48866H99.1822C99.6496 6.48866 99.8614 7.07295 99.5026 7.3725L96.0063 10.291C95.8549 10.4175 95.7919 10.6211 95.8456 10.8109L97.1522 15.4311C97.286 15.9043 96.7281 16.2661 96.3506 15.951L93.1087 13.2448C92.9232 13.0899 92.6534 13.0899 92.4679 13.2448L89.226 15.951C88.8485 16.2661 88.2906 15.9043 88.4244 15.4311L89.731 10.8109C89.7847 10.6211 89.7217 10.4175 89.5703 10.291L86.074 7.3725C85.7152 7.07295 85.927 6.48866 86.3945 6.48866H90.5751C90.7989 6.48866 90.9954 6.34002 91.0563 6.12472L92.3072 1.70133Z"
                      fill="#00D6B6"
                    />
                  )}
                </svg>
              </div> */}
            </IonCol>
            <IonCol size="2">
              <ProfileActionMenu openSocialShare={openSocialShare} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-no-padding" offset="3" size="0">
              {/*<p className="urp-active-time">Active 2hrs ago</p>*/}
            </IonCol>
            <IonCol class="ion-no-padding">
              <div className="urp-location-pin">
                {/* <svg
                  width="9"
                  height="13"
                  viewBox="0 0 9 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.03753 12.4151C0.632109 7.47826 0 6.97159 0 5.15723C0 2.67194 2.01471 0.657227 4.5 0.657227C6.98529 0.657227 9 2.67194 9 5.15723C9 6.97159 8.36789 7.47826 4.96247 12.4151C4.73899 12.7379 4.26098 12.7379 4.03753 12.4151ZM4.5 7.03223C5.53554 7.03223 6.375 6.19276 6.375 5.15723C6.375 4.12169 5.53554 3.28223 4.5 3.28223C3.46446 3.28223 2.625 4.12169 2.625 5.15723C2.625 6.19276 3.46446 7.03223 4.5 7.03223Z"
                    fill="#3C91E6"
                  />
                </svg>
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {myProfile.country}
                </div> */}
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-no-padding" offset="3" size="7">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    color: '#00D6B6',
                    fontSize: '12px',
                    position: 'relative',
                    top: '-2px',
                  }}
                >
                  {myProfile.rating > 0 && myProfile.rating}
                </div>
                <div style={{ paddingLeft: '4px' }}>
                  <svg
                    width="100"
                    height="30"
                    viewBox="0 0 101 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {myProfile.rating > 0 && (
                      <path
                        d="M7.69195 1.70133C7.82918 1.21608 8.51698 1.21608 8.65421 1.70133L9.90513 6.12472C9.96602 6.34002 10.1625 6.48866 10.3863 6.48866H14.5669C15.0344 6.48866 15.2462 7.07295 14.8874 7.3725L11.3911 10.291C11.2396 10.4175 11.1767 10.6211 11.2304 10.8109L12.5369 15.4311C12.6708 15.9043 12.1129 16.2661 11.7354 15.951L8.4935 13.2448C8.30796 13.0899 8.0382 13.0899 7.85266 13.2448L4.61076 15.951C4.23329 16.2661 3.67541 15.9043 3.80922 15.4311L5.11578 10.8109C5.16947 10.6211 5.10651 10.4175 4.95507 10.291L1.45881 7.3725C1.09997 7.07295 1.31179 6.48866 1.77923 6.48866H5.9599C6.18364 6.48866 6.38014 6.34002 6.44103 6.12472L7.69195 1.70133Z"
                        fill="#00D6B6"
                      />
                    )}
                    {/* {myProfile?.rating > 1 && (
                  <path
                    d="M28.8458 1.70133C28.983 1.21608 29.6708 1.21608 29.808 1.70133L31.0589 6.12472C31.1198 6.34002 31.3163 6.48866 31.5401 6.48866H35.7207C36.1882 6.48866 36.4 7.07295 36.0411 7.3725L32.5449 10.291C32.3934 10.4175 32.3305 10.6211 32.3842 10.8109L33.6907 15.4311C33.8245 15.9043 33.2667 16.2661 32.8892 15.951L29.6473 13.2448C29.4618 13.0899 29.192 13.0899 29.0065 13.2448L25.7646 15.951C25.3871 16.2661 24.8292 15.9043 24.963 15.4311L26.2696 10.8109C26.3233 10.6211 26.2603 10.4175 26.1089 10.291L22.6126 7.3725C22.2538 7.07295 22.4656 6.48866 22.933 6.48866H27.1137C27.3374 6.48866 27.5339 6.34002 27.5948 6.12472L28.8458 1.70133Z"
                    fill="#00D6B6"
                  />
                )}
                {myProfile?.rating > 2 && (
                  <path
                    d="M49.9996 1.70133C50.1368 1.21608 50.8246 1.21608 50.9618 1.70133L52.2127 6.12472C52.2736 6.34002 52.4701 6.48866 52.6939 6.48866H56.8746C57.342 6.48866 57.5538 7.07295 57.195 7.3725L53.6987 10.291C53.5473 10.4175 53.4843 10.6211 53.538 10.8109L54.8446 15.4311C54.9784 15.9043 54.4205 16.2661 54.043 15.951L50.8011 13.2448C50.6156 13.0899 50.3458 13.0899 50.1603 13.2448L46.9184 15.951C46.5409 16.2661 45.983 15.9043 46.1168 15.4311L47.4234 10.8109C47.4771 10.6211 47.4141 10.4175 47.2627 10.291L43.7664 7.3725C43.4076 7.07295 43.6194 6.48866 44.0868 6.48866H48.2675C48.4913 6.48866 48.6878 6.34002 48.7486 6.12472L49.9996 1.70133Z"
                    fill="#00D6B6"
                  />
                )}
                {myProfile?.rating > 3 && (
                  <path
                    d="M71.1534 1.70133C71.2906 1.21608 71.9784 1.21608 72.1156 1.70133L73.3665 6.12472C73.4274 6.34002 73.6239 6.48866 73.8477 6.48866H78.0283C78.4958 6.48866 78.7076 7.07295 78.3488 7.3725L74.8525 10.291C74.7011 10.4175 74.6381 10.6211 74.6918 10.8109L75.9984 15.4311C76.1322 15.9043 75.5743 16.2661 75.1968 15.951L71.9549 13.2448C71.7694 13.0899 71.4996 13.0899 71.3141 13.2448L68.0722 15.951C67.6947 16.2661 67.1368 15.9043 67.2706 15.4311L68.5772 10.8109C68.6309 10.6211 68.5679 10.4175 68.4165 10.291L64.9202 7.3725C64.5614 7.07295 64.7732 6.48866 65.2407 6.48866H69.4213C69.6451 6.48866 69.8416 6.34002 69.9024 6.12472L71.1534 1.70133Z"
                    fill="#00D6B6"
                  />
                )}
                {myProfile?.rating > 4 && (
                  <path
                    d="M92.3072 1.70133C92.4444 1.21608 93.1322 1.21608 93.2694 1.70133L94.5204 6.12472C94.5812 6.34002 94.7777 6.48866 95.0015 6.48866H99.1822C99.6496 6.48866 99.8614 7.07295 99.5026 7.3725L96.0063 10.291C95.8549 10.4175 95.7919 10.6211 95.8456 10.8109L97.1522 15.4311C97.286 15.9043 96.7281 16.2661 96.3506 15.951L93.1087 13.2448C92.9232 13.0899 92.6534 13.0899 92.4679 13.2448L89.226 15.951C88.8485 16.2661 88.2906 15.9043 88.4244 15.4311L89.731 10.8109C89.7847 10.6211 89.7217 10.4175 89.5703 10.291L86.074 7.3725C85.7152 7.07295 85.927 6.48866 86.3945 6.48866H90.5751C90.7989 6.48866 90.9954 6.34002 91.0563 6.12472L92.3072 1.70133Z"
                    fill="#00D6B6"
                  />
                )} */}
                  </svg>
                </div>
              </div>
            </IonCol>
            <IonCol>
              <span className="urp-horizontal-badge-overlap">
                <span className="urp-main-badge">
                  {renderSportBadge(myProfile.sport)}
                </span>
                {myProfile.otherSports &&
                  myProfile.otherSports.map((sport) => {
                    return (
                      <span key={sport} className="urp-badge">
                        <img
                          alt={sport}
                          style={{ height: '1.3rem' }}
                          className="logo-image"
                          src={`assets/images/urp-badge-${sport}.svg`}
                        />
                      </span>
                    );
                  })}
              </span>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-wrap urp-profile-summary-row urp-profile-stats-top">
            <IonCol className="profile-summary-padding" size="12">
              <IonGrid className="stats-grid-inner">
                <IonRow>
                  <IonCol size="2">
                    <div className="urp-profile-stats-header">POS</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.position}
                    </div>
                  </IonCol>
                  <IonCol size="2">
                    <div className="urp-profile-stats-header">HEIGHT</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.height}
                    </div>
                  </IonCol>
                  <IonCol size="2">
                    <div className="urp-profile-stats-header">WEIGHT</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.weight +
                        ((myProfile?.weight || '').endsWith('lbs')
                          ? ''
                          : ' lbs')}
                    </div>
                  </IonCol>
                  <IonCol size="2">
                    <div className="urp-profile-stats-header">CLASS</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.year}
                    </div>
                  </IonCol>
                  <IonCol size="2">
                    <div className="urp-profile-stats-header">SCHOOL</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.school}
                    </div>
                  </IonCol>
                  <IonCol size="2">
                    <div className="urp-profile-stats-header">CITY</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.city}
                    </div>
                  </IonCol>
                </IonRow>
                {myProfile.data ? (
                  <IonRow>
                    <IonCol>
                      <div
                        className="urp-profile-bio"
                        style={{ textAlign: 'left', paddingLeft: '6px' }}
                      >
                        {myProfile.data.length > previewCharLen && previewMode
                          ? myProfile.data.substring(0, previewCharLen) + '...'
                          : myProfile.data}
                        <div
                          className="urp-more-arrow"
                          style={{
                            width: '80vw',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewMode(!previewMode);
                          }}
                        >
                          {previewMode &&
                            myProfile.data.length > previewCharLen && (
                              <svg
                                width="11"
                                height="6"
                                viewBox="0 0 11 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.79214 5.88906L10.8788 1.26908C11.0404 1.12116 11.0404 0.881983 10.8788 0.734068L10.1983 0.110936C10.0368 -0.0369787 9.77558 -0.0369787 9.61404 0.110936L5.5 3.84028L1.38595 0.110936C1.22442 -0.0369787 0.963208 -0.0369787 0.801671 0.110936L0.121152 0.734068C-0.0403852 0.881983 -0.0403852 1.12116 0.121152 1.26908L5.20786 5.88906C5.3694 6.03698 5.6306 6.03698 5.79214 5.88906Z"
                                  fill="#00816D"
                                />
                              </svg>
                            )}

                          {!previewMode && (
                            <svg
                              width="11"
                              height="7"
                              viewBox="0 0 11 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.20786 0.129426L0.121153 5.51941C-0.0403843 5.69197 -0.0403843 5.97102 0.121153 6.14359L0.801672 6.87057C0.963209 7.04314 1.22442 7.04314 1.38596 6.87057L5.5 2.51967L9.61405 6.87057C9.77558 7.04314 10.0368 7.04314 10.1983 6.87057L10.8788 6.14359C11.0404 5.97102 11.0404 5.69197 10.8788 5.51941L5.79214 0.129426C5.6306 -0.0431419 5.3694 -0.0431419 5.20786 0.129426Z"
                                fill="#00816D"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                ) : (
                  ''
                )}
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      ) : (
        <div className="desktop-only">
          <div className="name-location">
            <div className="name">{myProfile.fromName}</div>
            <div className="location">
              {/*<p className="urp-active-time">Active 2hrs ago</p>*/}
              <div style={{ paddingTop: '8px' }} className="urp-location-pin">
                <svg
                  width="9"
                  height="13"
                  viewBox="0 0 9 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.03753 12.4151C0.632109 7.47826 0 6.97159 0 5.15723C0 2.67194 2.01471 0.657227 4.5 0.657227C6.98529 0.657227 9 2.67194 9 5.15723C9 6.97159 8.36789 7.47826 4.96247 12.4151C4.73899 12.7379 4.26098 12.7379 4.03753 12.4151ZM4.5 7.03223C5.53554 7.03223 6.375 6.19276 6.375 5.15723C6.375 4.12169 5.53554 3.28223 4.5 3.28223C3.46446 3.28223 2.625 4.12169 2.625 5.15723C2.625 6.19276 3.46446 7.03223 4.5 7.03223Z"
                    fill="#3C91E6"
                  />
                </svg>
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {myProfile.country}
                </div>
              </div>
            </div>
          </div>
          <div className="rating">
            <svg
              width="100"
              height="30"
              viewBox="0 0 101 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {myProfile.rating > 0 && (
                <path
                  d="M7.69195 1.70133C7.82918 1.21608 8.51698 1.21608 8.65421 1.70133L9.90513 6.12472C9.96602 6.34002 10.1625 6.48866 10.3863 6.48866H14.5669C15.0344 6.48866 15.2462 7.07295 14.8874 7.3725L11.3911 10.291C11.2396 10.4175 11.1767 10.6211 11.2304 10.8109L12.5369 15.4311C12.6708 15.9043 12.1129 16.2661 11.7354 15.951L8.4935 13.2448C8.30796 13.0899 8.0382 13.0899 7.85266 13.2448L4.61076 15.951C4.23329 16.2661 3.67541 15.9043 3.80922 15.4311L5.11578 10.8109C5.16947 10.6211 5.10651 10.4175 4.95507 10.291L1.45881 7.3725C1.09997 7.07295 1.31179 6.48866 1.77923 6.48866H5.9599C6.18364 6.48866 6.38014 6.34002 6.44103 6.12472L7.69195 1.70133Z"
                  fill="#00D6B6"
                />
              )}
              {myProfile?.rating > 1 && (
                <path
                  d="M28.8458 1.70133C28.983 1.21608 29.6708 1.21608 29.808 1.70133L31.0589 6.12472C31.1198 6.34002 31.3163 6.48866 31.5401 6.48866H35.7207C36.1882 6.48866 36.4 7.07295 36.0411 7.3725L32.5449 10.291C32.3934 10.4175 32.3305 10.6211 32.3842 10.8109L33.6907 15.4311C33.8245 15.9043 33.2667 16.2661 32.8892 15.951L29.6473 13.2448C29.4618 13.0899 29.192 13.0899 29.0065 13.2448L25.7646 15.951C25.3871 16.2661 24.8292 15.9043 24.963 15.4311L26.2696 10.8109C26.3233 10.6211 26.2603 10.4175 26.1089 10.291L22.6126 7.3725C22.2538 7.07295 22.4656 6.48866 22.933 6.48866H27.1137C27.3374 6.48866 27.5339 6.34002 27.5948 6.12472L28.8458 1.70133Z"
                  fill="#00D6B6"
                />
              )}
              {myProfile?.rating > 2 && (
                <path
                  d="M49.9996 1.70133C50.1368 1.21608 50.8246 1.21608 50.9618 1.70133L52.2127 6.12472C52.2736 6.34002 52.4701 6.48866 52.6939 6.48866H56.8746C57.342 6.48866 57.5538 7.07295 57.195 7.3725L53.6987 10.291C53.5473 10.4175 53.4843 10.6211 53.538 10.8109L54.8446 15.4311C54.9784 15.9043 54.4205 16.2661 54.043 15.951L50.8011 13.2448C50.6156 13.0899 50.3458 13.0899 50.1603 13.2448L46.9184 15.951C46.5409 16.2661 45.983 15.9043 46.1168 15.4311L47.4234 10.8109C47.4771 10.6211 47.4141 10.4175 47.2627 10.291L43.7664 7.3725C43.4076 7.07295 43.6194 6.48866 44.0868 6.48866H48.2675C48.4913 6.48866 48.6878 6.34002 48.7486 6.12472L49.9996 1.70133Z"
                  fill="#00D6B6"
                />
              )}
              {myProfile?.rating > 3 && (
                <path
                  d="M71.1534 1.70133C71.2906 1.21608 71.9784 1.21608 72.1156 1.70133L73.3665 6.12472C73.4274 6.34002 73.6239 6.48866 73.8477 6.48866H78.0283C78.4958 6.48866 78.7076 7.07295 78.3488 7.3725L74.8525 10.291C74.7011 10.4175 74.6381 10.6211 74.6918 10.8109L75.9984 15.4311C76.1322 15.9043 75.5743 16.2661 75.1968 15.951L71.9549 13.2448C71.7694 13.0899 71.4996 13.0899 71.3141 13.2448L68.0722 15.951C67.6947 16.2661 67.1368 15.9043 67.2706 15.4311L68.5772 10.8109C68.6309 10.6211 68.5679 10.4175 68.4165 10.291L64.9202 7.3725C64.5614 7.07295 64.7732 6.48866 65.2407 6.48866H69.4213C69.6451 6.48866 69.8416 6.34002 69.9024 6.12472L71.1534 1.70133Z"
                  fill="#00D6B6"
                />
              )}
              {myProfile?.rating > 4 && (
                <path
                  d="M92.3072 1.70133C92.4444 1.21608 93.1322 1.21608 93.2694 1.70133L94.5204 6.12472C94.5812 6.34002 94.7777 6.48866 95.0015 6.48866H99.1822C99.6496 6.48866 99.8614 7.07295 99.5026 7.3725L96.0063 10.291C95.8549 10.4175 95.7919 10.6211 95.8456 10.8109L97.1522 15.4311C97.286 15.9043 96.7281 16.2661 96.3506 15.951L93.1087 13.2448C92.9232 13.0899 92.6534 13.0899 92.4679 13.2448L89.226 15.951C88.8485 16.2661 88.2906 15.9043 88.4244 15.4311L89.731 10.8109C89.7847 10.6211 89.7217 10.4175 89.5703 10.291L86.074 7.3725C85.7152 7.07295 85.927 6.48866 86.3945 6.48866H90.5751C90.7989 6.48866 90.9954 6.34002 91.0563 6.12472L92.3072 1.70133Z"
                  fill="#00D6B6"
                />
              )}
            </svg>
          </div>
          <div className="stats stats-grid">
            <IonItem className="urp-profile-summary-row noselect">
              <IonGrid className="stats-grid-inner">
                <IonRow className="urp-profile-stats-top">
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">POSITION</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.position}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">HEIGHT</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.height}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">WEIGHT</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.weight +
                        ((myProfile?.weight || '').endsWith('lbs')
                          ? ''
                          : ' lbs')}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">CLASS</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.year}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">SCHOOL</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.school}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">CITY</div>
                    <div className="urp-profile-stats-value">
                      {myProfile?.city}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          </div>
          <div className="sports">
            <span className="urp-horizontal-badge-overlap">
              <span className="urp-main-badge">
                {renderSportBadge(myProfile.sport)}
              </span>
              {myProfile.otherSports &&
                myProfile.otherSports.map((sport) => {
                  return (
                    <span key={sport} className="urp-badge">
                      <img
                        alt={sport}
                        style={{ height: '1.3rem' }}
                        className="logo-image"
                        src={`assets/images/urp-badge-${sport}.svg`}
                      />
                    </span>
                  );
                })}
            </span>
          </div>
        </div>
      )}
      {isPlatform('desktop') && myProfile.data ? (
        <div
          className="desktop-only urp-profile-bio"
          style={{
            textAlign: 'left',
            paddingLeft: '6px',
          }}
        >
          {myProfile.data}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default FeedListItem;
