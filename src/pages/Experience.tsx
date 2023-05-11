import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./Experience.scss";
import { UserService } from "../services/UserService";
import { User } from "../models";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";

const Experience: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [selectedExperienceArray, setBrandSelectArray] = useState<string[]>([])
  const [expOptionSelected, setExpOptionSelected] = useState("")


  // Handling the ticker
  const handleTicker = (experienceOption: string) => {
    if (!selectedExperienceArray.includes(experienceOption, 0)) {
      selectedExperienceArray.push(experienceOption)

    } else {
      const experienceItem = selectedExperienceArray.filter((brand) => brand === experienceOption)
      setExpOptionSelected(experienceItem[0])
    }
  }

  const handleSubmit = async () => {
    userService
      .experience(expOptionSelected)
      .then((user: User) => {
        if(user){ 
        console.log(user);

          history.push("/profile-picture");
        }
      })
      .catch((err: any) => {
        console.log("experience error", err);
      });

  };


  return (
    <IonPage className="experience-main-container">
      <IonContent className="experience-ion-content">
        <div className="experience-header">
          <img
            onClick={() => {
              history.push("/get-started");
            }}
            className="experience-back-btn"
            style={{ color: "black" }}
            height={23}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />

          <img
            className="experience-nobo-logo"
            src="assets/images/nobo_logo.png"
            alt="logo"
          />
        </div>

        <IonRow>
          <IonCol className="experience-title">EXPERIENCE</IonCol>
        </IonRow>
        <IonRow className="experience-desc-container">
          <IonCol className="experience-desc">
            Select the category of clothing you prefer to shop. Don't worry, you
            can still vieww other experiences later
          </IonCol>
        </IonRow>

        <div className='experience-form-container'>

          {/* WOMEN */}
          <div
            className="experience-img-container"
            onClick={() => {
              handleTicker("women");
            }}
          >
            <img
              className={
                expOptionSelected === "women" ? "experience-img-container-selected2" : "experience-img-container-selected"
              }
              src="assets/images/experience-women.png"
              alt="women"
            />
            <h3
              style={{
                position: "absolute",
                color: "white",
                fontWeight: "bold",
              }}
            >
              WOMEN
            </h3>
            <div className="experience-checkbox">
              <Checkbox value={expOptionSelected === "women"} onChange={() => { }} />
            </div>
          </div>

          {/* MEN */}

          <div
            className="experience-img-container"
            onClick={() => {
              handleTicker("men");
            }}
          >
            <img
              className={expOptionSelected === "men" ? "experience-img-container-selected2" : "experience-img-container-selected"}
              src="assets/images/experience-men.png"
              alt="sneakers"
            />
            <h3
              style={{
                position: "absolute",
                color: "white",
                fontWeight: "bold",
              }}
            >
              MEN
            </h3>
            <div className="experience-checkbox">
              <Checkbox value={expOptionSelected === "men"} onChange={(e) => { }} />
            </div>
          </div>

          {/* SNEAKERS */}
          <div
            className="experience-img-container"
            onClick={() => {
              handleTicker("sneakers");
            }}
          >
            <img
              className={
                expOptionSelected === "sneakers" ? "experience-img-container-selected2" : "experience-img-container-selected"
              }
              src="assets/images/experience-sneaker.png"
              alt="sneakers"
            />
            <h3
              style={{
                position: "absolute",
                color: "white",
                fontWeight: "bold",
              }}
            >
              SNEAKERS
            </h3>
            <div className="experience-checkbox">
              <Checkbox value={expOptionSelected === "sneakers"} onChange={(e) => { }} />
            </div>
          </div>
        </div>

        <div className="experience-btn-container">
          <Button
            className="experience-btn"
            label="NEXT"
            large
            onClick={(e) => {
              e.preventDefault()
              handleSubmit();
            }}
            disabled={expOptionSelected === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Experience;
