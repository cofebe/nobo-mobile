import { useState, useRef } from 'react';
import { FeedItem, Comment } from '../data/athlete-feed';
import { useHistory } from "react-router-dom";
import {
  IonButtons,
  IonContent,
  IonIcon,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  useIonViewWillEnter,
  IonText,
} from '@ionic/react';
import './PostDetail.scss';
import FeedListItem from '../components/FeedListItem';
import PostComment from '../components/PostComment';
import CreateCommentModal from '../components/CreateCommentModal';
import { chevronBackOutline } from "ionicons/icons";
import { FeedService } from "../services/FeedService";
 import ImageZoom from '../components/ImageZoom';

const PostDetail: React.FC = () => {
  const feedService = new FeedService();
  const history = useHistory();
  let [postId, setPostId] = useState<number>(getPostId());
  const [message, setMessage] = useState<FeedItem>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [imageZoom, setImageZoom] = useState("");

  const modal = useRef<HTMLIonModalElement>(null);

  console.log("PostDetail: ", postId, message);

  useIonViewWillEnter(() => {
    let storage: any = window.localStorage.getItem("persistedState");
    const user = (storage ? JSON.parse(storage) : undefined);

    let userID = 0;
    if (user) {
      userID = user.user['user_id'];
    }

    postId = getPostId();
    setPostId(postId);
    setImageZoom('');

    console.log("feedService.getPost(): ", userID, postId)
    feedService
      .getPost(userID, postId)
      .then(res => res.json())
      .then(data => {
        console.log('getPost:', data);
        setMessage(data);
      });

    loadComments();
  });

  function loadComments() {
    feedService
      .getPostComments(postId)
      .then(res => res.json())
      .then(data => {
        console.log('comments', data);
        setComments(data || []);
      });
  }

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  function showPostComment() {
    modal.current?.present();
  }

  function getPostId() {
    let postid = history.location.pathname.substring(history.location.pathname.lastIndexOf('/') + 1)
    //console.log("getPostId: ", postid)
    return parseInt(postid)
  }

  return (
    <IonPage className="post-detail-page">
      <ImageZoom show={!!imageZoom} imageUrl={imageZoom} onClose={() => setImageZoom('')}></ImageZoom>
      <IonHeader>
        <IonToolbar
          style={{
            padding: "40px 10px 10px 10px",
          }}
        >
          <IonButtons slot="start"
              onClick={() => {
                history.goBack()
              }}>
            <IonIcon
              slot="icon-only"
              icon={chevronBackOutline}
            />
            <IonText>Feed</IonText>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {message ? (
        <IonContent className="post-detail-page" fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList className="nobo-post-detail-background">
            <FeedListItem message={message} zoomAction={(i: number) => {
              try {
                if (message && message.photo_url && message.photo_url.length > 0) {
                  let targetIndex = i;
                  let zoomImageUrl = (message.photo_url || "").replace('[', '').replace(']', '').split("'").join('').split(',')[targetIndex];
                  setImageZoom(zoomImageUrl);
                }
              } catch (exZoomPicNoExist) {
              }
            }} />
          </IonList>
          {comments.map(c => (
            <PostComment message={message} comment={c} key={c.comment_id} />
          ))}

          <img
            onClick={(e) => {
              e.preventDefault();
              showPostComment();
            }}
              className="floating-button"
              src="assets/images/create-post.svg"
              alt="Add Comment"
          />

          <CreateCommentModal ref={modal} postId={message?.post_id} onCancel={() => {
            modal.current?.dismiss();
          }} onClose={() => {
            loadComments();
            modal.current?.dismiss();
          }}/>
        </IonContent>
      ) : ''}
    </IonPage>
  );
};

export default PostDetail;
