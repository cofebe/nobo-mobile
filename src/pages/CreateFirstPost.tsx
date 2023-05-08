import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  useIonViewWillEnter,
  IonTextarea,
  IonButton,
} from "@ionic/react";
import "cropperjs/dist/cropper.css";
import "./CreateFirstPost.scss";
import Button from "../components/Button";
import "cropperjs/dist/cropper.css";
import { UserService } from "../services/UserService";
import { loadingStore } from "../loading-store";
import { AuthService } from "../services/AuthService";
import { ProfileResponse } from "../models";

interface PostResponse {
  success: boolean;
}

const CreateFirstPost: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUserData] = useState<any>([]);
  const [textValue, setTextValue] = useState<any>("");

  const loadUserProfile = () => {
    //getting current user id
    const data = localStorage.getItem("appUserId");
    if (data) {
      const userId = JSON.parse(data);
      console.log("--------- your userId is ready :", userId, "--------");

      //getting user profile
      loadingStore.increment("Create-Post:timeout");
      userService
        .getUserProfile(userId)
        .then((user: ProfileResponse) => {
          setCurrentUserData(user.user);
          console.log("test", user.user.displayName);
          loadingStore.decrement("Create-Post:timeout");
        })
        .catch((err) => console.log("getting a user", err));
      loadingStore.decrement("Create-Post:timeout");
    } else {
      console.log("no userId found in local storage");
    }
  };

  // Getting currenUserId from localStorage
  useIonViewWillEnter(() => {
    loadUserProfile();
  });

  // Getting user token from localStorage
  useIonViewWillEnter(() => {
    const userToken = localStorage.getItem("appToken");
    if (userToken) {
      const token = JSON.parse(userToken);
      setToken(token);
    } else {
      console.log("no token found");
    }
  });

  // creating a post
  const createPost = () => {
    // console.log(" is there token", token)
    // console.log(currentUser.displayName)
    loadingStore.increment("CreatePost:timeout");
    userService
      .createPost(token, textValue)
      .then((success: PostResponse) => {
        if (success) {
          const authService = new AuthService();
          authService.setUserToken(token);
          authService.setUserId(currentUser._id);
          authService.setUserDisplayName(currentUser.displayName);
          setTimeout(() => {
            history.push(
              `/home/explore/${currentUser.experiencePreferences}/explore`
            );
            loadingStore.decrement("CreatePost:timeout");
          }, 3000);
        }
      })
      .catch((err) => console.log("getting a user", err));
    loadingStore.decrement("CreatePost:timeout");
  };
  // skip post
  const skipPost = () => {
    loadingStore.increment("SkipPost:timeout");
    const authService = new AuthService();
    authService.setUserToken(token);
    authService.setUserId(currentUser._id);
    authService.setUserDisplayName(currentUser.displayName);
    setTimeout(() => {
      history.push(
        `/home/explore/${currentUser.experiencePreferences}/explore`
      );
      loadingStore.decrement("SkipPost:timeout");
    }, 3000);
  };

  return (
    <IonPage className="create-post-main-container">
      <IonContent className="create-post-ion-content">
        <div className="create-post-header">
          <img
            onClick={() => {
              history.goBack();
            }}
            className="create-post-back-btn"
            style={{ color: "black" }}
            height={23}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />

          <img
            className="create-post-nobo-logo"
            src="assets/images/nobo_logo.png"
            alt="logo"
          />
        </div>

        <IonRow>
          <IonCol className="create-post-title">YOUR FIRST POST</IonCol>
        </IonRow>
        <IonRow className="create-post-desc-container">
          <IonCol className="create-post-desc">
            Write your first post here. Or, we can do it for you
          </IonCol>
        </IonRow>

        <div className="create-post-body-container">
          <IonRow className="create-post-img-container">
            <IonCol className="create-post-img-container">
              <img
                className="create-post-user-img"
                src={`data:image/png;base64,${currentUser?.avatar}`}
                alt="logo"
              />
            </IonCol>
          </IonRow>
          <IonRow className="create-post-username-container">
            {currentUser?.displayName && (
              <h3 className="create-post-username-text">
                @{currentUser?.displayName.toUpperCase()}
              </h3>
            )}
          </IonRow>

          <IonTextarea
            className="create-post-testarea"
            placeholder="Write your post"
            spellcheck={true}
            title="post"
            autocapitalize="on sentence"
            maxlength={350}
            autoGrow={true}
            rows={5}
            value={textValue}
            onIonChange={(e) => {
              setTextValue(e.target.value);
            }}
          ></IonTextarea>
        </div>

        {
          <IonRow className={"create-post-skip-container"}>
            <IonButton
              fill="clear"
              className="create-post-skip-text"
              onClick={skipPost}
            >
              SKIP
            </IonButton>
          </IonRow>
        }

        <div className="create-post-btn-container">
          <Button
            label="NEXT"
            large
            onClick={createPost}
            disabled={textValue === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateFirstPost;
