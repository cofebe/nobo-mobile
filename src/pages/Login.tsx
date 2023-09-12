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
  const [userNameError, setUserNameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    setUserNameError(false);
    setPasswordError(false);
  });

  const login = () => {
    loadingStore.increment('Login:timeout');
    userService
      .login(email, password)
      .then((user: User) => {
        loadingStore.decrement('Login:timeout');
        console.log('res msg ', user)
        if (user) {
          console.log('user', user);
          setTimeout(() => {
            loadingStore.decrement('Login:timeout');
            history.push(`/home/explore/${user.experiencePreferences}/explore`);
          }, 3000);
        }
      })
      .catch((err: any) => {
        loadingStore.decrement('Login:timeout');
        if (err === 'User Not Found') {
          // console.log('user not found')
          setUserNameError(true)
        }
        else if (err === 'Access Denied') {
          // console.log('incorrect password')
          setPasswordError(true)
        }
        console.log('login error', err);
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
      <IonContent scrollY={false}>
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
            <IonGrid
              className={'login-box'}>
              {/* className={error? 'login-box-error' : 'login-box'}> */}
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
                    invalid={userNameError}
                    value={email}
                    className={`nobo-input ${userNameError ? 'invalid-text-color' : 'nobo-input2'}`}
                    placeholder="USERNAME"
                    errorMessage={userNameError ? 'USER NOT FOUND' : ''}
                    onChange={val => {
                      setEmail(val);
                      setUserNameError(false)
                    }}
                  />
                </IonCol>
              </IonRow>
              <IonRow style={{ marginBottom: '10px' }}>
                <IonCol>
                  <Input
                    invalid={passwordError}
                    // style={{
                    //   border: error ? '1px solid red' : '',
                    //   color: error ? 'red' : '',
                    // }}
                    value={password}
                    className={`nobo-input nobo-input2 ${passwordError ? 'invalid-text-color' : ''}`}
                    placeholder="PASSWORD"
                    type="password"
                    errorMessage={passwordError ? 'INCORRECT PASSWORD' : ''}
                    onChange={val => {
                      setPassword(val);
                      setPasswordError(false)
                    }}
                  ></Input>
                </IonCol>
              </IonRow>
              <IonRow style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
                <IonCol
                  onClick={() => {
                    history.push('/forgot-password')
                  }}
                >Forgot Password</IonCol>
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
                    LOGIN
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
                  NOT A NOBO INSIDER?
                </IonCol>
                <IonCol
                  size="4"
                  style={{
                    textDecorationLine: 'none',
                    fontFamily: 'Nunito Sans',
                    fontWeight: '700',
                    color: '#FFFF',
                    fontSize: '15px',
                    textAlign: 'right'
                  }}
                  onClick={() => {
                    history.push('/signup1');
                  }}
                >
                  REGISTER
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
