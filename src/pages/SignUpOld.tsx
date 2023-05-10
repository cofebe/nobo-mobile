import { useState /*, useContext*/ } from 'react';
import {
  IonButton,
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonItem,
  IonLabel,
  IonText,
  IonRow,
  IonCol,
  IonGrid,
  IonInput,
  useIonToast,
  IonSpinner,
} from '@ionic/react';
import '../styles.scss';
import './SignUp.css';
import { AuthService } from '../services/AuthService';
//import { AppContext } from '../services/State';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports.js';
Amplify.configure(awsconfig);

const Register: React.FC = () => {
  const authService = new AuthService();
  const [present, dismiss] = useIonToast();

  //const { state, dispatch } = useContext(AppContext);
  //const [firstName, setFirstName] = useState<string>();
  //const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const btnColor = '#00816D';

  useIonViewWillEnter(() => {
    // some initialization code
  });

  async function signUp() {
    console.log('signUp');
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^.[\]{}()"#/\\,><':;|_~`=+-])[A-Za-z\d@$!%*?&^.[\]{}()"#/\\,><':;|_~`=+-]{8,}$/;
    const isPasswordValid = passwordRegex.test(password);
    if (email && isPasswordValid && password) {
      // let signup = document.querySelectorAll(".nobo-signup-spinner-container");
      // signup[0].classList.add("active");
      try {
        await Auth.signUp({
          username: email,
          password,
          attributes: {
            email: email,
          },
        });
        console.log('confirmSignUp');
        let signup = document.querySelectorAll('.nobo-signup-container');
        signup[0].classList.remove('active');
        signup[1].classList.remove('active');

        let confirm = document.querySelectorAll('.nobo-confirm-container');
        confirm[0].classList.add('active');

        signIn(true);
      } catch (err: any) {
        // signup[0].classList.remove("active");
        // If there is an error, try to log in the user
        if (err.code === 'NetworkError') {
          try {
            await signIn(false);
          } catch (err2) {
            console.log('Error Email: ', email);
            console.log('Error Amplify Signup: ', err);
            console.log({ err });
            showError(0, err);
          }
        } else {
          console.log('Error Email: ', email);
          console.log('Error Amplify Signup: ', err);
          console.log({ err });
          showError(0, err);
        }
      }
    } else if (!isPasswordValid) {
      showError(2);
    }
  }

  async function signIn(retry: boolean = true) {
    console.log('Check: signIn');
    try {
      const { user } = await Auth.signIn(email, password);

      window.localStorage['aws_user'] = JSON.stringify({
        user: user,
      });

      authService
        .signUp({ email: email, password: password })
        .then(res => res.json())
        .then(data => {
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
        .catch(err => {
          showError(0, err);
          console.log('Error Email: ', email);
          console.log('Error URP Backend: ', err);
          console.error('Error:', err);
          if (retry) {
            setTimeout(signIn, 6000);
          }
        });
    } catch (err) {
      console.log('Error Email: ', email);
      console.log('Error Amplify Email Verification: ', err);
      if (retry) {
        setTimeout(signIn, 6000);
      }
      console.log({ err });
    }
    console.log('Finish Check: signIn');
  }

  function showError(errorCode: number, error?: any) {
    let errMessage = 'Something went wrong. Please try again';

    console.log('error: ', error);
    if (errorCode === 1) {
      errMessage = 'Error Connecting. Please try again.';
    }
    if (errorCode === 2) {
      errMessage =
        '•Password must be at least 8 characters long <br/> •Contain at least one uppercase letter <br/> •Contain one lowercase letter <br/> •Contain one number and one special character.';
    }
    if (error !== undefined) {
      console.log('errorMessage1: ', error);
      if (error.status === 409 || error.code === 'UsernameExistsException') {
        errMessage = "Account already exists with that email. Please click 'Sign In'";
      } else if (error.code === 'NetworkError') {
        errMessage = 'Network error. Please try again';
      }
    }
    present({
      buttons: [{ text: 'Dismiss', handler: () => dismiss() }],
      message: errMessage,
      //   color: errColor,
      cssClass: 'error-message',
      duration: 5000,
      onDidDismiss: () => console.log('dismissed'),
      onWillDismiss: () => console.log('will dismiss'),
    });
  }

  function validate() {
    if (email && password && confirmPassword && password === confirmPassword) {
      return true;
    }
    return false;
  }

  async function resendEmail() {
    console.log('Resend Email');
    try {
      await Auth.resendSignUp(email);
      console.log('code resent successfully');
    } catch (err) {
      console.log('error resending code: ', err);
    }
  }

  return (
    <IonPage id="register-page">
      <IonContent>
        <IonRow className="nobo-sign-up-breather-row nobo-signup-container active">
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

        <IonGrid className="nobo-desktop-login nobo-signup-container active">
          <IonRow>
            <IonCol offset="1" size="10">
              <IonLabel class="nobo-label">Create an Account</IonLabel>
            </IonCol>
            <IonCol offset="1" size="10">
              <IonItem lines="full">
                <IonLabel class="nobo-label" position="floating">
                  Email
                </IonLabel>
                <IonInput
                  value={email}
                  type="email"
                  onIonChange={e => setEmail(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
            </IonCol>
            <IonCol offset="1" size="10">
              <IonItem lines="full">
                <IonLabel class="nobo-label" position="floating">
                  Password
                </IonLabel>
                <IonInput
                  value={password}
                  type="password"
                  onIonChange={e => setPassword(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
            </IonCol>
            <IonCol offset="1" size="10">
              <IonItem lines="full">
                <IonLabel class="nobo-label" position="floating">
                  Confirm Password
                </IonLabel>
                <IonInput
                  value={confirmPassword}
                  type="password"
                  onIonChange={e => setConfirmPassword(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <div className="nobo-signup-spinner-container">
            <IonSpinner className="nobo-spinner" name="bubbles" />
          </div>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonButton
                onClick={e => {
                  e.preventDefault();
                  signUp();
                }}
                color={btnColor}
                disabled={!validate()}
                type="submit"
                expand="block"
                className="nobo-login-btn"
              >
                Create Account
              </IonButton>
            </IonCol>
            <IonCol className="nobo-center login-sign-up-container" size="11">
              Already have an account?{' '}
              <a className="login-sign-up" href="/login">
                Sign In
              </a>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid className="nobo-desktop-login nobo-confirm-container">
          <span className="nobo-confirm-email-image">
            <svg
              width="62"
              height="62"
              viewBox="0 0 62 62"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M61.4092 29.5533L50.2634 21.7602V1.31573C50.2634 0.581958 49.6688 0 48.9477 0H13.0434C12.3097 0 11.7277 0.594609 11.7277 1.31573V21.7602L0.581958 29.5533C0.581958 29.5533 0 29.9202 0 30.654V60.6754C0 61.4092 0.594609 61.9912 1.31573 61.9912H60.6628C61.3966 61.9912 61.9785 61.3966 61.9785 60.6754V30.6413C61.9912 29.9076 61.4092 29.5533 61.4092 29.5533ZM58.3729 30.6413L50.2634 36.3091V24.9736L58.3729 30.6413ZM14.3718 2.64411H47.632V38.1435L30.9956 49.555L14.3718 38.1435V2.64411ZM11.7277 24.9736V36.3091L3.61826 30.6413L11.7277 24.9736ZM2.64411 59.347V33.1716L30.2492 52.237C30.9197 52.6672 31.5143 52.3889 31.742 52.237L59.347 33.1716V59.347H2.64411Z"
                fill="#00816D"
              />
              <path
                d="M20.4822 10.7916H41.5086C42.2424 10.7916 42.8244 10.197 42.8244 9.47589C42.8244 8.74211 42.2297 8.16016 41.5086 8.16016H20.4822C19.7485 8.16016 19.1665 8.75477 19.1665 9.47589C19.1665 10.2097 19.7485 10.7916 20.4822 10.7916Z"
                fill="#00816D"
              />
              <path
                d="M20.4822 18.4203H41.5086C42.2424 18.4203 42.8244 17.8257 42.8244 17.1045C42.8244 16.3708 42.2297 15.7888 41.5086 15.7888H20.4822C19.7485 15.7888 19.1665 16.3834 19.1665 17.1045C19.1665 17.8257 19.7485 18.4203 20.4822 18.4203Z"
                fill="#00816D"
              />
              <path
                d="M20.4822 26.0365H41.5086C42.2424 26.0365 42.8244 25.4419 42.8244 24.7208C42.8244 23.987 42.2297 23.405 41.5086 23.405H20.4822C19.7485 23.405 19.1665 23.9996 19.1665 24.7208C19.1665 25.4419 19.7485 26.0365 20.4822 26.0365Z"
                fill="#00816D"
              />
            </svg>
          </span>
          <IonRow>
            <IonText class="nobo-confirm-title">Confirm Your Email</IonText>
            <IonText class="nobo-confirm-text">
              Thank you for signing up! We sent a confirmation email to
            </IonText>
            <IonText class="nobo-confirm-text nobo-confirm-email">{email}</IonText>
            <IonText class="nobo-confirm-text">
              Check your email and click on the confirmation link to continue
            </IonText>
            <IonCol className="nobo-center" size="12">
              <IonButton
                onClick={e => {
                  e.preventDefault();
                  window.location.href = '/login';
                }}
                color={btnColor}
                type="submit"
                expand="block"
                className="nobo-login-btn"
                style={{ marginTop: '20px' }}
              >
                Return to Sign Up
              </IonButton>
            </IonCol>
            <IonText class="nobo-resend-text nobo-confirm-text">
              Didn’t get a verification email?
              <a
                href="#"
                className="login-sign-up"
                onClick={e => {
                  e.preventDefault();
                  resendEmail();
                }}
              >
                Resend
              </a>
            </IonText>
          </IonRow>
          <div className="nobo-confirm-spinner-container active">
            <IonSpinner className="nobo-spinner" name="bubbles" />
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
