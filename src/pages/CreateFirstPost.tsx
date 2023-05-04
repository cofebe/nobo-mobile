
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


const CreateFirstPost: React.FC = () => {
  const userService = new UserService()
  const history = useHistory();
  const [token, setToken] = useState("")
  const [currentUserData, setCurrentUserData] = useState<any>([])
  const [textValue, setTextValue] = useState<any>("")




  const loadUserProfile = () => {
    //getting current user id
    const data = localStorage.getItem("appUserId")
    if (data) {
      const userId = JSON.parse(data);
      console.log("--------- your userId is ready :", userId, "--------")

      //getting user profile
      loadingStore.increment("SelectBrand:timeout");
      userService.getUser(userId)
        .then((res) => res)
        .then((user) => {
          setCurrentUserData(user?.user)
          console.log("test", user)
          loadingStore.decrement("SelectBrand:timeout");

        })
        .catch(err => console.log("getting a user", err))
      loadingStore.decrement("SelectBrand:timeout");
    } else {
      console.log("no userId found in local storage")
    }
  }




  // Getting currenUserId from localStorage
  useIonViewWillEnter(() => {
    loadUserProfile()
  })

  // Getting user token from localStorage
  useIonViewWillEnter(() => {
    const userToken = localStorage.getItem("appUserToken")
    if (userToken) {
      const token = JSON.parse(userToken);
      setToken(token)
    } else {
      console.log("no token found")
    }
  })

  // creating a post
  const createPost = () => {
    loadingStore.increment("CreatePost:timeout");
    userService.createPost(token, textValue)
      .then((res) => res)
      .then((success) => {
        if (success) {
          console.log(" first post created succesfully", success)
        }
        loadingStore.decrement("SelectBrand:timeout");
      })
      .catch(err => console.log("getting a user", err))
    loadingStore.decrement("CreatePost:timeout");

  }
  // skip a post
  // const skipPost = () => {
  //   loadingStore.increment("CreatePost:timeout");
  //   userService.skipPost(token)
  //     .then((res) => res)
  //     .then((response) => {
  //       console.log(" default created succesfully", response)
  //       loadingStore.decrement("SelectBrand:timeout");
  //     })
  //     .catch(err => console.log("getting a user", err))
  //   loadingStore.decrement("CreatePost:timeout");

  // }

  console.log("the state data ", currentUserData?._id)
  console.log(textValue)
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
                src={`data:image/png;base64,${currentUserData?.avatar}`}

                alt="logo"
              />
            </IonCol>
          </IonRow>
          <IonRow className="create-post-username-container">
            {currentUserData?.displayName && (<h3 className="create-post-username-text">
              @{currentUserData?.displayName.toUpperCase()}
            </h3>)}
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
              setTextValue(e.target.value)
            }}
          >
          </IonTextarea>
        </div>

        {(<IonRow className={"create-post-skip-container"}>
          <IonButton fill='clear' className="create-post-skip-text"
             onClick={()=>{ history.push("/home/my-profile")}}
          >SKIP</IonButton>
        </IonRow>)}

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



