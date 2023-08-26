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
import { User } from '../models';
import Input from '../components/Input';
import './SignUp2.scss';
import Button from '../components/Button';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

const SignUp2 = () => {
  const history = useHistory();
  const userService = new UserService();
  const [user, setUser] = useState<UserDetails>();
  const [error, setError] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [comfirmPassword, setComfirmPassword] = useState('')




  function getUserDetails() {
    const user = history.location.state as UserDetails
    setUser(user);
  }

  useIonViewWillEnter(() => {
    setError(false);
    getUserDetails()
  });




  const signup = () => {
    if (password !== comfirmPassword) return;
    const userData = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      username,
      password,
    }
    userService
      .signup(userData)
      .then((user: User) => {
        if (user) {
          history.replace('/experience');
        } else {
          setError(true);
        }
      })
      .catch((err: any) => {
        console.log('SignUp error', err);
        setError(true);
      });
  };

  const validate = () => {
    if (
      username.length < 3 ||
      password.length < 6 ||
      comfirmPassword.length < 6
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
                type='text'
                  errorMessage={error ? 'Username already in use' : ''}
                  value={username}
                  className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                  placeholder='USERNAME'
                  onChange={val => {
                    setUsername(val);
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
                  value={password}
                  className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                  placeholder='PASSWORD'
                  onChange={val => {
                    setPassword(val);
                  }}
                />
              </IonCol>
            </IonRow>
            <IonRow >
              <IonCol size='12'>
                <Input
                  errorMessage={password !== comfirmPassword ? 'password mismatch' : ''}
                  type='password'
                  value={comfirmPassword}
                  className={`nobo-input ${password !== comfirmPassword ? 'invalid-text-color' : ''
                    }`}
                  placeholder='COMFIRM PASSWORD'
                  onChange={val => {
                    setComfirmPassword(val);
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
