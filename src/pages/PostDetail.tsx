import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
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
  IonRow,
  IonCol,
  IonAvatar,
  IonInput,
} from '@ionic/react';
import './PostDetail.scss';
import FeedListItem from '../components/FeedListItem';
import PostComment from '../components/PostComment';
import CreateCommentModal from '../components/CreateCommentModal';
import { chevronBackOutline } from 'ionicons/icons';
import { AuthService } from '../services/AuthService';
import { FeedService } from '../services/FeedService';
import ImageZoom from '../components/ImageZoom';

interface FeedItem {
  likes: Comment[];
  images: { url: string; originalName: string }[];
  _id: string;
  user: {
    _id: string;
    avatar: string;
    displayName: string;
    tradeCloset: number;
    sellCloset: number;
  };
  template: string;
  feedText: string;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Comment {
  likes: any[];
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatar: string;
    tradeCloset: number;
    sellCloset: number;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}

const PostDetail: React.FC = () => {
  console.log('PostDetail');
  const authService = new AuthService();
  const feedService = new FeedService();
  const history = useHistory();
  const [postId, setPostId] = useState<string>(getPostId());
  const [message, setMessage] = useState<FeedItem>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [imageZoom, setImageZoom] = useState('');
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>('');
  const [commentMessage, setCommentMessage] = useState<string>('');

  const modal = useRef<HTMLIonModalElement>(null);

  console.log('PostDetail: ', postId, message);

  useIonViewWillEnter(() => {
    load();
  });

  function load() {
    let storage: any = window.localStorage.getItem('persistedState');
    const user = storage ? JSON.parse(storage) : undefined;

    let userID = authService.getUserId();

    // postId = getPostId();
    // setPostId(postId);
    setImageZoom('');

    console.log('feedService.getPost(): ', userID, getPostId());
    feedService
      .getProfileFeed(userID || '')
      .then(res => res.json())
      .then(data => {
        const filteredFeed = data.feed.feed.filter(
          (item: FeedItem, index: number) => item._id === getPostId()
        );
        if (filteredFeed && filteredFeed.length !== 0) {
          setMessage(filteredFeed[0]);
        }
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
    console.log(
      'getPostId: ',
      history.location.pathname.substring(history.location.pathname.lastIndexOf('/') + 1)
    );
    let postid = history.location.pathname.substring(
      history.location.pathname.lastIndexOf('/') + 1
    );
    return postid;
  }

  function createComment() {
    console.log('CreateComment: ', commentMessage);
    let req = {
      userMessage: commentMessage,
      itemId: getPostId(),
    };
    feedService
      .postComment(req)
      .then(res => res.json())
      .then(data => {
        console.log('Post Comment success: ', data);
        load();
      });
    //https://thenobo.codepilot.com/api/feed/create-item
    // {"userMessage":"jjlkjgfkdljg j a;lkjfdl jfsdklajf kjds fadj ;kjdsfa kjf asdkljf akdjf akjd fjdsfl kdjsfljlsjfdlkj kdsjf k jklds kdjf lksdfj lkjsflkjsdf kdsjf  lksdfj ldja","userImage":null}
  }

  return (
    <IonPage className="post-detail-page">
      <ImageZoom
        show={!!imageZoom}
        imageUrl={imageZoom}
        onClose={() => setImageZoom('')}
      ></ImageZoom>
      <IonHeader>
        <IonToolbar
          style={{
            '--background': 'rgb(254, 252, 247)',
            padding: '40px 10px 10px 10px',
          }}
        >
          <IonButtons
            slot="start"
            onClick={() => {
              history.goBack();
            }}
          >
            {/*            <IonIcon
              slot="icon-only"
              icon={chevronBackOutline}
            />*/}
            <svg
              width="43"
              height="43"
              viewBox="0 0 43 43"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_908_7709)" filter="url(#filter0_d_908_7709)">
                <path
                  d="M33 24.6875L33 10.3125C33 7.93488 31.0651 6 28.6875 6L14.3125 6C11.9349 6 10 7.93487 10 10.3125L10 24.6875C10 27.0651 11.9349 29 14.3125 29L28.6875 29C31.0651 29 33 27.0651 33 24.6875ZM14.3125 28.0417C12.4629 28.0417 10.9583 26.5371 10.9583 24.6875L10.9583 10.3125C10.9583 8.46292 12.4629 6.95833 14.3125 6.95833L28.6875 6.95833C30.5371 6.95833 32.0417 8.46292 32.0417 10.3125L32.0417 24.6875C32.0417 26.5371 30.5371 28.0417 28.6875 28.0417L14.3125 28.0417Z"
                  fill="black"
                />
                <g clip-path="url(#clip1_908_7709)">
                  <path
                    d="M10 24.2083L10 10.7917C10.0015 9.5213 10.5068 8.30341 11.4051 7.40513C12.3034 6.50684 13.5213 6.00152 14.7917 6L28.2083 6C29.4787 6.00152 30.6966 6.50685 31.5949 7.40513C32.4932 8.30341 32.9985 9.52131 33 10.7917L33 24.2083C32.9985 25.4787 32.4932 26.6966 31.5949 27.5949C30.6966 28.4932 29.4787 28.9985 28.2083 29L14.7917 29C13.5213 28.9985 12.3034 28.4932 11.4051 27.5949C10.5068 26.6966 10.0015 25.4787 10 24.2083ZM31.0833 10.7917C31.0833 10.0292 30.7804 9.2979 30.2413 8.75873C29.7021 8.21957 28.9708 7.91667 28.2083 7.91667L14.7917 7.91667C14.0292 7.91667 13.2979 8.21957 12.7587 8.75873C12.2196 9.2979 11.9167 10.0292 11.9167 10.7917L11.9167 24.2083C11.9167 24.9708 12.2196 25.7021 12.7587 26.2413C13.2979 26.7804 14.0292 27.0833 14.7917 27.0833L28.2083 27.0833C28.9708 27.0833 29.7021 26.7804 30.2413 26.2413C30.7804 25.7021 31.0833 24.9708 31.0833 24.2083L31.0833 10.7917ZM17.6667 17.5C17.6659 16.7985 17.9223 16.121 18.3873 15.5958C18.6662 15.2824 18.9374 14.9853 19.132 14.7908L21.8383 12.0375C22.0186 11.8681 22.2576 11.775 22.505 11.7777C22.7525 11.7804 22.9893 11.8787 23.1659 12.0521C23.3424 12.2255 23.4451 12.4604 23.4524 12.7078C23.4597 12.9551 23.371 13.1957 23.2049 13.3792L20.4938 16.1392C20.3145 16.3193 20.0711 16.5877 19.8229 16.8665C19.6685 17.0416 19.5833 17.267 19.5833 17.5005C19.5833 17.7339 19.6685 17.9593 19.8229 18.1344C20.0702 18.4123 20.3136 18.6807 20.487 18.8551L23.2049 21.6208C23.299 21.7092 23.3742 21.8157 23.4261 21.934C23.4781 22.0522 23.5056 22.1796 23.507 22.3087C23.5084 22.4378 23.4837 22.5659 23.4344 22.6852C23.3851 22.8046 23.3122 22.9127 23.2201 23.0031C23.1279 23.0936 23.0185 23.1645 22.8983 23.2116C22.7781 23.2587 22.6496 23.281 22.5205 23.2772C22.3915 23.2734 22.2645 23.2436 22.1473 23.1895C22.03 23.1354 21.9249 23.0582 21.8383 22.9625L19.1272 20.2035C18.9355 20.0118 18.6672 19.7176 18.3902 19.4052C17.9237 18.8802 17.6662 18.2023 17.6667 17.5Z"
                    fill="black"
                  />
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_d_908_7709"
                  x="0"
                  y="0"
                  width="43"
                  height="43"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_908_7709"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_908_7709"
                    result="shape"
                  />
                </filter>
                <clipPath id="clip0_908_7709">
                  <rect
                    width="23"
                    height="23"
                    fill="white"
                    transform="translate(33 6) rotate(90)"
                  />
                </clipPath>
                <clipPath id="clip1_908_7709">
                  <rect
                    width="23"
                    height="23"
                    fill="white"
                    transform="translate(33 6) rotate(90)"
                  />
                </clipPath>
              </defs>
            </svg>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {message ? (
        <IonContent className="post-detail-page" fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList className="nobo-post-detail-background">
            <FeedListItem
              message={message}
              zoomAction={(i: number) => {
                try {
                  if (message && message.images && message.images.length > 0) {
                    let targetIndex = i;
                    // let zoomImageUrl = (message.images[0] || "").replace('[', '').replace(']', '').split("'").join('').split(',')[targetIndex];
                    // setImageZoom(zoomImageUrl);
                  }
                } catch (exZoomPicNoExist) {}
              }}
            />
          </IonList>
          {message.comments.map(c => (
            <PostComment message={message} comment={c} key={c.comment_id} />
          ))}
        </IonContent>
      ) : (
        ''
      )}
      <IonRow className="post-detail-create-comment">
        <IonCol size="2">
          <IonAvatar className="avatar-image">
            <img
              onClick={e => {
                e.preventDefault();
                // viewUser(history, msgComment.user_id, msgComment.account_type);
              }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                // currentTarget.src = '../../assets/images/nobo_logo_round.svg';
              }}
              src="https://thenobo.sfo3.digitaloceanspaces.com/production/84amuJRJRKEBhaMVIYbmY.png"
              alt="avatar"
            />
          </IonAvatar>
        </IonCol>
        <IonCol size="9">
          <IonInput
            value={commentMessage}
            onIonChange={(e: any) => setCommentMessage(e.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                createComment();
              }
            }}
            className="create-comment"
            placeholder="Add a comment..."
          ></IonInput>
        </IonCol>
      </IonRow>
    </IonPage>
  );
};

export default PostDetail;
