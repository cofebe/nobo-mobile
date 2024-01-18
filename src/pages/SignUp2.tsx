import {
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  IonLabel,
  IonContent,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { SignUpType, User } from '../models';
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
  console.log("signUp2.tsx");
  const [person, setPerson] = useState<SignUpType>({
    firstName: state2?.firstName,
    lastName: state2?.lastName,
    userName: '',
    email: state2?.email,
    password: '',
    comfirmPassword: '',
  });

  const signup = () => {
    if (person.password !== person.comfirmPassword) return;
    userService
      .signup(person)
      .then((response: any) => {
        if(response.displayName === 'exits') {
          setError(true);
        } else {
          if (response.user?._id) {
            history.replace('/experience');
          } else {
            setError(true);
          }
        }
      })
      .catch((err: any) => {
        console.log('SignUp error', err);
        setError(true);
      });
  };

  const validate = () => {
    if (
      person.userName.length < 3 ||
      person.password.length < 1 ||
      person.comfirmPassword.length < 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <IonPage className='signup-container'>
      <IonContent scrollY={false} className='signup-ion-content'>
      <IonRow>
          <IonCol className='signup-header_' size='12' >
            <div
              onClick={() => {
                history.goBack();
              }}
              className="signup-back-btn"
            >
              <img
                height={38}
                src="assets/images/nobo-back-icon.png"
                alt="logo"
              />
            </div>
            <div
              className="signup-nobo-logo">
              <img height={65} src="assets/images/nobo-logo-white.png" alt="logo" />
            </div>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol className='signup-title'>GET REGISTERED</IonCol>
        </IonRow>
        <div className='signup-input-container_'>
          <IonGrid className='form-grid' style={{ marginTop: '150px' }}>
            <IonRow >
              <IonCol size='12' >
                <Input
                  errorMessage={error ? 'Username already in use' : ''}
                  value={person.userName}
                  className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                  placeholder='USERNAME'
                  onChange={val => {
                    setPerson({ ...person, userName: val });
                    setError(false)
                  }}
                />
              </IonCol>
            </IonRow>
            <IonRow style={{ marginBottom: '25px' }}>
              <IonCol size='12' >
                <IonLabel className='signup-privacy-info'>
                  For privacy concerns, your username cannot be your email, it will be displayed in your style
                  feed, account selection, and reviews
                </IonLabel>
              </IonCol>
            </IonRow>

            <IonRow style={{ marginBottom: '13px' }}>
              <IonCol size='12'>
                <Input
                  type='password'
                  value={person.password}
                  className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                  placeholder='PASSWORD'
                  onChange={val => {
                    setPerson({ ...person, password: val });
                  }}
                />
              </IonCol>
            </IonRow>
            <IonRow >
              <IonCol size='12'>
                <Input
                  errorMessage={person.password !== person.comfirmPassword ? 'password mismatch' : ''}
                  type='password'
                  value={person.comfirmPassword}
                  className={`nobo-input ${person.password !== person.comfirmPassword ? 'invalid-text-color' : ''
                    }`}
                  placeholder='COMFIRM PASSWORD'
                  onChange={val => {
                    setPerson({ ...person, comfirmPassword: val });
                  }}
                ></Input>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <IonRow className={!error ? 'signup-btn-container' : 'signup-btn-container2'}>
          <IonCol size='12' className='signup2-btn-container'>
            <Button
            className='signup2-btn'
              onClick={() => {
                signup();
              }}
              label='REGISTER'
              type='primary'
              large={true}
              disabled={validate()}
            />
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SignUp2;
