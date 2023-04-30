import { useCallback, useRef, useState } from "react";
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


interface UserPhoto {
  filepath: string;
  webviewPath?: string;

}


const ProfilePicture: React.FC = () => {
  const userService = new UserService()
  const history = useHistory();

  const [cameraPhoto, setCameraPhoto] = useState<UserPhoto[]>([])




  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + '.jpeg';
    const newPhotos = [
      {
        filepath: fileName,
        webviewPath: photo.base64String,
      },

    ];
    setCameraPhoto(newPhotos);

  };


  // clear the photo to take another
  const clearCameraPhoto = () => {
    setCameraPhoto([]);
  }

  const handleSubmit = async () => {
    //  console.log(cameraPhoto[0]?.webviewPath)
    let filename: any = cameraPhoto[0]?.webviewPath
    const name: any = cameraPhoto[0]?.filepath
    const formData = new FormData()
    formData.append("name", filename)
    formData.append("filename", name)

    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const token = JSON.parse(userToken);
      loadingStore.increment("Experience:timeout");
      userService.uploadProfileImg(token, filename)
        .then((res) => res)
        .then((res) => {
          if( res?.url){
            console.log("response is ok 200")
            loadingStore.decrement("SignUp:timeout");
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


          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", height: "300px", width: "300px", position: "relative" }}>

            <div style={{ position: "absolute", top: "16%", left: "16%" }}>
              <img
                className=""
                src="assets/images/nobo-profile-upload-circle.png"
                alt=""
              />

            </div>


            <div style={{ position: "absolute", top: "40%", left: "40%" }} >
              <img
                onClick={(e) => {
                  e.preventDefault();
                  // uploadProfilePic();
                  takePhoto()
                  console.log("starting camera")
                }}
                src="assets/images/nobo-profile-upload-plus.png"
                alt=""
              />
            </div>


            {/* PROFILE PICTURE DISPLAY */}
            {cameraPhoto[0] && (<div className="profile-picture-preview-image"  >


              <img src={`data:image/png;base64,${cameraPhoto[0]?.webviewPath}`} alt=""
                className='img'

              />


            </div>)}
            {cameraPhoto[0] && (<div style={{ height: '40px ', width: "40px", position: "absolute", left: "70%", top: "20%" }}
              onClick={(e) => {
                e.preventDefault();
                clearCameraPhoto()
              }}
            >
              <img src="assets/images/close-black.svg" alt="close" />
            </div>)}

            {/* CROPPER */}

            {/* {cameraPhoto[0] && (<div style={{ borderRadius: '50%', backgroundColor: "papayawhip", height: 250, width: 250, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", }}>
              <Cropper
              
                image={`data:image/png;base64,${cameraPhoto[0].webviewPath}`}
                // image={`assets/images/nobo-profile-upload-plus.png`}
                crop={crop2}
                zoom={zoom2}
                aspect={1}
                onCropChange={setCrop2}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom2}
                objectFit="horizontal-cover"
                cropShape="round"
              />
            </div>)} */}
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
            onClick={handleSubmit}
          // disabled=
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePicture;
