import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./Experience.scss";
import { loadingStore } from "../loading-store";
import { UserService } from "../services/UserService";
import { ResData } from "../models";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";

const Experience: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [experienceOption, setExperienceOption] = useState("");
  const [menCheckbox, setmenCheckbox] = useState(false);
  const [womenCheckbox, setWomenCheckbox] = useState(false);
  const [sneakersCheckbox, setSneakersCheckbox] = useState(false);

  useIonViewWillEnter(() => {
    // some code here
  });

  const handleTicker = (arg: string) => {
    setExperienceOption(arg);
    // console.log(experienceOption);
    const handleSneakers = () => {
      setSneakersCheckbox(true);
      setWomenCheckbox(false);
      setmenCheckbox(false);
    };
    const handleW = () => {
      setSneakersCheckbox(false);
      setWomenCheckbox(true);
      setmenCheckbox(false);
    };
    const handleM = () => {
      setSneakersCheckbox(false);
      setWomenCheckbox(false);
      setmenCheckbox(true);
    };

    switch (arg) {
      case "women":
        handleW();

        break;

      case "men":
        handleM();

        break;

      case "sneakers":
        handleSneakers();

        break;

      default:
        break;
    }
  };

  const handleSubmit = async (experienceOption: string) => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const token = JSON.parse(userToken);
      loadingStore.increment("Experience:timeout");
      userService
        .experience(experienceOption, token)
        .then((user: ResData) => {
          console.log(user.currentUser);
          window.localStorage.setItem(
            "userExperienceData",
            JSON.stringify(user.currentUser)
          );
        })
        .then(() => {
          loadingStore.decrement("SignUp:timeout");
          history.push("/experience/profile-picture");
        })

        .catch((err: any) => {
          loadingStore.decrement("SignUp:timeout");
          console.log("signup error", err);
        });
    } else {
      return console.log("no token found");
    }
  };

  // push a fuction base on user prefrence
  // function checkCase() {
  //   switch (experienceOption) {
  //     case "women":
  //       handleNext(experienceOption);

  //       break;

  //     case "men":
  //       handleNext(experienceOption);

  //       break;

  //     case "sneakers":
  //       handleNext(experienceOption);

  //       break;

  //     default:
  //       break;
  //   }
  // }

  return (
    <IonPage className="experience-main-container">
      <IonContent className="experience-ion-content">
        <div className="experience-header">
          <img
            onClick={() => {
              history.goBack();
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

        <form>
          {/* WOMEN */}

          <div
            className="experience-img-container"
            onClick={() => {
              handleTicker("women");
            }}
          >
            <img
              className={
                womenCheckbox ? "experience-img-container-selected" : ""
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
              <Checkbox value={womenCheckbox} onChange={() => {}} />
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
              className={menCheckbox ? "experience-img-container-selected" : ""}
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
              <Checkbox value={menCheckbox} onChange={(e) => {}} />
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
                sneakersCheckbox ? "experience-img-container-selected" : ""
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
              <Checkbox value={sneakersCheckbox} onChange={(e) => {}} />
            </div>
          </div>
        </form>

        <div className="experience-btn-container">
          <Button
            className="experience-btn"
            label="NEXT"
            large
            onClick={() => {
              handleSubmit(experienceOption);
            }}
            disabled={experienceOption === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Experience;
