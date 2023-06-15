import {
  IonButton,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonInput,
  useIonViewWillEnter,
  IonContent,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { User } from '../models';
import { loadingStore } from '../loading-store';

import Input from '../components/Input';

import './Login.scss';

const Login: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    setError(false);
  });

  const login = () => {
    loadingStore.increment('Login:timeout');
    userService
      .login(email, password)
      .then((user: User) => {
        loadingStore.decrement('Login:timeout');
        console.log('res msg ', user)
        if(user){
          console.log('user', user);
          setTimeout(() => {
            loadingStore.decrement('Login:timeout');
            history.push(`/home/explore/${user.experiencePreferences}/explore`);
          }, 3000);
        }
      })
      .catch((err: any) => {
        loadingStore.decrement('Login:timeout');
        console.log('login error', err);
        setError(true);
      });
  };

  const validate = () => {
    if (email && password) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <IonPage className="nobo-login-page">
      <IonContent>
      <div className="background-image">
        <IonRow>
          <IonCol size="12" style={{ height: '160px' }}>
            <div
              onClick={() => {
                history.push('/get-started');
              }}
              className="header-comp-back-btn"
            >
              <img height={38} src="assets/images/nobo-back-icon.png" alt="logo" />
            </div>
            <div className="header-comp-nobo-logo">
              <img height={65} src="assets/images/nobo-logo-white.png" alt="logo" />
            </div>
          </IonCol>
        </IonRow>
        {/* <IonRow >
          <IonCol size="2" className='nobo-login-back'>
            <div
              onClick={() => {
                history.push('/get-started');
              }}
            >
              <img height={40} src="assets/images/nobo-back-icon.png" alt="logo" />
            </div>
          </IonCol>
        </IonRow>
        <IonRow className="logo-margin-top">
          <IonCol class="ion-justify-content-center" style={{ display: 'flex' }}>
            <img height={65} src="assets/images/nobo-logo-white.png" alt="logo" />
          </IonCol>
        </IonRow> */}

        <IonRow>
          <IonGrid  className={error? 'login-box-error' : 'login-box'}>
            <IonRow style={{ paddingTop: 20 }} class="ion-justify-content-center">
              <IonCol
                size="5"
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 400,
                  fontFamily: 'Georgia',
                  letterSpacing: '.05rem',
                }}
              >
                LOGIN
              </IonCol>
            </IonRow>
            <IonRow style={{ marginBottom: '20px' }}>
              <IonCol>
                <Input
                  invalid={error}
                  value={email}
                  className={`nobo-input ${error ? 'invalid-text-color' : 'nobo-input2'}`}
                  placeholder="USERNAME"
                  onChange={val => {
                    setEmail(val);
                  }}
                />
              </IonCol>
            </IonRow>
            <IonRow style={{ marginBottom: '40px' }}>
              <IonCol>
                <Input
                  invalid={error}
                  // style={{
                  //   border: error ? '1px solid red' : '',
                  //   color: error ? 'red' : '',
                  // }}
                  value={password}
                  className={`nobo-input nobo-input2 ${error ? 'invalid-text-color' : ''}`}
                  placeholder="PASSWORD"
                  type="password"
                  errorMessage={error ? 'INCORRECT USERNAME OR PASSWORD' : ''}
                  onChange={val => {
                    setPassword(val);
                  }}
                ></Input>
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
                  disabled={!validate()}
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
                  textDecorationLine: 'none',
                  fontFamily: 'Nunito Sans',
                  fontWeight: '700',
                  color: '#D6980E',
                  fontSize: '15px',
                }}
                onClick={() => {
                  history.push('/signup1');
                }}
              >
                Sign Up
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonRow>
      </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
