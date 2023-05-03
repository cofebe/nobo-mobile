import {
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  IonLabel,
  IonContent,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { UserService } from "../services/UserService";
import { SignUpResponse, SignUpType } from "../models";
import { loadingStore } from "../loading-store";
import Input from "../components/Input";
import "./SignUp.scss";
import Button from "../components/Button";

const SignUp = () => {
  const history = useHistory();
  const userService = new UserService();
  const [error, setError] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    setError(false);
  });

  const state2: any = history.location.state;

  const [person, setPerson] = useState<SignUpType>({
    firstName: state2?.firstName,
    lastName: state2?.lastName,
    userName: "",
    email: state2?.email,
    password: "",
    comfirmPassword: "",
  });

  const signup = () => {
    if(person.password !== person.comfirmPassword) return
    loadingStore.increment("Signup:timeout");

    userService
      .signup(person)
      .then((user: SignUpResponse) => {
        console.log("loging the user ", user.success);
        loadingStore.decrement("SignUp:timeout");
        if (user.success) {
          console.log(user.user._id);
          window.localStorage.setItem("userToken", JSON.stringify(user.token));
          window.localStorage.setItem("userId", JSON.stringify(user.user._id));
          history.replace({ pathname: `/experience`, state: user.token });
        } else if (user.user.displayName === "exists") {
          setError(true);
        }
      })
      .catch((err: any) => {
        loadingStore.decrement("SignUp:timeout");
        console.log("signup error", err);
        setError(true);
      });
  };

  const validate = () => {
    if (
      person.userName.length < 3 ||
      person.password.length < 6 ||
      person.comfirmPassword.length < 6
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <IonPage className="signup-container">
      <IonContent className="signup-ion-content">
        <div>
          <img
            style={{ marginLeft: "5%", marginTop: "13%" }}
            onClick={() => {
              history.goBack();
            }}
            height={40}
            src="assets/images/nobo-back-icon.png"
            alt="logo"
          />
        </div>
        <IonRow>
          <IonCol
            class="ion-justify-content-center"
            style={{ display: "flex" }}
          >
            <img
              height={60}
              src="assets/images/nobo-logo-white.png"
              alt="logo"
            />
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol className="signup-title">GET REGISTERED</IonCol>
        </IonRow>
        <IonGrid className="form-grid" style={{ marginTop: "150px" }}>
          <IonRow style={{ width: "85%", margin: "auto" }}>
            <IonCol>
              <Input
                errorMessage={error ? "Username already in use" : ""}
                invalid={error}
                value={person.userName}
                className={`nobo-input ${error ? "invalid-text-color" : ""}`}
                placeholder="USERNAME"
                onChange={(val) => {
                  setPerson({ ...person, userName: val });
                }}
              />
            </IonCol>
          </IonRow>
          <IonRow style={{ width: "85%", margin: "auto" }}>
            <IonCol>
              <IonLabel className="signup-privacy-info">
                For privacy concerns, your username cannot be your email, it
                will be displayed in your style feed, account selection, and
                reviews
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow style={{ width: "85%", margin: "auto" }}>
            <IonCol>
              <Input
                type="password"
                value={person.password}
                className={`nobo-input ${error ? "invalid-text-color" : ""}`}
                placeholder="PASSWORD"
                onChange={(val) => {
                  setPerson({ ...person, password: val });
                }}
              />
            </IonCol>
          </IonRow>
          <IonRow style={{ width: "85%", margin: "auto" }}>
            <IonCol>
              <Input
                errorMessage={person.password !== person.comfirmPassword  ? "password mismatch" : ""}
                type="password"
                value={person.comfirmPassword}
                className={`nobo-input ${person.password !== person.comfirmPassword ? "invalid-text-color" : ""}`}
                placeholder="COMFIRM PASSWORD"
                onChange={(val) => {
                  setPerson({ ...person, comfirmPassword: val });
                }}
              ></Input>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonRow style={{ width: "85%", margin: "auto" }}>
          <IonCol style={{ marginTop: 110 }}>
            {/* <IonButton

              style={{
                height: '51px',
                fontFamily: 'Nunito Sans',
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '15px',
                marginTop: 180,
                letterSpacing: 3
              }}
              disabled={validate()}
              type="submit"
              expand="block"
              onClick={() => { signup() }}
            >
              REGISTER
            </IonButton> */}

            <Button
              onClick={() => {
                signup();
              }}
              label="REGISTER"
              type="primary"
              large={true}
              disabled={validate()}
            />
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
