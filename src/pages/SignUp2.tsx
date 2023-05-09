import {
  IonButton,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  IonLabel,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { SignUpType, User } from '../models';
import { loadingStore } from '../loading-store';
import Input from '../components/Input';
import './SignUp2.scss';
import Button from '../components/Button';

const SignUp2 = () => {
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
    userName: '',
    email: state2?.email,
    password: '',
    comfirmPassword: '',
  });

  const signup = () => {
    loadingStore.increment('Signup:timeout');

    userService
      .signup(person)
      .then(user => {
        console.log('loging the user ', user);
        loadingStore.decrement('SignUp:timeout');
        if (user?.success) {
          history.replace(`/profile`);
        } else if (user?.displayName === 'exists') {
          setError(true);
        }
      })
      .catch((err: any) => {
        loadingStore.decrement('SignUp:timeout');
        console.log('signup error', err);
        setError(true);
      });
  };

  const validate = () => {
    if (
      person.userName.length < 3 ||
      person.password.length < 6 ||
      person.comfirmPassword.length < 6 ||
      person.password !== person.comfirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <IonPage className="main-container">
      <div className="background-image">
        <IonRow className="icon-container">
          <IonCol style={{ flex: 1, marginLeft: '20px' }} size="2">
            <div
              onClick={() => {
                history.goBack();
              }}
            >
              <img height={40} src="assets/images/nobo-back-icon.png" alt="logo" />
            </div>
          </IonCol>
          <IonCol className="nobo-logo-container">
            <img height={70} src="assets/images/nobo-logo-white.png" alt="logo" />
          </IonCol>
          <IonRow className="get-registered-container">
            <IonCol className="get-registered">GET REGISTERED</IonCol>
          </IonRow>
        </IonRow>
        <IonGrid className="form-grid">
          <IonRow>
            <IonCol>
              <Input
                invalid={error}
                value={person.userName}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder="USERNAME"
                onChange={val => {
                  setPerson({ ...person, userName: val });
                }}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel className="info">
                For privacy concerns, your username cannot be your email, it will be displayed in
                your style feed, account selection, and reviews
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <Input
                invalid={error}
                value={person.password}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder="PASSWORD"
                onChange={val => {
                  setPerson({ ...person, password: val });
                }}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Input
                invalid={error}
                value={person.comfirmPassword}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder="COMFIRM PASSWORD"
                errorMessage={error ? 'Username already in use' : ''}
                onChange={val => {
                  setPerson({ ...person, comfirmPassword: val });
                }}
              ></Input>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonRow>
          <IonCol style={{ marginTop: 180 }}>
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
              className=""
              disabled={validate()}
            />
          </IonCol>
        </IonRow>
      </div>
    </IonPage>
  );
};

export default SignUp2;
