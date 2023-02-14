import { useState, useEffect, forwardRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonButton,
  IonTextarea,
  IonLabel,
  IonNote,
  IonToolbar,
  IonModal,
} from '@ionic/react';
import './CreateCommentModal.scss';
import { FeedService } from "../services/FeedService";
import { UserService } from "../services/UserService";

export interface CreateCommentModalProps {
  postId: number;
  onCancel?: () => void;
  onClose?: () => void;
};

export type Ref = HTMLIonModalElement;

const cacheBreaker = () => `CreateCommentModal${Date.now()}`;
const CreateCommentModal = forwardRef<Ref, CreateCommentModalProps>(({ postId, onCancel, onClose }, ref) => {
  const feedService = new FeedService();
  const userService = new UserService();
  const [postID, setPostID] = useState<number>(postId);
  const [profilePic, setProfilePic] = useState<string>('');

  const [data, setData] = useState<string>();

  let storage: any = window.localStorage.getItem("persistedState");
  let user = JSON.parse(storage);
  const userID = user.user['user_id'];

  useEffect(() => {
    setPostID(postId);

    userService
      .getProfile(userID)
      .then(res => res.json())
      .then(data => {
        setProfilePic(data.basic_user_profile.profile_image?.String || `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/pictures/${userID}/profile.jpeg?fail`);
      });
  }, [postId]);

  function validate() {
    return !!data;
  }

  function postComment() {
    console.log("Posting comment!!!");

    let req = {
      user_id: userID,
      post_id: postID,
      message: data,
      // image_url: ,
      // video_url: ,
    };
    console.log("Post comment: ", req);
    feedService
      .postComment(req)
      .then((res) => res.json())
      .then((data) => {

        console.log("Comments: ", data);
        setData("");

        feedService
          .getPostComments(postId)
          .then(res => res.json())
          .then(data => {
            console.log('comments', data);
            if (onClose) {
              onClose();
            }
          });
      });
  }

  function addPostImage() {
    alert('browse to select an image...');
  }

  return (
    <IonModal className="post-comment-container" ref={ref} backdropDismiss={false} swipeToClose={false}>
      <IonHeader className="post-comment-header">
        <IonToolbar className="post-comment-header-toolbar">
          <IonGrid style={{ backgroundColor: "white" }}>
            <IonRow>
              <IonCol size="12">
                <IonItem lines="none">
                  <IonButton
                    buttonType=""
                    color="#9BC9C1"
                    fill="clear"
                    className="cancel-btn"
                    size="large"
                    slot="start"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onCancel) {
                        onCancel();
                      }
                    }}
                  >
                    Cancel
                  </IonButton>
                  <IonButton
                    buttonType=""
                    className="post-comment-btn"
                    size="large"
                    disabled={!validate()}
                    slot="end"
                    onClick={(e) => {
                      e.preventDefault();
                      postComment();
                    }}
                  >
                    Comment
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="post-comment-content" scrollY={false}>
        <IonItem className="urp-post-input-area">
          <div className="urp-post-input-text">
            <IonTextarea
              className="post-comment-text"
              value={data}
              autocapitalize="on sentence"
              spellcheck={true}
              onIonChange={(e) => setData(e.detail.value!)}
              placeholder="Write a comment..."
              maxlength={350}
              autoGrow={true}
              rows={5}
            ></IonTextarea>
            <div className="post-comment-input-count">
              {data ? data.length : 0}/{350}
            </div>
          </div>
          <img
            className="post-comment-create-bubble"
            src={profilePic}
            alt="avatar"
          ></img>
          <div className="urp-post-tool-menu" style={{ display: "none" }}>
            <svg
              className="urp-add-image"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
              onClick={()=>{addPostImage()}}
                cx="12"
                cy="12"
                r="12"
                fill="#CCDBDC"
                fill-opacity="0.2"
              />
              <path
                d="M15.9285 16.326L11.8786 10.201C11.7957 10.0757 11.6531 10 11.5 10C11.3469 10 11.2043 10.0757 11.1214 10.201L7.07148 16.326C7.02778 16.3921 7.00318 16.4684 7.00029 16.5469C6.99739 16.6254 7.0163 16.7033 7.05503 16.7722C7.09377 16.8412 7.1509 16.8987 7.2204 16.9388C7.28991 16.9789 7.36923 17 7.45004 17H15.55C15.7146 17 15.8661 16.9126 15.945 16.7721C15.9837 16.7031 16.0026 16.6253 15.9997 16.5468C15.9968 16.4683 15.9722 16.392 15.9285 16.326ZM11.5 10.4375L12.9465 12.625H11.4069L10.6 13.4095L9.95117 12.7799L11.5 10.4375ZM7.45004 16.5625L9.70269 13.1556L10.6 14.028L11.5931 13.0625H13.2356L15.55 16.5625H7.45004Z"
                fill="#00816D"
              />
              <rect
                x="6.25"
                y="7.25"
                width="10.5"
                height="9.5"
                rx="1.75"
                stroke="#00816D"
                stroke-width="0.5"
              />
            </svg>
            &nbsp; &nbsp;
            <svg
              className="urp-add-video"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle

                cx="12"
                cy="12"
                r="12"
                fill="#CCDBDC"
                fill-opacity="0.2"
              />
              <path
                d="M18.2776 8.66667C18.1377 8.66667 17.9955 8.70417 17.8668 8.78542L15.3905 10.2417V8.99583C15.3905 8.44583 14.8668 8 14.2212 8H7.1693C6.5237 8 6 8.44583 6 8.99583V15.0042C6 15.5542 6.5237 16 7.1693 16H14.2212C14.8668 16 15.3905 15.5542 15.3905 15.0042V13.7583L17.8645 15.2146C17.9932 15.2979 18.1377 15.3333 18.2754 15.3333C18.6501 15.3333 19 15.0625 19 14.6771V9.32292C19.0022 8.9375 18.6524 8.66667 18.2776 8.66667ZM14.6682 15.0042C14.6682 15.1833 14.4627 15.3333 14.2212 15.3333H7.1693C6.92776 15.3333 6.72235 15.1833 6.72235 15.0042V8.99583C6.72235 8.81667 6.92776 8.66667 7.1693 8.66667H14.2212C14.4627 8.66667 14.6682 8.81667 14.6682 8.99583V15.0042ZM18.2799 14.6771L18.2528 14.65L15.3905 12.9667V11.0312L18.2799 9.33333V14.6771Z"
                fill="#00816D"
              />
            </svg>
          </div>
        </IonItem>
        <IonGrid className="urp-add-location-grid" style={{ display: "none" }}>
          <IonRow>
            <IonCol className="urp-center" size="11">
              <IonItem
                onClick={(e) => {
                  e.preventDefault();
                }}
                button
                detail={true}
              >
                <IonLabel className="urp-add-location-label">
                  Add Location
                </IonLabel>
                <IonNote slot="end"></IonNote>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
});

export default CreateCommentModal;
