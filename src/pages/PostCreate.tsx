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
import { FeedService } from '../services/FeedService';
import { UserService } from '../services/UserService';
import { OverlayEventDetail } from '@ionic/core/components';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { environment } from "../environments/environment";
import { loadingOptions } from '../util';
import { IKContext, IKUpload } from 'imagekitio-react';

interface InternalValues {
  file: any;
}

const publicKey = environment?.videoLibraryPublicKey || 'public_pqTTDCXhzT8ZmQ4RFQUCQYkKY0s=';
const authenticationEndpoint = environment?.videoAuthenticationEndpoint || 'https://api.noboplus.com/auth/video';
const urlEndpoint = environment?.videoUrlEndpoint || 'https://ik.imagekit.io/nobovideo/';

const PostCreate: React.FC = () => {
  const [userId, setUserId] = useState<number>();
  const [data, setData] = useState<string>();
  const [highlightLink, setHighlightLink] = useState<string>('');
  const [highlightLinkValid, setHighlightLinkValid] = useState<boolean>(true);
  const validUrlRegex =
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  const feedService = new FeedService();
  const userService = new UserService();
  const history = useHistory();
  const [postImages, setPostImages] = useState('');
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
          onIonChange={(e) => setValue(e.detail.value!)}
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

    userService
      .getProfile(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        setProfilePic(
          data.basic_user_profile.profile_image?.String ||
          `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/pictures/${userId}/profile.jpeg?fail`
        );
      });
  });

  function embedLink(origlink: string) {
    const url = new URL(origlink);
    const youtubeEmbedLinkBase = 'https://www.youtube.com/embed/';
    const hudlEmbedLinkBase = 'https://www.hudl.com/embed/video';

    let v = url.searchParams.get('v');

    if (v) {
      return `${youtubeEmbedLinkBase}${v}`;
    } else if (
      origlink.includes('https://www.hudl.com/') &&
      !origlink.includes('embed')
    ) {
      return origlink.replace('https://www.hudl.com/video', hudlEmbedLinkBase);
    } else if (origlink.includes('https://youtu.be')) {
      return (
        youtubeEmbedLinkBase + origlink.substring(origlink.lastIndexOf('/') + 1)
      );
    }

    return origlink;
  }

  function validate() {
    return !!data || postImages !== '' || highlightLinkValid;
  }

  function post() {
    console.log('Posting!!!');
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    let photoUrlString = '[]';
    try {
      photoUrlString = JSON.stringify(
        postImages.split(',').filter((pi) => pi.length > 0)
      )
        .split('"')
        .join("'");
    } catch (exPhotoUrlStringSetting) {
      console.log('error building photo array');
    }
    let req = {
      user_id: user.user['user_id'],
      Data: data,
      photo_url: photoUrlString,
      video_url: highlightLink ? embedLink(highlightLink) : '',
      location: selected,
    };
    console.log('Post: ', req);
    presentLoading(loadingOptions);
    isLoading = true;
    setIsLoading(isLoading);
    feedService
      .post(req, user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        console.log('Feed: ', data);
        history.push('/home');
        setData('');
        isLoading = false;
        setIsLoading(isLoading);
        dismissLoading();
      })
      .catch(() => {
        isLoading = false;
        setIsLoading(isLoading);
        dismissLoading();
      })
  }

  const formData = new FormData();
  const onPostImageFileChange = async (fileChangeEvent: any) => {
    // let storage: any = window.localStorage.getItem("persistedState");
    // let user = JSON.parse(storage);

    postImgeFileUploadVals.current.file = fileChangeEvent.target.files[0];
    formData.append(
      'file',
      postImgeFileUploadVals?.current.file,
      postImgeFileUploadVals?.current.file.name
    );

    const response = await fetch(`${environment.serverUrl}/upload/${userId}/post`, {
      method: 'POST',
      body: formData,
    });

    const returnValues = await response.json();
    try {
      let curPostImages = postImages.split(',').map((cpi) => {
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
      if (
        pi.trim().toUpperCase() === imgPath.trim().toUpperCase() ||
        pi === ''
      ) {
        // effectively removing it from the list
      } else {
        updatedPostImages.push(pi);
      }
    });
    setPostImages(updatedPostImages.join(','));
    validate();
  }

  const onError = (err: any) => {
    console.log("Error", err);
    // document?.querySelector('.video-upload-file-progress .progress')?.setAttribute('style',`display:none`);
    setProgressActive(false);
    setUploadVideoMode(false);
  };

  const onSuccess = (res: any) => {
    console.log("Success", res);
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
    document?.querySelector('.video-upload-file-progress .progress')?.setAttribute('style', `width:${Math.round(loadPercent)}%`)
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
          <IonGrid style={{ backgroundColor: 'white' }}>
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
                    onClick={(e) => {
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
            <IonCol size="12">
              <IonItem className="nobo-post-input-area">
                <div className="nobo-post-input-text">
                  <IonTextarea
                    className="post-text"
                    value={data}
                    autocapitalize="on sentence"
                    spellcheck={true}
                    onIonChange={(e) => setData(e.detail.value!)}
                    placeholder="Write a post..."
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
                  <div style={{ display: 'flex' }}>
                    <div style={{ padding: '8px 0', fontSize: '12px' }}>
                      {selected}
                    </div>
                    <div style={{ flexGrow: 1 }} className="post-input-count">
                      {data ? data.length : 0}/{350}
                    </div>
                  </div>

                </div>
                <img
                  className="post-create-bubble"
                  src={profilePic}
                  alt="avatar"
                ></img>
                <div className="nobo-post-tool-menu" style={{ right: '30px' }}>
                  <input
                    type="file"
                    ref={postImgeFileUploadRef}
                    className="nobo-file-upload post-image"
                    onChange={(ev) => onPostImageFileChange(ev)}
                    accept="image/*"
                  ></input>
                  <svg
                    className="nobo-add-image"
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
                      fillOpacity="0.2"
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
                      strokeWidth="0.5"
                    />
                  </svg>
                  &nbsp; &nbsp;
                  <svg
                    className="nobo-add-video"
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
                      fillOpacity="0.2"
                    />
                    <path
                      d="M18.2776 8.66667C18.1377 8.66667 17.9955 8.70417 17.8668 8.78542L15.3905 10.2417V8.99583C15.3905 8.44583 14.8668 8 14.2212 8H7.1693C6.5237 8 6 8.44583 6 8.99583V15.0042C6 15.5542 6.5237 16 7.1693 16H14.2212C14.8668 16 15.3905 15.5542 15.3905 15.0042V13.7583L17.8645 15.2146C17.9932 15.2979 18.1377 15.3333 18.2754 15.3333C18.6501 15.3333 19 15.0625 19 14.6771V9.32292C19.0022 8.9375 18.6524 8.66667 18.2776 8.66667ZM14.6682 15.0042C14.6682 15.1833 14.4627 15.3333 14.2212 15.3333H7.1693C6.92776 15.3333 6.72235 15.1833 6.72235 15.0042V8.99583C6.72235 8.81667 6.92776 8.66667 7.1693 8.66667H14.2212C14.4627 8.66667 14.6682 8.81667 14.6682 8.99583V15.0042ZM18.2799 14.6771L18.2528 14.65L15.3905 12.9667V11.0312L18.2799 9.33333V14.6771Z"
                      fill="#00816D"
                    />
                  </svg>

                </div>
                <div
                  onClick={() => {
                    setShowVideoLink(!showVideoLink);
                  }}
                  className="nobo-post-tool-menu"
                >
                  <svg
                    className="nobo-add-image"
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="18"
                      fill="#CCDBDC"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M27.4165 13C27.2065 13 26.9932 13.0562 26.8002 13.1781L23.0858 15.3625V13.4938C23.0858 12.6688 22.3002 12 21.3318 12H10.7539C9.78555 12 9 12.6688 9 13.4938V22.5063C9 23.3313 9.78555 24 10.7539 24H21.3318C22.3002 24 23.0858 23.3313 23.0858 22.5063V20.6375L26.7968 22.8219C26.9898 22.9469 27.2065 23 27.4131 23C27.9752 23 28.5 22.5938 28.5 22.0156V13.9844C28.5034 13.4062 27.9785 13 27.4165 13ZM22.0022 22.5063C22.0022 22.775 21.6941 23 21.3318 23H10.7539C10.3916 23 10.0835 22.775 10.0835 22.5063V13.4938C10.0835 13.225 10.3916 13 10.7539 13H21.3318C21.6941 13 22.0022 13.225 22.0022 13.4938V22.5063ZM27.4198 22.0156L27.3792 21.975L23.0858 19.45V16.5469L27.4198 14V22.0156Z"
                      fill="#00816D"
                    />
                  </svg>

                </div>

                {/* <div className="nobo-video-file-uploader-container">
                  &nbsp; &nbsp;
                  <svg
                    className="nobo-upload-video"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="12"
                      fill="#CCDBDC"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M18.2776 8.66667C18.1377 8.66667 17.9955 8.70417 17.8668 8.78542L15.3905 10.2417V8.99583C15.3905 8.44583 14.8668 8 14.2212 8H7.1693C6.5237 8 6 8.44583 6 8.99583V15.0042C6 15.5542 6.5237 16 7.1693 16H14.2212C14.8668 16 15.3905 15.5542 15.3905 15.0042V13.7583L17.8645 15.2146C17.9932 15.2979 18.1377 15.3333 18.2754 15.3333C18.6501 15.3333 19 15.0625 19 14.6771V9.32292C19.0022 8.9375 18.6524 8.66667 18.2776 8.66667ZM14.6682 15.0042C14.6682 15.1833 14.4627 15.3333 14.2212 15.3333H7.1693C6.92776 15.3333 6.72235 15.1833 6.72235 15.0042V8.99583C6.72235 8.81667 6.92776 8.66667 7.1693 8.66667H14.2212C14.4627 8.66667 14.6682 8.81667 14.6682 8.99583V15.0042ZM18.2799 14.6771L18.2528 14.65L15.3905 12.9667V11.0312L18.2799 9.33333V14.6771Z"
                      fill="#00816D"
                    />
                  </svg>

                </div> */}
              </IonItem>
              <IonGrid id="open-modal" className="nobo-add-location-grid">
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem button detail={true}>
                <IonLabel className="nobo-add-location-label">
                  Add Location
                </IonLabel>
                <IonNote slot="end"></IonNote>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
            </IonCol>
          </IonRow>
          {showVideoLink && (
            <IonRow>
              <IonCol>
                <>

                  {/* <span
                    className="nobo-optional"
                    style={{
                      color: '#d6d6d6',
                      paddingLeft: '0.5rem',
                    }}
                  >
                    <p>
                      Highlight link should be a Youtube or Hudl URL, or you can upload using the "Upload" button below. Please
                      verify your video displays correctly in the preview window
                      which should appear below after you provide a link.
                    </p>
                  </span> */}
{/*                  {!uploadVideoMode &&
                    <div className='nobo-video-upload-button'>
                      Upload Video
                      <IKContext
                        publicKey={publicKey}
                        urlEndpoint={urlEndpoint}
                        authenticationEndpoint={authenticationEndpoint}
                      ></IKContext>
                      <IKUpload
                        className="nobo-video-file-uploader-control"
                        publicKey={publicKey}
                        authenticationEndpoint={authenticationEndpoint}
                        urlEndpoint={urlEndpoint}
                        // fileName="test-upload-2."
                        // tags={["sample-tag1", "sample-tag2"]}
                        // customCoordinates={"10,10,10,10"}
                        // isPrivateFile={false}
                        // useUniqueFileName={true}
                        // responseFields={["tags"]}
                        validateFile={(file:any) => {
                          let fileMax = environment?.maxVideoFileSize || 1048; // 5760 ; // approx 10MB
                          if(file.size < fileMax){
                            return true;
                          } else {
                            alert('Video file is too large, must be less than 10MB');
                            return false;
                          }}}
                        // folder={"/sample-folder"}
                        // extensions={[{
                        //   "name": "remove-bg",
                        //   "options": {
                        //     "add_shadow": true,
                        //   },
                        // }]}
                        // webhookUrl="https://www.example.com/imagekit-webhook" // replace with your webhookUrl
                        // overwriteFile={true}
                        // overwriteAITags={true}
                        // overwriteTags={true}
                        // overwriteCustomMetadata={true}
                        onError={onError}
                        onSuccess={onSuccess}
                        onUploadProgress={onUploadProgress}
                        onUploadStart={onUploadStart}
                      />
                    </div>
                  }*/}

                  {progressActive &&
                    <div className="video-upload-file-progress" onClick={() => {
                      // alert('uploading from computer');
                    }}>
                      <div className='progress'>{videoUploadComplete && <span>Video Uploaded</span>}</div>
                    </div>
                  }

                  {!uploadVideoMode &&
                    <>
                      {/*<div className="nobo-upload-text-or">OR</div>*/}
                      <div className="nobo-upload-text-hl">Highlight Link</div>
                      <IonItem
                        className={
                          'nobo-input' + (highlightLinkValid ? '' : ' invalid')
                        }
                        lines="full"
                      >
                        <IonInput
                          value={highlightLink}
                          style={uploadVideoMode ? { display: "none" } : { display: "block" }}
                          onIonChange={(e) => {
                            const target: any = e.target;
                            setHighlightLinkValid(
                              target.nativeInput.validity.valid
                            );
                            setHighlightLink(e.detail.value!);
                          }}
                          placeholder="https://www.youtube.com/watch?v=4x4MND-Rhrc"
                          type="url"
                          pattern="^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$"
                        ></IonInput>
                      </IonItem>

                    </>
                  }


                </>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
        <div className="nobo-post-image-gallery">
          {postImages.trim() !== '' &&
            postImages.split(',')?.map((pi) => {
              if (pi !== '') {
                return (
                  <div className="">
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
        <IonModal
          ref={modal}
          trigger="open-modal"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Locations</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  strong={true}
                  onClick={() => modal.current?.dismiss()}
                >
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

