import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonGrid,
  IonPage,
  useIonViewWillEnter,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonInput,
  useIonLoading,
  useIonToast,
  IonSpinner,
} from '@ionic/react';
import './URP.css';
import './Login.css';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { loadingOptions } from '../util';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports.js';
Amplify.configure(awsconfig);

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showErrorPassword, setShowErrorPassword] = useState<boolean>(false);
  const [presentLoading, dismissLoading] = useIonLoading();

  const [present, dismiss] = useIonToast();

  const authService = new AuthService();
  const userService = new UserService();

  useIonViewWillEnter(() => {
    // Save user data to user object during login/signup/createProfile
    // let storage: any = window.localStorage.getItem("persistedState");
    // let user = JSON.parse(storage);

    presentLoading(loadingOptions);
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((user) => {
        let userData = authService.getUserData();

        if (
          userData.user.user_id !== undefined &&
          userData.user.user_id !== ''
        ) {
          userService
            .getProfile(userData.user.user_id)
            .then((res) => {
              if (res) {
                return res.json();
              } else {
                showError(1);
              }
            })
            .then((data) => {
              console.log('Login Profile: ', data);
              if (
                data.basic_user_profile.first_name.String !== undefined &&
                data.basic_user_profile.first_name.String !== ''
              ) {
                window.location.href = '/home/feed';
              } else {
                console.log(
                  'User has not finished account setup: ',
                  data.basic_user_profile.first_name
                );
                window.location.href = '/signup-roles';
              }
            });
        }
        dismissLoading();
      })
      .catch((err) => {
        console.log("Auto Login: ", err);
      });
      dismissLoading();

      setTimeout( () => {
        dismissLoading();
      }, 2000)
  });

  const btnColor = '#00816D';

  async function login() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isPasswordValid = passwordRegex.test(password);
    if (email && isPasswordValid && password) {
      setShowErrorPassword(false);
      let spinner = document.querySelectorAll('.nobo-spinner-login-container');
      spinner[0].classList.add('active');

      try {
        /*const user =*/ await Auth.signIn(email, password);

        authService
          .login({ email: email, password: password })
          .then((res) => {
            if (res.status === 410) {
              showError(3);
              spinner[0].classList.remove('active');
              return;
            }
            if (res.status !== undefined && res.status === 404) {
              continueSignUp();
              return;
            }
            if (res) {
              return res.json();
            } else {
              showError(1);
            }
          })
          .then((data) => {
            if (data === undefined) {
              return;
            }
            console.log(data);
            window.localStorage['persistedState'] = JSON.stringify({
              user: data,
            });

            let storage: any = window.localStorage.getItem('persistedState');
            let user = JSON.parse(storage);

            if (user.user['user_id'] !== undefined) {
              userService
                .getProfile(user.user['user_id'])
                .then((res) => {
                  if (res) {
                    return res.json();
                  } else {
                    showError(1);
                  }
                })
                .then((data) => {
                  console.log('Login Profile: ', data);
                  if (
                    data.basic_user_profile.first_name.String !== undefined &&
                    data.basic_user_profile.first_name.String !== ''
                  ) {
                    window.location.href = '/home/feed';
                    spinner[0].classList.remove('active');
                  } else {
                    console.log(
                      'User has not finished account setup: ',
                      data.basic_user_profile.first_name
                    );
                    window.location.href = '/signup-roles';
                    spinner[0].classList.remove('active');
                  }
                });
            } else {
              showError(1);
              spinner[0].classList.remove('active');
            }
          })
          .catch((err) => {
            spinner[0].classList.remove('active');
            showError(0, err);
            console.error('Error:', err);
          });
      } catch (error) {
        spinner[0].classList.remove('active');
        showError(0, error);
        console.log('error signing in', error);
      }
    } else if (!isPasswordValid) {
      setShowErrorPassword(true);
      showError(2);
    }
  }

  async function continueSignUp() {
    authService
      .signUp({ email: email, password: password })
      .then((res) => res.json())
      .then((data) => {
        window.localStorage['persistedState'] = JSON.stringify({
          user: data,
        });

        let storage: any = window.localStorage.getItem('persistedState');
        let user = JSON.parse(storage);
        if (user.user['user_id'] !== undefined) {
          window.location.href = '/signup-roles';
        } else {
          showError(1);
        }
      })
      .catch((err) => {
        showError(0, err);
        let spinner = document.querySelectorAll('.nobo-spinner-login-container');
        spinner[0].classList.add('active');
        spinner[0].classList.remove('active');
        console.log('Error Email: ', email);
        console.log('Error URP Backend: ', err);
        console.error('Error:', err);
      });
  }

  function showError(errorCode: number, error?: any) {
    let errMessage = 'Something went wrong. Please try again.';

    console.log('error: ', error);
    if (errorCode === 1) {
      errMessage = 'Error Connecting. Please try again.';
    }
    if (errorCode === 2) {
      errMessage =
        '•Password must be at least 8 characters long <br/> •Contain at least one uppercase letter <br/> •Contain one lowercase letter <br/> •Contain one number and one special character.';
    }
    if (errorCode === 3) {
      errMessage = 'Account has been deleted.';
    }
    if (error !== undefined) {
      console.log('errorMessage1: ', error);
      if (error.status === 401) {
        errMessage = 'Your email or password is incorrect. Please try again.';
      } else if (error.code === 'UserNotConfirmedException') {
        errMessage = 'Please confirm your email.';
      }
    }
    present({
      buttons: [{ text: 'Dismiss', handler: () => dismiss() }],
      message: errMessage,
      // color: errColor,
      duration: 5000,
      onDidDismiss: () => console.log('dismissed'),
      onWillDismiss: () => console.log('will dismiss'),
      cssClass: 'error-message',
    });
  }

  function validate() {
    if (email && password) {
      return true;
    }
    return false;
  }

  return (
    <IonPage id="login-page">
      <IonContent>
        <div className="nobo-spinner-login-container">
          <IonSpinner className="nobo-spinner" name="bubbles" />
        </div>
        <IonRow className="breather-row">
          <IonCol>
            <img
              className="login-logo"
              src="assets/images/nobo_logo_round.jpg"
              width="200"
              height="200"
              alt="logo"
            />
          </IonCol>
        </IonRow>
        <IonGrid className="nobo-desktop-login">
          <IonRow>
            <IonCol offset="1" size="10">
              <IonItem lines="full">
                <IonLabel className="nobo-label" position="floating">
                  Email
                </IonLabel>
                <IonInput
                  value={email}
                  type="email"
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
            </IonCol>
            <IonCol offset="1" size="10">
              <IonItem lines="full">
                <IonLabel className="nobo-label" position="floating">
                  Password
                </IonLabel>
                <IonInput
                  color={showErrorPassword ? 'danger' : ''}
                  className={
                    showErrorPassword ? 'password-border-bottom-red' : ''
                  }
                  value={password}
                  type="password"
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
              {showErrorPassword && (
                <IonLabel className="incorrect-password" position="floating">
                  Incorrect Password
                </IonLabel>
              )}
              <a className="login-fp" href="/forgot">
                Forgot Password
              </a>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonButton
                onClick={(e) => {
                  e.preventDefault();
                  login();
                }}
                color={btnColor}
                disabled={!validate()}
                type="submit"
                expand="block"
                className="nobo-login-btn"
              >
                Login
              </IonButton>
            </IonCol>
            <IonCol className="nobo-center login-sign-up-container" size="11">
              Don't have an account?{' '}
              <a className="login-sign-up" href="/signup">
                Sign Up
              </a>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
