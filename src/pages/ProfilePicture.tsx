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
import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";
import "./ProfilePicture.scss";

import Button from "../components/Button";
import { takePicture } from "../components/UrpCam";
import { UserService } from "../services/UserService";
import { loadingStore } from "../loading-store";

interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


const ProfilePicture: React.FC = () => {
  const userService = new UserService();

  const history = useHistory();
  const [profilePicData, setProfilePicData] = useState(Object);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [toggleCropper, setToggleCropper] = useState(false);


  async function uploadProfilePic() {
    let ppData = await takePicture({ quality: 90, active: true });
    setProfilePicData(ppData);
    setToggleCropper(true);
  }

  async function closeProfilePicCropper() {
    setToggleCropper(false);
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

  const resetPhotoState = () => {
    setProfilePicPreview('')
  }


  const handleSubmit = async () => {
    console.log("test")
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const token = JSON.parse(userToken);
      loadingStore.increment("Experience:timeout");
      userService.uploadProfileImg( token, profilePicPreview)
        .then(() => {
          console.log("");
        
        })
        .then(() => {
          loadingStore.decrement("SignUp:timeout");
          console.log("");
         
        })

        .catch((err: any) => {
          loadingStore.decrement("SignUp:timeout");
          console.log("signup error", err);
        });
    } else {
      return console.log("no token found");
    }
  };


  console.log(profilePicPreview);

  return (
    <IonPage className="profile-picture-main-container">
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


          <div style={{ backgroundColor: "transparent", height: "300px", width: "300px", position: "relative" }}>


            {!toggleCropper && (<div style={{ position: "absolute", top: "16%", left: "16%" }}>
              <img
                className=""
                src="assets/images/nobo-profile-upload-circle.png"
                alt=""
              />

            </div>)}


            {!toggleCropper && (<div style={{ position: "absolute", top: "40%", left: "40%" }} >
              <img
                onClick={(e) => {
                  e.preventDefault();
                  uploadProfilePic();
                }}
                src="assets/images/nobo-profile-upload-plus.png"
                alt=""
              />
            </div>)}

            {/* PHOTO CROPPER */}
            {toggleCropper && (

              <Cropper


                src={`data:image/png;base64,${profilePicData?.base64String}`}
                style={{ position: "absolute", backgroundColor: "none", top: "15%", left: "30%", borderRadius: "50%" }}
                zoomTo={0.3}
                guides={false}
                background={false}
                dragMode="move"
                ref={cropperRef}
                cropBoxMovable={false}
                cropBoxResizable={false}
                toggleDragModeOnDblclick={true}
                highlight={false}
                frameBorder={0}
                initialAspectRatio={75 / 75}

              />

            )}


            {/* PROFILE PICTURE DISPLAY */}


            {profilePicPreview !== '' ? (
              <div
                className="profile-picture-preview-image"

                style={{
                  background: `url(${profilePicPreview})`,
                  backgroundSize: 'contain',

                }}
              ></div>
            ) : ""}
            {profilePicPreview !== '' && (<div style={{ height: '40px ', width: "40px", position: "absolute", left: "70%", top: "20%" }}
              onClick={(e) => {
                e.preventDefault();
                resetPhotoState()
              }}
            >
              <img src="assets/images/close-black.svg" alt="close" />
            </div>)}

         { toggleCropper &&  (<div style={{position:"absolute", width:"100%", top:"80%"}}>
          <IonRow>
            <IonCol style={{ marginTop: "40px", textAlign: "center" }}>Drag Photo To Crop</IonCol>
          </IonRow>
          <IonRow className="profile-picture-cropper-info">
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                closeProfilePicCropper();
              }}
            >Cancel</IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                executeProfilePicCrop();
              }}
            >Done</IonButton>
          </IonRow>

        </div>)}

          </div>







        </IonRow >
        <IonGrid>


        </IonGrid>
      

        <IonRow className="profile-picture-skip-container">
          <IonCol className="profile-picture-skip-text">SKIP FOR NOW</IonCol>
        </IonRow>

        <div className="profile-picture-btn-container">
          <Button
            // className='profile-picture-btn'
            label="NEXT"
            large
            onClick={(e)=>{
              // handleSubmit()
              console.log(e)
            }}
            disabled={profilePicPreview.length < 1}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePicture;
