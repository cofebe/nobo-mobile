import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
 IonButtons,
 IonContent,
 IonHeader,
 IonItem,
 IonLabel,
 IonNote,
 IonIcon,
 IonList,
 IonPage,
 IonAvatar,
 IonRefresher,
 IonRefresherContent,
 IonToolbar,
 useIonViewWillEnter,
 IonText,
 useIonActionSheet,
} from '@ionic/react';
import './ProfileInsights.scss';
import { chevronBackOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { UserService } from '../services/UserService';
import { viewUser } from '../util';

interface UserProfileInsights_User {
 user_id: number;
 from_name: string;
 profile_image: string;
 account_type: string;
 school: string;
 position: string;
}

const ProfileInsights: React.FC = () => {
 const history = useHistory();
 const userService = new UserService();
 const [visitors, setVisitors] = useState<UserProfileInsights_User[]>([]);
 const [showVisitors, setShowVisitors] = useState<boolean>(false);
 const [watchlists, setWatchlists] = useState<UserProfileInsights_User[]>([]);
 const [showWatchlists, setShowWatchlists] = useState<boolean>(false);
 const [presentActionSheet] = useIonActionSheet();
 let [age, setAge] = useState<number>(7);

 const userId = getUserId();

 //console.log("ProfileInsights: ", userId);

 function getUserId() {
  let userid = history.location.pathname.substring(history.location.pathname.lastIndexOf('/') + 1);
  //console.log("getUserId: ", userid)
  return parseInt(userid);
 }

 useIonViewWillEnter(() => {
  loadStats();
 });

 function loadStats() {
  userService
   .getProfileInsights(userId, age)
   .then(res => res.json())
   .then(data => {
    console.log('Stats: ', data);
    setVisitors(data.visitors);
    setWatchlists(data.watchlists);
   })
   .catch(err => {
    console.error('Error: ', err);
   });
 }

 const refresh = (e: CustomEvent) => {
  setTimeout(() => {
   e.detail.complete();
  }, 3000);
 };

 function showActionSheet() {
  console.log('showActionSheet');
  presentActionSheet({
   header: 'Stat Age',
   buttons: [
    {
     text: '1 day',
     data: {
      age: 1,
     },
    },
    {
     text: '3 days',
     data: {
      age: 3,
     },
    },
    {
     text: '7 days',
     data: {
      age: 7,
     },
    },
    {
     text: 'All Time',
     data: {
      age: 0,
     },
    },
   ],
   onDidDismiss: ({ detail }) => {
    console.log('detail', detail);
    age = detail?.data?.age || 0;
    setAge(age);
    loadStats();
   },
  });
 }

 return (
  <IonPage className="profile-insights">
   <IonHeader>
    <IonToolbar
     style={{
      padding: '40px 10px 10px 10px',
     }}
    >
     <IonButtons
      slot="start"
      onClick={() => {
       history.goBack();
      }}
     >
      <IonIcon slot="icon-only" icon={chevronBackOutline} />
      <IonText>Profile</IonText>
     </IonButtons>
    </IonToolbar>
   </IonHeader>
   <IonContent className="profile-insights-content" fullscreen>
    <IonRefresher slot="fixed" onIonRefresh={refresh}>
     <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
    <IonList>
     <IonItem className="insights-header-row">
      <div>
       <div
        className="insights-header-select"
        onClick={e => {
         showActionSheet();
        }}
       >
        {age > 0 ? `Last ${age} Day${age > 1 ? 's' : ''}` : 'All Time'}
        <IonIcon icon={chevronDownOutline} />
       </div>
      </div>
      <div>
       <div className="insights-header-dates">{/*May 10 - May 23*/}</div>
      </div>
     </IonItem>

     <IonItem
      className="insights-item"
      onClick={e => {
       e.preventDefault();
       setShowVisitors(!showVisitors);
      }}
      lines={showVisitors ? 'none' : 'inset'}
     >
      <IonLabel className="insights-label">Profile Views</IonLabel>
      <IonNote className="insights-value">{visitors.length}</IonNote>
      <IonIcon
       className="insights-toggle"
       icon={showVisitors ? chevronUpOutline : chevronDownOutline}
      />
     </IonItem>
     {showVisitors
      ? visitors.map((v, i) => (
         <IonItem
          key={v.user_id}
          className={'insights-item user ' + (i < visitors.length - 1 ? '' : 'last')}
          onClick={e => {
           e.preventDefault();
           viewUser(history, v.user_id, v.account_type);
          }}
          lines={i < visitors.length - 1 ? 'none' : 'inset'}
         >
          <IonAvatar>
           <img src={v.profile_image} alt="avatar" />
          </IonAvatar>
          <IonLabel className="insights-label">{v.from_name}</IonLabel>
          <IonNote className="insights-value">
           {v.position} {v.school}
          </IonNote>
         </IonItem>
        ))
      : ''}

     <IonItem
      className="insights-item"
      onClick={e => {
       e.preventDefault();
       setShowWatchlists(!showWatchlists);
      }}
      lines={showWatchlists ? 'none' : 'inset'}
     >
      <IonLabel className="insights-label">Watchlist Adds</IonLabel>
      <IonNote className="insights-value">{watchlists.length}</IonNote>
      <IonIcon
       className="insights-toggle"
       icon={showWatchlists ? chevronUpOutline : chevronDownOutline}
      />
     </IonItem>
     {showWatchlists
      ? watchlists.map((w, i) => (
         <IonItem
          key={w.user_id}
          className={'insights-item user ' + (i < watchlists.length - 1 ? '' : 'last')}
          onClick={e => {
           e.preventDefault();
           viewUser(history, w.user_id, w.account_type);
          }}
          lines={i < watchlists.length - 1 ? 'none' : 'inset'}
         >
          <IonAvatar>
           <img src={w.profile_image} alt="avatar" />
          </IonAvatar>
          <IonLabel className="insights-label">{w.from_name}</IonLabel>
          <IonNote className="insights-value">
           {w.position} {w.school}
          </IonNote>
         </IonItem>
        ))
      : ''}
    </IonList>
   </IonContent>
  </IonPage>
 );
};

export default ProfileInsights;
