import {
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  IonContent,
} from '@ionic/react';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { loadingStore } from '../loading-store';
import Input from '../components/Input';
import './SignUp1.scss';
import Button from '../components/Button';
// import { Capacitor } from '@capacitor/core';

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
  const [checked, setchecked] = useState(false)

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
          // console.log(email, ' already exist ');
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
    if (emailError ||
      firstName.length < 3 ||
      lastName.length < 3 ||
      email.length < 3
      || checked === false) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <IonPage className='signup-details-container'>
      <div className='signup-details-bg-image'>
        <IonContent scrollY={false} scrollX={false} className='signup-details-content'>
          <IonRow>
            <IonCol size='12' className='signup-details-header'>
              <div
                onClick={() => {
                  history.goBack();
                }}
                className="back-btn"
              >
                <img
                  height={38}
                  src="assets/images/nobo-back-icon.png"
                  alt="logo"
                />
              </div>
              <div
                className="nobo-logo">
                <img height={65} src="assets/images/nobo-logo-white.png" alt="logo" />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonGrid className={'signup-details-box_'}>


              <IonCol size='12' className='signup-text-title-container'>
                <p className='signup-text-title'>SIGN UP</p>
              </IonCol>

              <IonRow className='signup-text-box-row-wrapper'>
                <IonCol size='12' className='signup-text-input-container' style={{}}>
                  <Input
                    type='text'
                    value={firstName}
                    className={`nobo-input signup-text-input`}
                    placeholder='First Name'
                    onChange={val => {
                      setFirstName(val);
                    }}
                  ></Input>
                </IonCol>



                <IonCol size='12' className='signup-text-input-container' >
                  <Input
                    value={lastName}
                    className={`nobo-input signup-text-input`}
                    placeholder='Last Name'
                    type='text'
                    onChange={val => {
                      setLastName(val);
                    }}
                  ></Input>
                </IonCol>

                <IonCol size='12' className='signup-text-input-container' >
                  <Input
                    value={email}
                    className={`nobo-input signup-text-input ${error ? 'invalid-text-color' : ''}`}
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

                <IonCol size='12' className='signup-terms-container signup-terms-container-terms ' style={{}}>
                  <input
                    className='signup-input-checkbox'
                    type="checkbox" name="" id=""
                    checked={checked}
                    onChange={() => {
                      setchecked(!checked)
                    }}
                  />
                  <p className='signup-terms-text'>
                    I have read and agreed to the
                     <a className='terms-and-agree' href='https://thenobo.sfo3.digitaloceanspaces.com/terms.pdf'
                     target='_blank'
                     rel='noreferrer'
                      style={{ textDecoration: 'underLine' }}> Terms and Conditions
                    </a>
                  </p>
                </IonCol>


                <IonCol size='12' className='signup-btn-container' >
                  <Button
                    onClick={() => {
                      checkUserExist();
                    }}
                    label='NEXT'
                    large={true}
                    className='signup-btn'
                    disabled={!validate()}
                  />
                </IonCol>

                <IonCol size='12' className='signup-user-check' style={{ marginTop: '8px' }}>
                  <p className='already-user'>
                    Already have an account?
                  </p>
                  <p className='login'
                    onClick={() => history.push('/login')}
                  >
                    LOGIN
                  </p>
                </IonCol>

              </IonRow>
            </IonGrid>
          </IonRow>
        </IonContent>
      </div>


    </IonPage>
  );
};

export default SignUp1;
