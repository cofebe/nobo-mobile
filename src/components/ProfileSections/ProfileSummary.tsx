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

  // const renderSportBadge = (sport: string) => {
  //   switch (sport.toLowerCase()) {
  //     case 'football':
  //       return (
  //         <img
  //           alt="football"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-football.svg"
  //         />
  //       );
  //     case 'wbasketball':
  //       return (
  //         <img
  //           alt="basketball"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-basketball.svg"
  //         />
  //       );
  //     case 'mbasketball':
  //       return (
  //         <img
  //           alt="basketball"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-basketball.svg"
  //         />
  //       );
  //     case 'baseball':
  //       return (
  //         <img
  //           alt="baseball"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-softball.svg"
  //         />
  //       );
  //     case 'msoccer':
  //       return (
  //         <img
  //           alt="soccer"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-soccer.svg"
  //         />
  //       );
  //     case 'wsoccer':
  //       return (
  //         <img
  //           alt="soccer"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-soccer.svg"
  //         />
  //       );
  //     case 'mvolleyball':
  //       return (
  //         <img
  //           alt="volleyball"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-volleyball.svg"
  //         />
  //       );
  //     case 'wvolleyball':
  //       return (
  //         <img
  //           alt="volleyball"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-volleyball.svg"
  //         />
  //       );
  //     case 'wlacrosse':
  //       return (
  //         <img
  //           alt="lacrosse"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-lacrosse.svg"
  //         />
  //       );
  //     case 'mlacrosse':
  //       return (
  //         <img
  //           alt="lacrosse"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-lacrosse.svg"
  //         />
  //       );
  //     case 'softball':
  //       return (
  //         <img
  //           alt="softball"
  //           style={{ height: '1.3rem' }}
  //           className="logo-image"
  //           src="assets/images/nobo-badge-softball.svg"
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div
      className={
        'profile-summary-athlete ' + (isPlatform('desktop') ? 'desktop' : '')
      }
    >
      {!isPlatform('desktop') ? (
        <IonGrid className="mobile-only stats-grid">
          <IonRow style={{ maxHeight: '48px' }}>
            <IonCol offset="1" size="7" className="profile-name">
              <div>@{myProfile.fromName}</div>
              <div style={{ paddingTop: '8px' }}>
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {myProfile.fromName}
                </div>
              </div>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-wrap nobo-profile-summary-row nobo-profile-stats-top">
            <IonCol className="profile-summary-padding" size="12">
              <IonGrid className="stats-grid-inner">
                {myProfile.data ? (
                  <IonRow>
                    <IonCol>
                      <div
                        className="nobo-profile-bio"
                        style={{ textAlign: 'left', paddingLeft: '6px' }}
                      >
                        {myProfile.data.length > previewCharLen && previewMode
                          ? myProfile.data.substring(0, previewCharLen) + '...'
                          : myProfile.data} FASHION LOVER NAD BLOGGER. I OFFER WOMENS COLTHING, BAGS AND OTHER ACCESSORIES! 
                        <div
                          className="nobo-more-arrow"
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
                  <IonRow className="nobo-profile-stats-top">
                    <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                      <div className="nobo-profile-stats-header">Followers</div>
                      <div className="nobo-profile-stats-value">
                        55
                      </div>
                    </IonCol>
                    <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                      <div className="nobo-profile-stats-header">Following</div>
                      <div className="nobo-profile-stats-value">
                        20
                      </div>
                    </IonCol>
                    <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                      <div className="nobo-profile-stats-header">Review</div>
                      <div className="nobo-profile-stats-value">
                        5
                      </div>
                    </IonCol>
                  </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      ) : (
        <div className="desktop-only">
          <div className="name-location">
            <div className="name">@{myProfile.fromName}</div>
            <div className="location">
              {/*<p className="nobo-active-time">Active 2hrs ago</p>*/}
              <div style={{ paddingTop: '8px' }} className="nobo-location-pin">
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {myProfile.fromName}
                </div>
              </div>
            </div>
          </div>
          <div className="stats stats-grid">
            <IonItem className="nobo-profile-summary-row noselect">
              <IonGrid className="stats-grid-inner">
                <IonRow className="nobo-profile-stats-top">
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="nobo-profile-stats-header">POSITION</div>
                    <div className="nobo-profile-stats-value">
                      {myProfile?.position}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="nobo-profile-stats-header">HEIGHT</div>
                    <div className="nobo-profile-stats-value">
                      {myProfile?.height}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="nobo-profile-stats-header">WEIGHT</div>
                    <div className="nobo-profile-stats-value">
                      {myProfile?.weight +
                        ((myProfile?.weight || '').endsWith('lbs')
                          ? ''
                          : ' lbs')}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="nobo-profile-stats-header">CLASS</div>
                    <div className="nobo-profile-stats-value">
                      {myProfile?.year}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="nobo-profile-stats-header">SCHOOL</div>
                    <div className="nobo-profile-stats-value">
                      {myProfile?.school}
                    </div>
                  </IonCol>
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="nobo-profile-stats-header">CITY</div>
                    <div className="nobo-profile-stats-value">
                      {myProfile?.city}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          </div>
        </div>
      )}
      {isPlatform('desktop') && myProfile.data ? (
        <div
          className="desktop-only nobo-profile-bio"
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
