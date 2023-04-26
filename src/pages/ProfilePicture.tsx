import {  useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./ProfilePicture.scss";

import Button from "../components/Button";
import  { takePicture } from "../components/UrpCam";

const ProfilePicture: React.FC = () => {
  const history = useHistory();
  const [profilePicData, setProfilePicData] = useState(Object);
  const [imageCropper, setTImageCropper] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState("");

  useIonViewWillEnter(() => {});
  const getImage = async () => {
    let ImageData = await takePicture({ quality: 90, active: true });
    setTImageCropper(true);
    setProfilePicData(ImageData);
  };

  // console.log("earlier",profilePicData);
  console.log(profilePicData);

  return (
    <IonPage className="profile-picture-main-container">
      <IonContent className="profile-picture-ion-content">
        {/* <div className='profile-picture-header-container'>
       <Header
      title=''
      subtitle=''
      />
       <img
            className='profile-picture-nobo-logo'
            src="assets/images/nobo_logo.png"
            alt="logo"
          />
       </div> */}
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
          }}
        >
          <div>
            <img
              className="photo-button-container"
              src="assets/images/nobo-profile-upload-circle.png"
              alt=""
            />
          </div>

          <img
            onClick={(e) => {
              console.log("get photo");
              e.preventDefault();
              getImage();
            }}
            className="photo-plus-icon"
            src="assets/images/nobo-profile-upload-plus.png"
            alt=""
          />
        </IonRow>
        <div
          style={{
            background: `url(${profilePicPreview})`,
            backgroundSize: "contain",
          }}
        ></div>

        <IonRow className="profile-picture-skip-container">
          <IonCol className="profile-picture-skip-text">SKIP FOR NOW</IonCol>
        </IonRow>

        <div className="profile-picture-btn-container">
          <Button
            // className='profile-picture-btn'
            label="NEXT"
            large
            onClick={() => {}}
            // disabled={experienceOption === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePicture;
