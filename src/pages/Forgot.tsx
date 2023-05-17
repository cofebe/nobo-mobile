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
} from '@ionic/react';
import './Forgot.css';
import { Auth } from 'aws-amplify';

const Forgot: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isButtonClickable, setIsButtonClickable] = useState<boolean>(true);

  useIonViewWillEnter(() => {
    // some initialization code
  });
  const btnColor = '#00816D';

  function forgotPassword() {
    setIsButtonClickable(false);
    Auth.forgotPassword(email)
      .then(data => {
        setIsButtonClickable(true);
        console.log(data);
        window.location.href = '/forgot-reset';
      })
      .catch(err => {
        setIsButtonClickable(true);
        console.log(err);
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
            <IonCol className="nobo-center nobo-forgot-text" size="11">
              Enter the email associated with your account.
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonButton
                onClick={e => {
                  e.preventDefault();
                  forgotPassword();
                }}
                color={btnColor}
                disabled={!isButtonClickable}
                // disabled={!validate()}
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

export default Forgot;
