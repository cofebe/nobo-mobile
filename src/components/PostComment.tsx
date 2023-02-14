import { IonGrid, IonRow, IonCol, IonAvatar } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FeedItem, Comment } from '../data/athlete-feed';
import './PostComment.scss';
import { viewUser } from '../util';

interface PostCommentProps {
  message: FeedItem;
  comment: Comment;
}

const PostComment: React.FC<PostCommentProps> = ({ message, comment }) => {
  const history = useHistory();
  // const [likeCount, setLikeCount] = useState<number>(message.like_count || 0);

  //const [msg, setMsg] = useState<FeedItem>(message);
  const [msgComment, setMsgComment] = useState<Comment>(comment);

  useEffect(() => {
    //setMsg(message);
    setMsgComment(comment);
  }, [message, comment]);

  //function likePost() {
  //  console.log("likePost");

  //  let storage: any = window.localStorage.getItem("persistedState");
  //  let user = JSON.parse(storage);
  //  let req = {
  //    post_id: msg.post_id,
  //    user_id: user.user["user_id"],
  //  };
  //  console.log("likePost req: ", req);

  //  if (msg.like_count === undefined) {
  //    msg.like_count = 0;
  //  }

  //  if (msg.liked_post) {
  //    msg.like_count -= 1;
  //    setLikeCount(likeCount - 1);
  //    msg.liked_post = false;
  //    feedService
  //      .removeLikePost(req)
  //      .then((res) => res.json())
  //      .then((data) => {
  //        console.log("removeLikePost: ", data);
  //      })
  //      .catch((err) => {
  //        console.error("Error:", err);
  //        // setTimeout(() => {
  //        //   console.log("Trying like post again")
  //        //   likePost()
  //        // }, 1000)
  //      });
  //  } else {
  //    msg.like_count += 1;
  //    setLikeCount(likeCount + 1);
  //    msg.liked_post = true;
  //    feedService
  //      .likePost(req)
  //      .then((res) => res.json())
  //      .then((data) => {
  //        console.log("LikePost: ", data);
  //      })
  //      .catch((err) => {
  //        console.error("Error:", err);
  //        // setTimeout(() => {
  //        //   console.log("Trying like post again")
  //        //   likePost()
  //        // }, 1000)
  //      });
  //  }
  //}

  return (
    <IonGrid className="feed-comment">
      <IonRow className="feed-comment-item ion-text-wrap">
        <IonCol size="2" sizeLg="1" sizeMd="1" offsetMd="3" offsetLg="3">
          <IonAvatar className="feed-list-feed-image">
            <img
              onClick={(e) => {
                e.preventDefault();
                viewUser(history, msgComment.user_id, msgComment.account_type);
              }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = '../../assets/images/urp_logo_round.svg';
              }}
              src={msgComment.profile_image}
              alt="avatar"
            />
          </IonAvatar>
        </IonCol>
        <IonCol className="feed-content" size="10" sizeMd="5" sizeLg="5">
          <h2
            className="feed-list-urp-badge-line"
            onClick={(e) => {
              e.preventDefault();
              viewUser(history, msgComment.user_id, msgComment.account_type);
            }}
          >
            <p className="feed-list-feed-name">{msgComment.from_name}</p>
          </h2>
          <p className="feed-list-feed-message" style={{ paddingLeft: 0 }}>
            {msgComment.message}
          </p>
          <div className="feed-list-bottom-icons">
            <div className="feed-list-date">{msgComment.timestamp}</div>
            {false /*!msgComment.liked_post*/ && (
              <div>
                <div>
                  <svg
                    width="13"
                    height="15"
                    viewBox="0 0 13 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7385 0.753744C10.3547 -0.385547 8.28535 -0.196484 7.00057 1.08522L6.50037 1.58611L6.00017 1.08767C4.96423 0.0515088 2.87456 -0.572155 1.26224 0.753744C-0.332309 2.06982 -0.416099 4.43189 1.01087 5.856L5.924 10.7618C6.08142 10.919 6.28963 11 6.49783 11C6.70604 11 6.91424 10.9214 7.07167 10.7618L11.9848 5.856C13.4168 4.43189 13.3331 2.06982 11.7385 0.753744ZM11.4059 5.31091L6.51053 10.2167L1.59486 5.31091C0.619848 4.33858 0.416722 2.48478 1.79037 1.35285C3.18179 0.203742 4.81696 1.03611 5.41618 1.63522L6.50037 2.71804L7.58456 1.63522C8.17363 1.04593 9.82404 0.211108 11.2104 1.35285C12.5815 2.48232 12.3809 4.33613 11.4059 5.31091Z"
                      fill="#00D6B6"
                    />
                  </svg>
                </div>
                <div className="feed-list-urp-likes-count">
                  {/*msgComment.like_count*/}
                </div>
              </div>
            )}
            {false /*msgComment.liked_post*/ && (
              <div>
                <div>
                  <svg
                    width="15"
                    height="13"
                    viewBox="0 0 12 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.23148 0C7.70197 0.00830248 7.184 0.157306 6.72989 0.431963C6.27578 0.706621 5.90161 1.09721 5.64516 1.56428C5.38871 1.09721 5.01454 0.706621 4.56043 0.431963C4.10632 0.157306 3.58835 0.00830248 3.05884 0C2.21473 0.0369694 1.41944 0.409202 0.846726 1.03538C0.274009 1.66155 -0.0295826 2.49077 0.00227648 3.34186C0.00227648 5.49724 2.25285 7.85124 4.14039 9.44728C4.56183 9.80428 5.09468 10 5.64516 10C6.19565 10 6.72849 9.80428 7.14993 9.44728C9.03747 7.85124 11.288 5.49724 11.288 3.34186C11.3199 2.49077 11.0163 1.66155 10.4436 1.03538C9.87088 0.409202 9.07559 0.0369694 8.23148 0Z"
                      fill="#00D6B6"
                    />
                  </svg>
                </div>
                <div className="feed-list-urp-likes-count">
                  {/*msgComment.like_count*/}
                </div>
              </div>
            )}
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default PostComment;
