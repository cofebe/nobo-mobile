import { IonItem, IonRow, IonCol, IonGrid, isPlatform } from '@ionic/react';
import './ProfileSummary.scss';
import { useEffect, useState } from 'react';
import { NoboProfile } from '../../data/nobo-profile';
import ProfileActionMenu, { ActionListItem } from '../ProfileActionMenu';

interface ProfileSummaryProps {
  profile: NoboProfile;
  openSocialShare: Function;
}
const previewCharLen = 160;
const FeedListItem: React.FC<ProfileSummaryProps> = ({ profile, openSocialShare }) => {
  const [previewMode, setPreviewMode] = useState(true);
  const [myProfile, setMyProfile] = useState<NoboProfile>(profile);

  useEffect(() => {
    setMyProfile(profile);
  }, [profile]);

  return (
    <div className={'profile-summary-athlete ' + (isPlatform('desktop') ? 'desktop' : '')}>
      {!isPlatform('desktop') ? (
        <IonGrid className="mobile-only profile-summary-container">
          <IonRow style={{ maxHeight: '48px' }}>
            <IonCol size="7" className="profile-name">
              <div>@{myProfile.displayName}</div>
              <div style={{ paddingTop: '8px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {myProfile.firstName + ' ' + myProfile.lastName}
                </div>
              </div>
            </IonCol>
            <IonCol offset="3" size="2">
              <ProfileActionMenu openSocialShare={openSocialShare} />
            </IonCol>
          </IonRow>
          {myProfile.blurbText ? (
            <IonRow>
              <IonCol style={{ paddingLeft: '0' }}>
                <div className="nobo-profile-bio" style={{ textAlign: 'left' }}>
                  {myProfile.blurbText.length > previewCharLen && previewMode
                    ? myProfile.blurbText.substring(0, previewCharLen) + '...'
                    : myProfile.blurbText}
                  <div
                    className="nobo-more-arrow"
                    style={{
                      width: '80vw',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={e => {
                      e.preventDefault();
                      setPreviewMode(!previewMode);
                    }}
                  >
                    {previewMode && myProfile.blurbText.length > previewCharLen && (
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
            <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="4">
              <div className="nobo-profile-stats-header">FOLLOWERS</div>
              <div className="nobo-profile-stats-value">{myProfile.followers.length}</div>
            </IonCol>
            <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="4">
              <div className="nobo-profile-stats-header">FOLLOWING</div>
              <div className="nobo-profile-stats-value">{myProfile.following.length}</div>
            </IonCol>
            <IonCol style={{ paddingLeft: 0, paddingRight: 0 }} size="4">
              <div className="nobo-profile-stats-header">REVIEWS</div>
              <div className="nobo-profile-stats-value">{myProfile.reviews.length}</div>
            </IonCol>
          </IonRow>
        </IonGrid>
      ) : (
        <div className="desktop-only">
          <div className="name-location">
            <div className="name">@{myProfile.displayName}</div>
            <div className="location">
              {/*<p className="nobo-active-time">Active 2hrs ago</p>*/}
              <div style={{ paddingTop: '8px' }} className="nobo-location-pin">
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {myProfile.firstName + ' ' + myProfile.lastName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isPlatform('desktop') && myProfile.blurbText ? (
        <div
          className="desktop-only nobo-profile-bio"
          style={{
            textAlign: 'left',
            paddingLeft: '6px',
          }}
        >
          {myProfile.blurbText}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default FeedListItem;
