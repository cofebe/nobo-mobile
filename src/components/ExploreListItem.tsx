import { IonItem, IonRow, IonCol, IonAvatar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Profile } from '../data/profile';
import { OrganizationProfile } from '../data/organization';
import './ExploreListItem.css';
import { viewUser } from '../util';

interface ExplorelistItemProps {
 profile: Profile;
}

const ExplorelistItem: React.FC<ExplorelistItemProps> = ({ profile }) => {
 const history = useHistory();
 let rating = 0;

 if (
  profile.athlete_user_profile !== undefined &&
  profile.athlete_user_profile.rating !== undefined
 ) {
  rating = profile.athlete_user_profile.rating.Int16;
 }

 let name =
  profile.basic_user_profile.first_name.String + ' ' + profile.basic_user_profile.last_name.String;

 if (profile.user_type.String === 'organization') {
  name = profile?.organization_profile?.organization_name || '';
 }

 return (
  <IonItem lines="none" className="explore-list-item" detail={false}>
   <IonRow
    className="explore-list-item-content ion-text-wrap"
    onClick={e => {
     e.preventDefault();
     if (profile.user_type !== undefined && profile.user_type.String !== undefined) {
      viewUser(
       history,
       profile.user_id || profile?.organization_profile?.organization_id || 0,
       profile.user_type?.String
      );
     }
    }}
   >
    <IonCol size="2">
     <IonAvatar className="explore-feed-first-row">
      <img
       className="explore-list-feed-image"
       src={profile.basic_user_profile.profile_image.String}
       alt="avatar"
      />
     </IonAvatar>
    </IonCol>
    <IonCol className="explore-feed-first-row explore-feed-content feed-content-center" size="6">
     <div
      style={{
       maxWidth: '176px',
       overflow: 'hidden',
       textOverflow: 'ellipsis',
       whiteSpace: 'nowrap',
      }}
     >
      <h2 className="feed-list-nobo-badge-line">
       <p className="feed-list-feed-name">{name}</p>
      </h2>
     </div>
    </IonCol>
    <IonCol
     style={{ display: 'flex', justifyContent: 'flex-end' }}
     className="explore-feed-first-row feed-content-center feed-content-right"
     size="4"
    >
     <div style={{ width: '80%' }}>
      <h2 className="feed-list-nobo-badge-line">
       <span>
        {profile.athlete_user_profile.primary_sport.String ? (
         <img
          className="feed-list-logo-image"
          src={`assets/images/nobo-badge-${profile.athlete_user_profile.primary_sport.String}.svg`}
          alt={profile.athlete_user_profile.primary_sport.String}
         />
        ) : (
         ''
        )}
       </span>
       <span className="feed-list-feed-primary-sport">
        {(profile.athlete_user_profile.primary_position.String || '').replace(/"/g, '')}
       </span>
       {rating > 0 && (
        <span className="feed-list-feed-ranking">
         <p className="feed-list-feed-ranking-text">
          {rating}
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
      </h2>
     </div>
    </IonCol>
    <IonCol className="explore-feed-content feed-content-stats" size="11" offset="2">
     <div>
      {profile.user_type?.String === 'athlete' ? (
       <h3 className="feed-l2">
        <div>{profile.basic_user_profile.school.String}</div>
        {/* <span className="feed-border">|</span> */}
        <span>{profile.athlete_user_profile.height.String}</span>
        <span className="feed-border">|</span>
        <span>{profile.athlete_user_profile.weight.String + 'lbs'}</span>
        <span className="feed-border">|</span>
        <span>
         <span>{profile.basic_user_profile.class_year.String}</span>
        </span>
       </h3>
      ) : (
       <h3 className="feed-l2">
        <div>
         {profile.basic_user_profile.school.String || profile.basic_user_profile.country.String}
        </div>
        {/* <span className="feed-border">|</span> */}
        <span>
         {profile.coach_user_profile?.position.String || profile.basic_user_profile.state.String}
        </span>
       </h3>
      )}
     </div>
    </IonCol>
   </IonRow>
  </IonItem>
 );
};

export default ExplorelistItem;
