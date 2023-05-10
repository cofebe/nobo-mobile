import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonCol,
  IonContent,
  IonButton,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonToolbar,
  IonTextarea,
  useIonViewWillEnter,
  useIonLoading,
  IonNote,
  IonInput,
  IonModal,
  IonButtons,
  IonTitle,
  IonSearchbar,
} from '@ionic/react';
import './PostCreate.css';
import { AuthService } from '../services/AuthService';
import { FeedService } from '../services/FeedService';
import { UserService } from '../services/UserService';
import { OverlayEventDetail } from '@ionic/core/components';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { environment } from '../environments/environment';
import { loadingOptions } from '../util';
import { IKContext, IKUpload } from 'imagekitio-react';

interface InternalValues {
  file: any;
}

const publicKey = environment?.videoLibraryPublicKey || 'public_pqTTDCXhzT8ZmQ4RFQUCQYkKY0s=';
const urlEndpoint = environment?.videoUrlEndpoint || 'https://ik.imagekit.io/nobovideo/';

const PostCreate: React.FC = () => {
  const [userId, setUserId] = useState<number>();
  const [data, setData] = useState<string>();
  const [highlightLink, setHighlightLink] = useState<string>('');
  const [highlightLinkValid, setHighlightLinkValid] = useState<boolean>(true);
  const validUrlRegex =
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  const authService = new AuthService();
  const feedService = new FeedService();
  const userService = new UserService();
  const history = useHistory();
  const [postImages, setPostImages] = useState('');
  const [postImageName, setPostImageName] = useState('');
  const postImgeFileUploadRef = useRef(null);
  let [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  const [disabledPost, setDisabledPost] = useState(!validate());
  const postImgeFileUploadVals = useRef<InternalValues>({
    file: false,
  });
  const [showVideoLink, setShowVideoLink] = useState(false);
  const [profilePic, setProfilePic] = useState<string>('');
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const [selected, setSelected] = useState<any>();
  const [progressActive, setProgressActive] = useState(false);
  const [uploadVideoMode, setUploadVideoMode] = useState(false);
  const [videoUploadComplete, setVideoUploadComplete] = useState(false);

  const PlacesAutocomplete = ({ setSelected }: any) => {
    const {
      ready,
      setValue,
      suggestions: { status, data },
    } = usePlacesAutocomplete();

    return (
      <div>
        <IonSearchbar
          onIonChange={e => setValue(e.detail.value!)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search an address"
        />
        <IonGrid>
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <IonRow>
                <IonCol>
                  <IonItem key={place_id}>
                    <IonLabel
                      onClick={() => {
                        setSelected(description);
                        confirm();
                      }}
                    >
                      {description}
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
            ))}
        </IonGrid>
      </div>
    );
  };

  const confirm = () => {
    modal.current?.dismiss(input.current?.value, 'confirm');
  };

  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    if (ev.detail.role === 'confirm') {
    }
  };

  useEffect(() => {
    // re-render the image previews
    setDisabledPost(!validate());
    setDisabledPost(!validate());
  }, [postImages, highlightLink, data]);

  useIonViewWillEnter(() => {
    setSelected('');
    setPostImages('');
    setShowVideoLink(false);
    setHighlightLink('');
    setVideoUploadComplete(false);
    setUploadVideoMode(false);
    setProgressActive(false);
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    setUserId(user.user['user_id']);
    console.log(user);

    userService
      .getProfile(authService.getUserId())
      .then(res => res.json())
      .then(data => {
        console.log('Getprofile: ', data['user']['avatar']);
        setProfilePic(data['user']['avatar']);
      });
  });

  function embedLink(origlink: string) {
    const url = new URL(origlink);
    const youtubeEmbedLinkBase = 'https://www.youtube.com/embed/';
    const hudlEmbedLinkBase = 'https://www.hudl.com/embed/video';

    let v = url.searchParams.get('v');

    if (v) {
      return `${youtubeEmbedLinkBase}${v}`;
    } else if (origlink.includes('https://www.hudl.com/') && !origlink.includes('embed')) {
      return origlink.replace('https://www.hudl.com/video', hudlEmbedLinkBase);
    } else if (origlink.includes('https://youtu.be')) {
      return youtubeEmbedLinkBase + origlink.substring(origlink.lastIndexOf('/') + 1);
    }

    return origlink;
  }

  function validate() {
    return !!data || postImages !== '' || highlightLinkValid;
  }

  function post() {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    let photoUrlString = '[]';
    try {
      photoUrlString = JSON.stringify(postImages.split(',').filter(pi => pi.length > 0))
        .split('"')
        .join("'");
    } catch (exPhotoUrlStringSetting) {
      console.log('error building photo array');
    }

    let userImage = null;

    if (postImages !== '') {
      userImage = {
        originalName: postImageName,
        url: postImages,
      };
    }

    let req = {
      userMessage: data,
      userImage: userImage,
    };

    console.log('Post: ', req);
    presentLoading(loadingOptions);
    isLoading = true;
    setIsLoading(isLoading);
    feedService
      .post(req)
      .then(res => res.json())
      .then(data => {
        console.log('Feed: ', data);
        history.push('/home/style-feed');
        setData('');
        isLoading = false;
        setIsLoading(isLoading);
        dismissLoading();
      })
      .catch(() => {
        isLoading = false;
        setIsLoading(isLoading);
        dismissLoading();
      });
  }

  const formData = new FormData();
  const onPostImageFileChange = async (fileChangeEvent: any) => {
    let file = fileChangeEvent.target.files;

    let obj = new FormData();
    obj.append('file', file[0]);

    postImgeFileUploadVals.current.file = fileChangeEvent.target.files[0];
    const response = await feedService.uploadImage(obj);

    const returnValues = await response.json();

    setPostImages(returnValues['url']);
    setPostImageName(postImgeFileUploadVals?.current.file.name);

    try {
      let curPostImages = postImages.split(',').map(cpi => {
        return cpi.trim();
      });
      let newPostImage: string = returnValues?.photo_url;
      if (newPostImage) {
        curPostImages?.push(newPostImage);
        setPostImages(curPostImages.join(','));
      }
    } catch (exPostImages) {
      console.log('There was an issue sending the image in the post');
    }
  };

  function cancel() {
    history.goBack();
  }

  function removePostImage(imgPath: string) {
    let updatedPostImages: string[] = [];
    postImages?.split(',')?.forEach((pi: string) => {
      if (pi.trim().toUpperCase() === imgPath.trim().toUpperCase() || pi === '') {
        // effectively removing it from the list
      } else {
        updatedPostImages.push(pi);
      }
    });
    setPostImages(updatedPostImages.join(','));
    validate();
  }

  const onError = (err: any) => {
    console.log('Error', err);
    // document?.querySelector('.video-upload-file-progress .progress')?.setAttribute('style',`display:none`);
    setProgressActive(false);
    setUploadVideoMode(false);
  };

  const onSuccess = (res: any) => {
    console.log('Success', res);
    // const target: any = e.target;
    setHighlightLinkValid(true);
    setHighlightLink(res?.url);
    setProgressActive(true);
    setVideoUploadComplete(true);
  };

  const onUploadProgress = (progress: any) => {
    //let containerWidth = document?.querySelector('.video-upload-file-progress')?.clientWidth;
    let loadPercent = (progress?.loaded / progress?.total) * 100;
    // console.log("Progress", progress);
    // console.log(`total${progress?.total}  loaded${progress?.loaded}`);
    console.log(loadPercent);
    document
      ?.querySelector('.video-upload-file-progress .progress')
      ?.setAttribute('style', `width:${Math.round(loadPercent)}%`);
    // document?.querySelector('.video-upload-file-progress')?.setAttribute('style', `opacity:1`);
    // document?.querySelector('.video-upload-file-progress')?.setAttribute('style', `height:50px`);
  };

  const onUploadStart = (evt: any) => {
    //console.log("Start", evt);
    setProgressActive(true);
    setUploadVideoMode(true);
    // document?.querySelector('.video-upload-file-progress .progress')?.setAttribute('style', `display:block`);
  };

  return (
    <IonPage className="post-create">
      <IonHeader className="post-header">
        <IonToolbar className="post-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonItem className="post-header-item" lines="none">
                  <IonButton
                    buttonType=""
                    color="#D6980E"
                    fill="clear"
                    className="cancel-btn"
                    size="large"
                    slot="start"
                    onClick={e => {
                      e.preventDefault();
                      cancel();
                    }}
                  >
                    Cancel
                  </IonButton>
                  <IonButton
                    buttonType=""
                    className="post-btn"
                    size="large"
                    disabled={disabledPost}
                    slot="end"
                    onClick={e => {
                      e.preventDefault();
                      post();
                    }}
                  >
                    Post
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="post-content" fullscreen>
        <IonGrid className="post-grid">
          <IonRow>
            <IonCol size="12" className="nobo-post-container">
              <IonItem className="nobo-post-input-area" lines="none">
                <div className="nobo-post-input-text">
                  <IonTextarea
                    className="post-text"
                    value={data}
                    autocapitalize="on sentence"
                    spellcheck={true}
                    onIonChange={e => setData(e.detail.value!)}
                    placeholder="Share a post..."
                    maxlength={350}
                    autoGrow={true}
                    rows={5}
                  ></IonTextarea>
                  {validUrlRegex.test(highlightLink) && showVideoLink && (
                    <span>
                      <div style={{ width: '100%' }}>
                        <div className="nobo-highlight-video-container">
                          <iframe
                            title="highlight"
                            className="nobo-highlight-video"
                            src={embedLink(highlightLink)}
                          />
                        </div>
                      </div>
                    </span>
                  )}
                </div>
                <img className="post-create-bubble" src={profilePic} alt="avatar"></img>
              </IonItem>
            </IonCol>
            <IonCol size="12">
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '8px 0', fontSize: '12px' }}>{selected}</div>
                <div className="post-input-count">
                  {data ? data.length : 0}/{350}
                </div>
                <div className="nobo-post-tool-menu" style={{ paddingTop: '10px', right: '40px' }}>
                  <svg
                    className="nobo-post-tool-menu"
                    style={{ alignSelf: 'right' }}
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_412_9992)">
                      <circle cx="22" cy="22" r="18" fill="white" />
                      <path
                        d="M27.8928 28.489L21.8178 19.3015C21.6936 19.1136 21.4797 19 21.25 19C21.0203 19 20.8064 19.1136 20.6822 19.3015L14.6072 28.489C14.5417 28.5881 14.5048 28.7026 14.5004 28.8204C14.4961 28.9381 14.5245 29.0549 14.5825 29.1583C14.6407 29.2618 14.7263 29.3481 14.8306 29.4082C14.9349 29.4683 15.0538 29.5 15.1751 29.5H27.3249C27.5719 29.5 27.7991 29.369 27.9175 29.1581C27.9755 29.0547 28.0039 28.938 27.9996 28.8203C27.9952 28.7025 27.9583 28.5881 27.8928 28.489ZM21.25 19.6562L23.4197 22.9375H21.1104L19.9 24.1142L18.9268 23.1699L21.25 19.6562ZM15.1751 28.8438L18.554 23.7334L19.9 25.042L21.3896 23.5938H23.8534L27.3249 28.8438H15.1751Z"
                        fill="#D6980E"
                      />
                      <rect
                        x="13.25"
                        y="14.75"
                        width="16"
                        height="14.5"
                        rx="1.75"
                        stroke="#D6980E"
                        stroke-width="0.5"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_412_9992"
                        x="0"
                        y="0"
                        width="44"
                        height="44"
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
                        <feOffset />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.439216 0 0 0 0 0.439216 0 0 0 0 0.439216 0 0 0 0.15 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_412_9992"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_412_9992"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                  <input
                    type="file"
                    ref={postImgeFileUploadRef}
                    className="nobo-file-upload post-image"
                    onChange={ev => onPostImageFileChange(ev)}
                    accept="image/*"
                  ></input>
                </div>
              </div>
            </IonCol>
          </IonRow>
          {showVideoLink && (
            <IonRow>
              <IonCol>
                <>
                  {progressActive && (
                    <div
                      className="video-upload-file-progress"
                      onClick={() => {
                        // alert('uploading from computer');
                      }}
                    >
                      <div className="progress">
                        {videoUploadComplete && <span>Video Uploaded</span>}
                      </div>
                    </div>
                  )}

                  {!uploadVideoMode && (
                    <>
                      {/*<div className="nobo-upload-text-or">OR</div>*/}
                      <div className="nobo-upload-text-hl">Highlight Link</div>
                      <IonItem
                        className={'nobo-input' + (highlightLinkValid ? '' : ' invalid')}
                        lines="full"
                      >
                        <IonInput
                          value={highlightLink}
                          style={uploadVideoMode ? { display: 'none' } : { display: 'block' }}
                          onIonChange={e => {
                            const target: any = e.target;
                            setHighlightLinkValid(target.nativeInput.validity.valid);
                            setHighlightLink(e.detail.value!);
                          }}
                          placeholder="https://www.youtube.com/watch?v=4x4MND-Rhrc"
                          type="url"
                          pattern="^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$"
                        ></IonInput>
                      </IonItem>
                    </>
                  )}
                </>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
        {postImages.trim() !== '' && (
          <div className="nobo-post-image-gallery">
            {postImages.split(',')?.map(pi => {
              if (pi !== '') {
                return (
                  <div>
                    <img src={pi} alt="Post" />
                    <div
                      className="nobo-image-remove"
                      onClick={() => {
                        removePostImage(pi);
                      }}
                    >
                      Remove
                    </div>
                  </div>
                );
              }
              return '';
            })}
          </div>
        )}
        <IonModal ref={modal} trigger="open-modal" onWillDismiss={ev => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Locations</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => modal.current?.dismiss()}>
                  Cancel
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <PlacesAutocomplete setSelected={setSelected} />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default PostCreate;
