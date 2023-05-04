import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonLabel,
  useIonViewWillEnter,
  IonButton,


} from "@ionic/react";
import "cropperjs/dist/cropper.css";
import "./FollowPeople.scss";
import Button from "../components/Button";
import "cropperjs/dist/cropper.css";
import { UserService } from "../services/UserService";
import { User } from "../models";

interface Data {
  user: User
}



const FollowPeople: React.FC = () => {

  const userService = new UserService()
  const history = useHistory();
  const [users, setUsers] = useState<User[]>([])
  const [token, setToken] = useState("")
  const [currentUserId, setCurrentUserId] = useState("")
  const [followNumbers, setFollowNumbers] = useState(false)
  const [follow, setFollow] = useState<string[]>([])


  //  fetching exixting users to follow
  useIonViewWillEnter(() => {
    userService.getUsers()
      .then(res => res)
      .then(users => {
        setUsers(users?.users)
        localStorage.setItem("existingUsers", JSON.stringify(users?.users))
      })
      .catch((error) => {
        console.log("follow users error", error)
      })
  });

  useIonViewWillEnter(() => {

  })


  // Getting user token from localStorage
  useIonViewWillEnter(() => {
    const userToken = localStorage.getItem("appUserToken") 
    if (userToken) {
      const token = JSON.parse(userToken);
      setToken(token)
      console.log("your token is ready :", token)

    } else {
      console.log("no token found")
    }
  })

  // Getting current UserId from localStorage
  useIonViewWillEnter(() => {
    const data = localStorage.getItem("appUserId")
    if (data) {
      const userId = JSON.parse(data);
      setCurrentUserId(userId)
      console.log("your userId is ready :", userId)
    } else {
      console.log("no user data found")
    }
  })



  const followUser = (userToFollowId: string,) => {
    userService.followUserS(token, userToFollowId)
      .then((res) => res)
      .then((res: User) => {
        if (res) {
          console.log(res)
          console.log("You just followed", userToFollowId)
        }
      })
      .catch((err: any) => {
        console.log(" FollowUser", err);
      });
  }

  //getting current user info
  const followUserCheck = (userToFollowId: string) => {
    followUser(userToFollowId)
    // console.log(userToFollowId)
    setFollow([...follow, userToFollowId])
    userService.getUser(currentUserId)
      .then(res => res)
      .then((user: Data) => {
        console.log(user.user.following)
        if (user.user.following.length > 4) {
          setFollowNumbers(true)

        }
        console.log(" user following numbers ", user.user.following.length)
      })
      .catch(err => console.log("getting a user", err))

  }



  return (
    <IonPage className="follow-people-main-container">
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
            Follow 5 other users to begin connecting with other insiders!
          </IonCol>
        </IonRow>

        <div className="follow-people-body-container" style={{}}>
          {users?.map((user) => (
            <div key={user._id} className="follow-people-users-row" >
              <div className="follow-people-users-img-container">
                <img className="follow-people-users-img" src={user.avatar} alt="" />
              </div>
              <div className="follow-people-user-names-container">
                <IonLabel>@{user.displayName}</IonLabel>
              </div>

              <div className="follow-people-button-container" >
                <Button
                  disabled={follow.includes(user._id, 0)}
                  className='profile-picture-btn'
                  label={!follow.includes(user._id, 0) ? "FOLLOW" : "FOLLOWING"}
                  large={true}
                  onClick={(e) => {
                    e.preventDefault()
                    followUserCheck(user._id)

                  }
                  }
                />

              </div>
            </div>
          ))}
        </div>

        {!followNumbers &&(<IonRow className={"follow-people-skip-container"}>
          <IonButton fill='clear'  className="follow-people-skip-text"
            onClick={() => {
              history.push("/onboarding-post")
            }}
          >SKIP FOR NOW</IonButton>
        </IonRow>)}



        <div className={!followNumbers?  "follow-people-submit-btn-container2":"follow-people-submit-btn-container"}>
          <Button
            label="NEXT"
            large={true}
            onClick={(e) => {
              e.preventDefault()
              history.push("/select-brands")
            }
            }
            disabled={!followNumbers}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FollowPeople;
