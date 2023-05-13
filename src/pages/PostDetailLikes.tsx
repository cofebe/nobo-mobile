import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LikeItem } from '../data/athlete-feed';
import {
 IonButtons,
 IonContent,
 IonIcon,
 IonHeader,
 IonList,
 IonPage,
 IonToolbar,
 IonItem,
 IonRow,
 IonCol,
 IonSearchbar,
 useIonViewWillEnter,
 IonText,
} from '@ionic/react';
import './PostDetailLikes.scss';
import { chevronBackOutline } from 'ionicons/icons';
import { FeedService } from '../services/FeedService';
import PostLikeItem from '../components/PostLikeItem';

const PostDetailLikes: React.FC = () => {
 const feedService = new FeedService();
 const history = useHistory();
 const [postId, setPostId] = useState<number>(getPostId());
 const [likes, setLikes] = useState<LikeItem[]>([]);
 const [searchText, setSearchText] = useState<string>('');

 console.log('PostDetailLikes: ', postId);

 useIonViewWillEnter(() => {
  let storage: any = window.localStorage.getItem('persistedState');
  let user = JSON.parse(storage);

  setPostId(getPostId());

  console.log('feedService.getPostLikes():', postId);
  feedService
   .getPostLikes(user.user['user_id'], postId)
   .then(res => res.json())
   .then(data => {
    console.log('getPostLikes:', data);
    setLikes(data || []);
   });
 });

 function getPostId() {
  const parts = history.location.pathname.split('/');
  const postid = parts[parts.length - 2];
  //console.log(`PostLikes:getPostId: "${postid}" ${parseInt(postid)}`);
  return parseInt(postid);
 }

 return (
  <IonPage className="post-detail-likes-page">
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
      <IonText>Post</IonText>
     </IonButtons>
    </IonToolbar>
   </IonHeader>
   <IonItem lines="none" className="post-detail-likes-top">
    <IonRow>
     <IonCol size="12">
      <div className="like-count-container">
       <div className="like-count">
        <div>
         <svg
          width="16"
          height="14"
          viewBox="0 0 13 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
         >
          <path
           d="M8.23148 0C7.70197 0.00830248 7.184 0.157306 6.72989 0.431963C6.27578 0.706621 5.90161 1.09721 5.64516 1.56428C5.38871 1.09721 5.01454 0.706621 4.56043 0.431963C4.10632 0.157306 3.58835 0.00830248 3.05884 0C2.21473 0.0369694 1.41944 0.409202 0.846726 1.03538C0.274009 1.66155 -0.0295826 2.49077 0.00227648 3.34186C0.00227648 5.49724 2.25285 7.85124 4.14039 9.44728C4.56183 9.80428 5.09468 10 5.64516 10C6.19565 10 6.72849 9.80428 7.14993 9.44728C9.03747 7.85124 11.288 5.49724 11.288 3.34186C11.3199 2.49077 11.0163 1.66155 10.4436 1.03538C9.87088 0.409202 9.07559 0.0369694 8.23148 0Z"
           fill="#00D6B6"
          />
         </svg>
        </div>
        <div>{likes?.length || 0}</div>
       </div>
      </div>
      <div className="like-label-container">Total Likes</div>
     </IonCol>
    </IonRow>
   </IonItem>
   <IonContent className="post-detail-page" fullscreen>
    <IonSearchbar
     id="searchInput"
     value={searchText}
     onIonChange={e => {
      setSearchText(e.detail.value || '');
     }}
     enterkeyhint="search"
    ></IonSearchbar>
    <IonList className="nobo-post-detail-background">
     {(likes || [])
      .filter(
       like => !searchText || like.from_name.toLowerCase().includes(searchText.toLowerCase())
      )
      .map(like => (
       <PostLikeItem like={like} postId={postId} />
      ))}
    </IonList>
   </IonContent>
  </IonPage>
 );
};

export default PostDetailLikes;
