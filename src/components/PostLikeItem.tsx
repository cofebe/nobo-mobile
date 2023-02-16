import {
  IonItem,
  IonRow,
  IonCol,
  IonAvatar,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LikeItem } from '../data/athlete-feed';
import './PostLikeItem.scss';
import { viewUser } from '../util';

interface PostLikeItemProps {
  postId: number;
  like: LikeItem;
}

const PostLikeItem: React.FC<PostLikeItemProps> = ({ postId, like }) => {
  const history = useHistory();
  const [likeItem, setLikeItem] = useState<LikeItem>(like);
  //const [postID, setPostID] = useState<number>(postId);

  useEffect(() => {
    //setPostID(postId);
    setLikeItem(like);
  }, [postId, like]);

  return (
    <IonItem lines="none" className="post-like-item" detail={false}>
      <IonRow className="post-like-item-content ion-text-wrap">
        <IonCol size="1">
          <IonAvatar className="feed-list-feed-image">
            <img
              onClick={(e) => {
                e.preventDefault();
                viewUser(history, likeItem.user_id, likeItem.account_type);
              }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "../../assets/images/nobo_logo_round.svg";
              }}
              src={likeItem.profile_image}
              alt="avatar"
            />
          </IonAvatar>
        </IonCol>
        <IonCol
          className="feed-content feed-content-center"
          size="7">
            <div>
              <h2 className="feed-list-nobo-badge-line">
                <p className="feed-list-feed-name">{likeItem.from_name}</p>
              </h2>
            </div>
        </IonCol>
        <IonCol
          className="feed-content-center feed-content-right"
          size="4">
            <div style={{width: "100%"}}>
              <h2 className="feed-list-nobo-badge-line">
                <span>
                  {likeItem.account_type === 'athlete' ? (
                    <img
                      className="feed-list-logo-image"
                      src={`assets/images/nobo-badge-${likeItem.sport}.svg`}
                      alt={likeItem.sport}
                    />
                  ) : ''}
                </span>
                <span className="feed-list-feed-primary-sport">
                  {(likeItem?.position || '').replace(/"/g,"")}
                </span>
                { likeItem?.rating > 0 && (
                <span className="feed-list-feed-ranking">
                  <p className="feed-list-feed-ranking-text">
                    {likeItem?.rating}
                    <svg width="20" height="12" viewBox="0 -2 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.52447 1.46353C5.67415 1.00287 6.32585 1.00287 6.47553 1.46353L7.23483 3.80041C7.30176 4.00642 7.49374 4.1459 7.71036 4.1459H10.1675C10.6519 4.1459 10.8532 4.76571 10.4614 5.05041L8.47352 6.49468C8.29828 6.622 8.22495 6.84768 8.29188 7.0537L9.05118 9.39058C9.20086 9.85123 8.67362 10.2343 8.28176 9.94959L6.29389 8.50532C6.11865 8.378 5.88135 8.378 5.70611 8.50532L3.71824 9.94959C3.32638 10.2343 2.79914 9.85123 2.94882 9.39058L3.70812 7.0537C3.77505 6.84768 3.70172 6.622 3.52648 6.49468L1.53861 5.05041C1.14675 4.76571 1.34814 4.1459 1.8325 4.1459H4.28964C4.50626 4.1459 4.69824 4.00642 4.76517 3.80041L5.52447 1.46353Z" fill="#00D6B6"/>
                    </svg>
                  </p>
                </span>)}
              </h2>
            </div>
        </IonCol>
        <IonCol
          className="feed-content feed-content-stats"
          size="11"
          offset="1">
            <div>
              {likeItem.account_type === 'athlete' ? (
                <h3 className="feed-l2">
                  <span>{likeItem?.school}</span>
                  <span className="feed-border">|</span>
                  <span>{likeItem?.height}</span>
                  <span className="feed-border">|</span>
                  <span>{likeItem?.weight + "lbs"}</span>
                  <span className="feed-border">|</span>
                  <span>
                    <span>{likeItem?.year}</span>
                  </span>
                </h3>
              ) : (
                <h3 className="feed-l2">
                  <span>{likeItem?.school}</span>
                </h3>
              )}
            </div>
        </IonCol>
      </IonRow>
    </IonItem>
  );
};

export default PostLikeItem;
