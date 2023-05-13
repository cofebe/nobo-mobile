import {
 IonItem,
 IonRow,
 IonCol,
 IonAvatar,
 IonItemSliding,
 IonItemOptions,
 IonItemOption,
 IonIcon,
 IonLabel,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import { WatchItem } from '../data/watchlist-list';
import { Profile } from '../data/profile';
import './WatchListItem.scss';
import { viewUser } from '../util';
import { trashOutline } from 'ionicons/icons';

interface WatchlistItemProps {
 profile: Profile;
 notes?: string;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ profile, notes }) => {
 const history = useHistory();
 const [openDetails, setOpenDetails] = useState(false);
 console.log('AthleteProfile: ', profile);
 console.log('This is the notes ', notes);
 let rating = 0;

 if (
  profile.athlete_user_profile !== undefined &&
  profile.athlete_user_profile.rating !== undefined
 ) {
  rating = profile.athlete_user_profile.rating.Int16;
 }

 return (
  <IonItemSliding id="slidingWatchlistItem" className="watchlist-list-item">
   <IonItem className="watchlist-item" lines="none" detail={false}>
    <IonRow style={{ width: '100%' }}>
     <IonCol
      size="2"
      onClick={e => {
       e.preventDefault();
       if (profile.user_type !== undefined && profile.user_type.String !== undefined) {
        viewUser(history, profile.user_id, profile.user_type?.String);
       }
      }}
     >
      <IonAvatar>
       <img
        // className="watchlist-list-feed-image"
        onError={({ currentTarget }) => {
         currentTarget.onerror = null; // prevents looping
         currentTarget.src = '../../assets/images/nobo_logo_round.svg';
        }}
        src={profile.basic_user_profile.profile_image.String}
        alt="avatar"
       />
      </IonAvatar>
     </IonCol>
     <IonCol size="10">
      <IonRow>
       <IonCol size="7">
        <div
         style={{
          fontSize: '15px',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
         }}
        >
         {profile.basic_user_profile.first_name.String +
          ' ' +
          profile.basic_user_profile.last_name.String}
        </div>
       </IonCol>
       <IonCol style={{ display: 'flex' }} size="3">
        <div>
         {profile.athlete_user_profile.primary_sport.String ? (
          <img
           className="feed-list-logo-image"
           src={`assets/images/nobo-badge-${profile.athlete_user_profile.primary_sport.String}.svg`}
           alt={profile.athlete_user_profile.primary_sport.String}
          />
         ) : (
          ''
         )}
        </div>
        <div
         style={{
          marginLeft: '5px',
          fontSize: '10px',
          fontWeight: 500,
          paddingTop: '2px',
         }}
        >
         {(profile.athlete_user_profile.primary_position.String || '').replace(/"/g, '')}
        </div>
       </IonCol>
       <IonCol style={{ display: 'flex' }} size="2">
        {rating > 0 && (
         <div style={{ fontSize: '10px' }}>
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
         </div>
        )}
       </IonCol>
      </IonRow>
      <IonRow>
       <IonCol style={{ fontSize: '12px', paddingTop: 0 }} size="9">
        <span>{profile.basic_user_profile.school.String}</span>
        <span className="feed-border">|</span>
        <span>{profile.athlete_user_profile.height.String}</span>
        <span className="feed-border">|</span>
        <span>{profile.athlete_user_profile.weight.String + 'lbs'}</span>
        <span className="feed-border">|</span>
        <span>
         <span>{profile.basic_user_profile.class_year.String}</span>
        </span>
       </IonCol>
       {notes && (
        <IonCol size="3" style={{ paddingTop: 0 }}>
         <div
          onClick={() => setOpenDetails(!openDetails)}
          style={{ alignItems: 'center', display: 'flex' }}
         >
          <IonLabel color="primary">
           <h3 style={{ fontSize: '12px' }}>Notes</h3>
          </IonLabel>
          <div
           style={{
            position: 'relative',
            top: '1px',
            paddingLeft: '5px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
           }}
          >
           {openDetails ? (
            <IonIcon color="primary" icon={chevronUpOutline}></IonIcon>
           ) : (
            <IonIcon color="primary" icon={chevronDownOutline}></IonIcon>
           )}
          </div>
         </div>
        </IonCol>
       )}
      </IonRow>
      <IonRow>
       <IonCol>{openDetails && notes && <div style={{ fontSize: '12px' }}>- {notes}</div>}</IonCol>
      </IonRow>
     </IonCol>
    </IonRow>
   </IonItem>
   {/* <IonItemOptions>
        <IonItemOption className="remove-watchlist-item">
          <IonIcon icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions> */}
  </IonItemSliding>
 );
};

export default WatchlistItem;
