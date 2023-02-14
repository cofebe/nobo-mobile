import {
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonGrid,
  isPlatform,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { OrganizationProfile } from '../../data/organization';
import ProfileActionMenu, { ActionListItem } from '../ProfileActionMenu';

import './OrganizationProfileSummary.scss';

interface ProfileSummaryProps {
  profile: OrganizationProfile;
  openSocialShare: Function;
  myProfile: boolean;
}
const previewCharLen = 160;
const FeedListItem: React.FC<ProfileSummaryProps> = ({
  profile,
  openSocialShare,
  myProfile,
}) => {
  const [previewMode, setPreviewMode] = useState(true);
  console.log(profile)

  return (
    <div
      className={
        'profile-summary-organization ' +
        (isPlatform('desktop') ? 'desktop' : '')
      }
    >
      {!isPlatform('desktop') ? (
        <IonGrid className="mobile-only">
          <IonRow>
            <IonCol offset="3" size="7" className="profile-name">
              <div>{profile.organization_name}</div>
              <div
                style={{ paddingTop: '0.5rem' }}
                className={`urp-location-pin
                }`}
              >
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
                  {profile.country}
                </div>
              </div>
            </IonCol>
            <IonCol size="2" style={{ paddingTop: !myProfile && '12px' }}>
              <ProfileActionMenu openSocialShare={openSocialShare} />
              {/* <span className="urp-horizontal-badge-overlap">
                <span className="urp-main-badge">
                  {renderSportBadge(profile.sport)}
                </span> */}
              {/* {myProfile.otherSports &&
                  myProfile.otherSports.map((sport) => {
                    return (
                      <span key={sport} className="urp-badge">
                        <img
                          alt={sport}
                          style={{ height: "1.3rem" }}
                          className="logo-image"
                          src={`assets/images/urp-badge-${sport}.svg`}
                        />
                      </span>
                    );
                  })} */}
              {/* </span> */}
            </IonCol>
          </IonRow>
        </IonGrid>
      ) : (
        ''
      )}
      {/*<IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>*/}
      {/*        <IonHeader collapse="condense">
          <IonGrid className="home-toolbar"></IonGrid>
        </IonHeader>*/}
      {!isPlatform('desktop') ? (
        <IonList lines="none" className="mobile-only" style={{background: "#ffffff"}}>
          <IonItem lines="none">
            <IonRow className="ion-text-wrap">
              <IonCol
                className={
                  profile.bio.length < 1
                    ? 'profile-summary-padding urp-no-bio-height'
                    : 'profile-summary-padding'
                }
                size="12"
              >
                <IonItem className="urp-profile-summary-row noselect">
                  <IonGrid
                    style={{
                      padding: '0',
                      marginRight: '20px',
                      marginLeft: '20px',
                      width: '100%',
                    }}
                  >
                    <IonRow className="urp-profile-stats-top">
                      <IonCol
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        size="6"
                      >
                        <div className="urp-profile-stats-header">
                          ORGANIZER
                        </div>
                        <div className="urp-profile-stats-value">
                          {profile.organization_name}
                        </div>
                      </IonCol>
                      {/* <IonCol
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        size="3"
                      >
                        <div className="urp-profile-stats-header">SCHOOL</div>
                        <div className="urp-profile-stats-value">
                          {profile?.school}
                        </div>
                      </IonCol> */}
                    </IonRow>
                  </IonGrid>
                </IonItem>
                {profile.bio ? (
                  <div className="urp-profile-bio">
                    {profile.bio.length > previewCharLen && previewMode
                      ? profile.bio.substring(0, previewCharLen) + '...'
                      : profile.bio}
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
                      {previewMode && profile.bio.length > previewCharLen && (
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
                ) : (
                  ''
                )}
                <span className="date">
                  {/* <IonNote>{profile.date}</IonNote> */}
                </span>
              </IonCol>
            </IonRow>
          </IonItem>
        </IonList>
      ) : (
        ''
      )}
      {isPlatform('desktop') ? (
        <div className="desktop-only">
          <div className="name-location">
            <div className="name">{profile.organization_name}</div>
            <div className="location">
              {/*<p className="urp-active-time">Active 2hrs ago</p>*/}
              <div className="urp-location-pin">
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
                  {profile.country}
                </div>
              </div>
            </div>
          </div>
          <div className="stats">
            <IonItem className="urp-profile-summary-row noselect">
              <IonGrid
                style={{
                  padding: '0',
                  marginRight: '20px',
                  marginLeft: '20px',
                  width: '100%',
                }}
              >
                <IonRow className="urp-profile-stats-top">
                  <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">ORGANIZER</div>
                    <div className="urp-profile-stats-value">
                      Test
                    </div>
                  </IonCol>
                  {/* <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="2">
                    <div className="urp-profile-stats-header">SCHOOL</div>
                    <div className="urp-profile-stats-value">
                      {profile?.school}
                    </div>
                  </IonCol> */}
                </IonRow>
              </IonGrid>
            </IonItem>
          </div>
        </div>
      ) : (
        ''
      )}
      {isPlatform('desktop') && profile.bio ? (
        <div className="desktop-only urp-profile-bio">{profile.bio}d</div>
      ) : (
        ''
      )}
    </div>
  );
};

export default FeedListItem;
