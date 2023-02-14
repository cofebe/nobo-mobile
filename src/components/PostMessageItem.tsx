import {
  IonItem,
  IonRow,
  IonCol,
  IonNote,
  IonAvatar,
} from '@ionic/react';
import { FeedItem } from '../data/athlete-feed';
import './PostMessageItem.css';

interface PostMessageItemProps {
  message: FeedItem;
}

const PostMessageItem: React.FC<PostMessageItemProps> = ({ message }) => {
  return (
    <IonItem lines="none" className="post-message-item" routerLink={`/home/post-detail/${message.post_id}`} detail={false}>
      <IonRow className="ion-text-wrap">
        <IonCol size="2">
          <IonAvatar className="feed-image" style={{width:"45px", height:"45px", marginLeft: "26px"}}>
            <img src={`../../assets/images/users/${message.profile_image}`} alt="avatar" />
          </IonAvatar>
        </IonCol>
        <IonCol className="feed-content" size="10">
          <h2 className="urp-badge-line">
            <p className="feed-name" style={{fontSize:"1em"}}>{message.from_name}</p>
          </h2>
          <p className="feed-message" style={{marginLeft: "-15px"}}>
            {message.data}
          </p>
          <p className="post-reply">
            <a href="#" style={{color:"#00D6B6", textDecoration:"underline", fontSize:".9em"}}>Reply</a>
          </p>
          <span className="date" style={{position:"absolute", right:"10px", bottom:"20px", color: "#CCDBDC", fontSize:".9em"}}>
            <IonNote style={{color:"#CCDBDC"}}>{message.date}</IonNote>
          </span>
        </IonCol>
        <IonCol size="12" className="feed-bottom">
          <div className="feed-bottom-icons">
            <div className="urp-likes-count">42</div>
            <svg width="90" height="31" viewBox="0 0 68 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50.7385 0.753744C49.3547 -0.385547 47.2854 -0.196484 46.0006 1.08522L45.5004 1.58611L45.0002 1.08767C43.9642 0.0515088 41.8746 -0.572155 40.2622 0.753744C38.6677 2.06982 38.5839 4.43189 40.0109 5.856L44.924 10.7618C45.0814 10.919 45.2896 11 45.4978 11C45.706 11 45.9142 10.9214 46.0717 10.7618L50.9848 5.856C52.4168 4.43189 52.3331 2.06982 50.7385 0.753744ZM50.4059 5.31091L45.5105 10.2167L40.5949 5.31091C39.6198 4.33858 39.4167 2.48478 40.7904 1.35285C42.1818 0.203742 43.817 1.03611 44.4162 1.63522L45.5004 2.71804L46.5846 1.63522C47.1736 1.04593 48.824 0.211108 50.2104 1.35285C51.5815 2.48232 51.3809 4.33613 50.4059 5.31091Z" fill="#00D6B6" />
            </svg>
          </div>
        </IonCol>
      </IonRow>
    </IonItem>
  );
};

export default PostMessageItem;
