import { IonButton, IonPage, IonRow, IonCol, IonGrid, useIonViewWillEnter, IonContent, IonHeader, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { loadingStore } from '../loading-store';
import Input from '../components/Input';
import './SignUp1.scss';
import Button from '../components/Button';
import HeaderComponent from '../components/HeaderComponent';

const SignUp1: React.FC = () => {
  // email check...
  const emailCheck = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const history = useHistory();
  const userService = new UserService();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    setError(false);
  });

  const checkUserExist = () => {
    loadingStore.increment('Signup:timeout');
    userService
      .checkExistingEmail(email)
      .then(user => {
        loadingStore.decrement('Signup:timeout');
        if (user.exists) {
          console.log(email, ' already exist ');
          setError(true);
          loadingStore.decrement('SignUp:timeout');
        } else {
          history.push({ pathname: '/signup2', state: { firstName, lastName, email } });
          loadingStore.decrement('SignUp:timeout');
        }
      })
      .catch((err: any) => {
        console.log('signup error', err);
        loadingStore.decrement('SignUp:timeout');
      });
  };

  //    input validation to avoid empty string or two characters input
  const validate = () => {
    if (emailError || firstName.length < 3 || lastName.length < 3 || email.length < 3) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <IonPage className='signup-details-container'>
      <div className='signup-details-background-image'>
        <IonRow>
          <IonCol size='12' style={{ height: '160px' }}>
            <div
              onClick={() => {
                history.goBack();
              }}
              className="header-comp-back-btn"
            >
              <img
                height={38}
                src="assets/images/nobo-back-icon.png"
                alt="logo"
              />
            </div>
            <div
              className="header-comp-nobo-logo">
              <img height={65} src="assets/images/nobo-logo-white.png" alt="logo" />
            </div>
          </IonCol>
        </IonRow>


        <IonGrid className='signup-details-box'>
          <IonRow   >
            <IonCol className='signup-details-title' size='12'	>
              SIGN UP
            </IonCol>
          </IonRow>
          <IonRow className='signup-details-input-container'>
            <IonCol>
              <Input
                type='text'
                value={firstName}
                className={`nobo-input`}
                placeholder='FIRST NAME'
                onChange={val => {
                  setFirstName(val);
                }}
              />
            </IonCol>
          </IonRow>
          <IonRow className='signup-details-input-container'>
            <IonCol>
              <Input
                value={lastName}
                className={`nobo-input `}
                placeholder='LASTNAME'
                type='text'
                onChange={val => {
                  setLastName(val);
                }}
              ></Input>
            </IonCol>
          </IonRow>
          <IonRow className='signup-details-input-container'>
            <IonCol>
              <Input
                value={email}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder='EMAIL ADDRESS'
                type='email'
                errorMessage={error ? 'Email already in use' : ''}
                onChange={val => {
                  setEmail(val);
                  if (!emailCheck(val)) {
                    setEmailError(true);
                  } else {
                    setEmailError(false);
                  }
                }}
              ></Input>
            </IonCol>
          </IonRow>
          <IonRow >
            <IonCol className='signup-details-terms'>
              By selecting agree and continue below, I agree to the
              <IonCol style={{ color: 'goldenrod' }}> Terms of Service and Privacy</IonCol>
            </IonCol>
          </IonRow>
          <IonRow className='signup-details-btn'>
            <IonCol>
              <Button
                onClick={() => {
                  checkUserExist();
                }}
                label='AGREE AND CONTINUE'
                large={true}
                className=''
                disabled={!validate()}
              />
            </IonCol>
          </IonRow>
          <IonRow className='already-have-account-contaner' >
            <div className='already-have-account' >
              Already have an account?
            </div>
            <div
              className='signup-details-signin'
              onClick={() => history.push('/login')}
            >
              <p style={{ marginLeft: '40px', width: '80px' }}> SIGN IN </p>
            </div>
          </IonRow>
        </IonGrid>

      </div>

    </IonPage>
  );
};

export default SignUp1;
