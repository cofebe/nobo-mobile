import {
  IonButton,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonInput,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { NoboUserService } from '../services/NoboUserService';

import './NoboLogin.scss';
import Splash from './Splash';

const NoboLogin: React.FC = () => {
  const history = useHistory();
  const noboUserService = new NoboUserService();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = () => {
    setIsLoading(true); // Set loading to true when login button is clicked
    noboUserService
      .login({ email, password })
      .then((res: any) => res.json())
      .then((data: any) => {
        console.log('login', data);
        if (data.error) {
          setError(data.error);
        } else {
          history.push('/');
          setTimeout(() => {
            history.push('/home/nobo-home');
          }, 3000);
        }
      })
      .catch((err: any) => {
        console.log('login error', err);
      })
      .finally(() => setIsLoading(false)); // Set loading to false when promise is resolved
  };

  return (
    <IonPage className="nobo-login-page">
      <div className="background-image">
        <IonRow>
          <IonCol size="2">
            <div
              onClick={() => {
                history.push('/get-started');
              }}
            >
              <img
                height={40}
                src="assets/images/nobo-back-icon.png"
                alt="logo"
              />
            </div>
          </IonCol>
        </IonRow>
        <IonRow className="logo-margin-top">
          <IonCol
            class="ion-justify-content-center"
            style={{ display: 'flex' }}
          >
            <img
              height={65}
              src="assets/images/nobo-logo-white.png"
              alt="logo"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonGrid className="login-box">
            <IonRow
              style={{ paddingTop: 20 }}
              class="ion-justify-content-center"
            >
              <IonCol
                size="5"
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 400,
                  fontFamily: 'Baskerville',
                  letterSpacing: '.05rem',
                }}
              >
                LOGIN
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput
                  className="nobo-input"
                  placeholder="USERNAME"
                  onIonChange={(e: any) => {
                    setEmail(e.target.value);
                  }}
                ></IonInput>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput
                  className="nobo-input"
                  placeholder="PASSWORD"
                  onIonChange={(e: any) => {
                    setPassword(e.target.value);
                  }}
                ></IonInput>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol style={{ paddingBottom: 0 }}>
                <IonButton
                  style={{
                    height: '51px',
                    fontFamily: 'Nunito Sans',
                    fontSize: '15px',
                    fontWeight: '700',
                    lineHeight: '15px',
                  }}
                  // id="open-subscription-modal"
                  onClick={() => {
                    login();
                  }}
                  //   color={btnColor}
                  // disabled={!isActive || isSubscribed}
                  type="submit"
                  expand="block"
                  className="nobo-button"
                >
                  CONTINUE
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow style={{ paddingBottom: 12 }}>
              <IonCol
                size="8"
                style={{
                  fontFamily: 'Nunito Sans',
                  fontWeight: '600',
                  fontSize: '15px',
                  lineHeight: '22.5px',
                  color: '#FFFFFF',
                }}
              >
                Don't have an account?
              </IonCol>
              <IonCol
                size="4"
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: 'Nunito Sans',
                  fontWeight: '700',
                  color: '#D6980E',
                  fontSize: '15px',
                }}
              >
                Sign Up
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonRow>
      </div>
    </IonPage>
  );
};

export default NoboLogin;
