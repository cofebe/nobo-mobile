import { useState } from 'react';
import {
 IonButton,
 IonContent,
 IonPage,
 useIonViewWillEnter,
 IonItem,
 IonLabel,
 IonGrid,
 IonRow,
 IonCol,
 IonInput,
 IonSpinner,
 useIonToast,
} from '@ionic/react';
import './Forgot.css';
import { Auth } from 'aws-amplify';
import { AuthService } from '../services/AuthService';

const ForgotReset: React.FC = () => {
 const [email, setEmail] = useState<string>('');
 const [code, setCode] = useState<string>('');
 const [password, setPassword] = useState<string>('');
 const [confirmPassword, setConfirmPassword] = useState<string>('');
 const [isButtonClickable, setIsButtonClickable] = useState<boolean>(true);
 const [present, dismiss] = useIonToast();
 const authService = new AuthService();

 useIonViewWillEnter(() => {
  // some initialization code
 });
 const btnColor = '#00816D';

 async function resetPassword() {
  setIsButtonClickable(false);
  const passwordRegex =
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^.[\]{}()"#/\\,><':;|_~`=+-])[A-Za-z\d@$!%*?&^.[\]{}()"#/\\,><':;|_~`=+-]{8,}$/;
  const isPasswordValid = passwordRegex.test(password);
  try {
   const data = await Auth.forgotPasswordSubmit(email, code, password);
   if (data === 'SUCCESS' && isPasswordValid) {
    const passwordReset = await authService.resetPassword({
     email: email,
     password: password,
    });
    if (passwordReset && passwordReset.status === 200) {
     setIsButtonClickable(true);
     window.location.href = '/login';
    }
    if (!isPasswordValid) {
     setIsButtonClickable(true);
     showError(2);
    }
    setIsButtonClickable(true);
    console.log(data);
   }
  } catch (err: any) {
   setIsButtonClickable(true);
   if (err.code === 'CodeMismatchException') {
    console.log('Code mismatch');
    showError(3);
   } else if (err.code === 'LimitExceededException') {
    console.log('Invalid parameter');
    showError(4);
   } else if (err.code === 'InvalidPasswordException') {
    console.log('Invalid password');
    showError(5, err.message);
   } else if (err.code === 'ExpiredCodeException') {
    console.log('Expired code');
    showError(6);
   } else {
    console.log(err);
    showError(0, err);
   }
  }
 }

 function validate() {
  if (
   email &&
   password &&
   isButtonClickable &&
   code &&
   confirmPassword &&
   password === confirmPassword
  ) {
   return true;
  }
  return false;
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
  if (errorCode === 3) {
   errMessage =
    '•Code mismatch. Please check your email and try again. <br/> •If you have not received an email, please check your spam folder.';
  }
  if (errorCode === 4) {
   errMessage = '•Attempt limit exceeded, please try after some time.';
  }
  if (errorCode === 5) {
   errMessage = '•' + error;
  }
  if (errorCode === 6) {
   errMessage =
    '•Code expired. Please request a new code and try again. <br/> •If you have not received an email, please check your spam folder.';
  }
  if (error !== undefined) {
   console.log('errorMessage1: ', error);
   if (error.code === 'NetworkError') {
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

 return (
  <IonPage id="forgot-page" className="nobo-page">
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
         onIonChange={e => setEmail(e.detail.value!)}
         required
        ></IonInput>
       </IonItem>
      </IonCol>
      <IonCol offset="1" size="10">
       <IonItem lines="full">
        <IonLabel className="nobo-label" position="floating">
         Code
        </IonLabel>
        <IonInput
         value={code}
         type="text"
         inputmode="numeric"
         onIonChange={e => setCode(e.detail.value!)}
         required
        ></IonInput>
       </IonItem>
      </IonCol>
      <IonCol offset="1" size="10">
       <IonItem lines="full">
        <IonLabel className="nobo-label" position="floating">
         New Password
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
        <IonLabel className="nobo-label" position="floating">
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
     <IonRow>
      <IonCol className="nobo-center" size="11">
       <IonButton
        onClick={e => {
         e.preventDefault();
         resetPassword();
        }}
        color={btnColor}
        disabled={!validate()}
        type="submit"
        expand="block"
        className="nobo-login-btn"
       >
        Let's Go!
       </IonButton>
      </IonCol>
      <IonCol className="nobo-center nobo-forgot-text" size="11">
       Already have an account?{' '}
       <a className="login-sign-up" href="/login">
        Login
       </a>
      </IonCol>
     </IonRow>
    </IonGrid>
   </IonContent>
  </IonPage>
 );
};

export default ForgotReset;
