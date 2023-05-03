import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,

} from "@ionic/react";
import "cropperjs/dist/cropper.css";
import "./ProfilePicture.scss";
import { Camera, CameraResultType, CameraSource, } from '@capacitor/camera';
import Button from "../components/Button";
import "cropperjs/dist/cropper.css";
import { loadingStore } from "../loading-store";
import { UserService } from "../services/UserService";
import { Cropper } from "react-cropper";


const ProfilePicture: React.FC = () => {
  const userService = new UserService()
  const history = useHistory();
  const [profilePicData, setProfilePicData] = useState(Object);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [toggleCropper, setToggleCropper] = useState(false);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });
    setToggleCropper(true)
    setProfilePicData(photo)
    // const fileName = new Date().getTime() + '.jpeg';
    // const newPhotos = [
    //   {
    //     filepath: fileName,
    //     webviewPath: photo.base64String,
    //   },

    // ];
    // setCameraPhoto(newPhotos);

  };

  const handleSubmit = async () => {
    // history.push("/experience/profile-picture/follow-people")

    const imgData = profilePicPreview.split(",")[1]
    // console.log(" check the string data", imgData)
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const token = JSON.parse(userToken);
      loadingStore.increment("Experience:timeout");
      userService.uploadProfileImg(token, imgData)
        .then((res) => res)
        .then((res) => {
          if (res?.url) {
            console.log("response is ok 200")
            loadingStore.decrement("Profile-picture:timeout");
          history.push("/experience/profile-picture/follow-people")

          }

        })
        .catch((err: any) => {
          loadingStore.decrement("SignUp:timeout");
          console.log(" ProfilePicture error", err);
        });
    } else {
      return console.log("no token found");
    }
  };




  // clear the photo to take another
  const clearCameraPhoto = () => {
    setProfilePicPreview('');
  }




  async function executeProfilePicCrop() {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      let canvas = cropper.getCroppedCanvas({ maxWidth: 800, maxHeight: 800 });
      canvas.toBlob(function (blob: any) {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          // attempt to shrink image
          let tempImage: any = new Image();
          tempImage.src = reader.result;
          setTimeout(() => {
            let maxWidth = 400;
            let maxHeight = 300;
            let height = tempImage.height;
            let width = tempImage.width;
            if (height > maxHeight) {
              width = width / (height / maxHeight);
              height = maxHeight;
            }
            if (width > maxHeight) {
              height = height / (width / maxWidth);
              width = maxWidth;
            }
            let c = document.createElement('canvas');
            c.width = width;
            c.height = height;
            let ctx = c.getContext('2d');
            ctx?.drawImage(tempImage, 0, 0, width, height);

            let b64str = c.toDataURL('image/jpeg');
            let base64data = b64str; //(reader.result || "").toString();

            setProfilePicData({
              ...profilePicData,
              format: 'png',
              base64String: base64data.split(',')[1],
            });
            setProfilePicPreview(base64data);
          }, 500);
        };
      });
    }
    setToggleCropper(false);
  }


  const cropperRef = useRef<HTMLImageElement>(null);
  const onPhotoCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      /*let canvas =*/ cropper.getCroppedCanvas({
      maxWidth: 800,
      maxHeight: 800,
    });
    }
  };




  return (
    <IonPage id="profile-picture-page" className="profile-picture-main-container">
      <IonContent className="profile-picture-ion-content">
        <div className="profile-picture-header">
          <img
            onClick={() => {
              history.push("/get-started");
            }}
            className="profile-picture-back-btn"
            style={{ color: "black" }}
            height={23}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />

          <img
            className="profile-picture-nobo-logo"
            src="assets/images/nobo_logo.png"
            alt="logo"
          />
        </div>

        <IonRow>
          <IonCol className="profile-picture-title">PROFILE PICTURE</IonCol>
        </IonRow>
        <IonRow className="profile-picture-desc-container">
          <IonCol className="profile-picture-desc">
            To move foward, choose a profile photo for your style feed!
          </IonCol>
        </IonRow>

        <IonRow
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
        >


          <div className="profile-picture-image-container" >

            {toggleCropper || profilePicPreview.length > 3 ? "" : (<div style={{ position: "relative", }}>
              <IonRow >
                <IonCol>
                  <img
                    className=""
                    src="assets/images/nobo-profile-upload-circle.png"
                    alt=""
                  />
                </IonCol>

                {toggleCropper || profilePicPreview.length > 3 ? "" : (<IonCol style={{ position: "absolute", top: "35%", left: "35%" }} >
                  <img
                    onClick={(e) => {
                      e.preventDefault();
                      // uploadProfilePic();
                      takePhoto()
                      console.log("starting... camera")
                    }}
                    src="assets/images/nobo-profile-upload-plus.png"
                    alt=""
                  />
                </IonCol>)}

              </IonRow>


            </div>)}



            {/* PROFILE PICTURE DISPLAY */}
            {profilePicPreview !== '' && (
              <div className="profile-picture-preview-image">
                <img className='profile-photo-img' src={`${profilePicPreview}`} alt="" />
              </div>
            )}

            {profilePicPreview !== '' && (<div style={{ height: '40px ', width: "40px", position: "absolute", left: "70%", top: "20%" }}
              onClick={(e) => {
                e.preventDefault();
                clearCameraPhoto()
              }}
            >
              <img src="assets/images/close-black.svg" alt="close" />
            </div>)}


            {toggleCropper && (
              <div
                className="profile-picture-image-cropper" >
                <Cropper
                  className="profile-picture-cropper"
                  src={`data:image/png;base64,${profilePicData?.base64String}`}
                  // CropperJS options
                  style={{ height: '200px', borderRadius: "50%", }}
                  initialAspectRatio={75 / 75}
                  guides={false}
                  crop={onPhotoCrop}
                  // autoCropArea={1}
                  dragMode="move"
                  ref={cropperRef}
                  cropBoxMovable={false}
                  cropBoxResizable={false}
                  toggleDragModeOnDblclick={false}
                  highlight={false}
                />
              </div>
            )}


          </div>

          {toggleCropper && (<IonRow className="profile-picture-crop-done" >
            <IonCol style={{ textAlign: "center" }}>Drag photo to crop </IonCol>
            <IonButton onClick={(e) => {
              e.preventDefault();
              executeProfilePicCrop();
            }} style={{ color: "black" }} shape="round" size="large" color="medium">DONE</IonButton>
          </IonRow>)}
        </IonRow >
        <IonGrid>
        </IonGrid>

        <IonRow className={toggleCropper ? "profile-picture-skip-container" : "profile-picture-skip-container2"}>
          <IonCol className="profile-picture-skip-text"
            onClick={() => {

            }}
          >SKIP FOR NOW</IonCol>
        </IonRow>

        <div className="profile-picture-btn-container">
          <Button
            // className='profile-picture-btn'
            label="NEXT"
            large
            onClick={handleSubmit}
            disabled={profilePicPreview === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePicture;
