
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
import "./FollowPeople.scss";
import Button from "../components/Button";
import "cropperjs/dist/cropper.css";
import { UserService } from "../services/UserService";


const SelectBrands: React.FC = () => {
  const userService = new UserService()
  const history = useHistory();
 


  return (
    <IonPage  className="follow-people-main-container">
      <IonContent className="follow-people-ion-content">
        <div className="follow-people-header">
          <img
            onClick={() => {
              history.goBack();
            }}
            className="follow-people-back-btn"
            style={{ color: "black" }}
            height={23}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />

          <img
            className="follow-people-nobo-logo"
            src="assets/images/nobo_logo.png"
            alt="logo"
          />
        </div>

        <IonRow>
          <IonCol className="follow-people-title">FOLLOW PEOPLE</IonCol>
        </IonRow>
        <IonRow className="follow-people-desc-container">
          <IonCol className="follow-people-desc">
           Let other people know your favourite brands to trade, buy, or sell
          </IonCol>
        </IonRow>

       <div className="follow-people-body-container">
        
       </div>
      

        <IonRow className={"follow-people-skip-container"}>
          <IonCol className="follow-people-skip-text"
            onClick={() => {

            }}
          >SKIP FOR NOW</IonCol>
        </IonRow>

        <div className="follow-people-btn-container">
          <Button
            // className='profile-picture-btn'
            label="NEXT"
            large
            onClick={()=>{}}
            // disabled={profilePicPreview === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectBrands;



  