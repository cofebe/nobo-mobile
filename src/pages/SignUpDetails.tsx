import {
  IonButton,
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
import './SignUpDetails.scss';
import Button from '../components/Button';



const SignUpDetails: React.FC = () => {
  // email check...
  const emailCheck = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

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

    loadingStore.increment('Login:timeout');
    userService.checkExistingEmail(email)
      .then((user) => {
        loadingStore.decrement('Login:timeout');
        // console.log(user)
        if (user.exists) {
        console.log(email, " already exist ")
          setError(true);
          loadingStore.decrement('SignUp:timeout');
        } else {
         
          history.push({ pathname: '/signup-details/signup', state: { firstName, lastName, email } })
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
    <IonPage className="signup-details-container">
      <IonContent scrollY={false}>
      <div className="signup-details-background-image">
        <div >
              <img
              style={{ marginLeft:"5%", marginTop:"13%"}}
             onClick={() => {
              history.goBack();
            }}
              // className='signup-details-goback'
                height={40}
                src="assets/images/nobo-back-icon.png"
                alt="logo"
              />
          
        </div>
        <IonRow className="signup-details-nobo-logo">
          <IonCol
            class="ion-justify-content-center"
            style={{ display: 'flex' }}
          >
            <img
              height={60}
              src="assets/images/nobo-logo-white.png"
              alt="logo"
            />
          </IonCol>
        </IonRow>
        <IonRow className='signup-details-box-container'>
          <IonGrid className="signup-details-box">
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
                  marginBottom: 30
                }}
              >
                SIGNUP
              </IonCol>
            </IonRow>
            <IonRow >
              <IonCol >
                <Input
                  value={firstName}
                  className={`nobo-input`}
                  placeholder="FIRST NAME"
                  onChange={(val) => {
                    setFirstName(val);
                  }}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <Input

                  value={lastName}
                  className={`nobo-input `}
                  placeholder="LASTNAME"
                  type="text"
                  onChange={(val) => {
                    setLastName(val);
                  }}
                ></Input>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <Input
                  invalid={error}
                  value={email}
                  className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                  placeholder="EMAIL ADDRESS"
                  type="email"
                  errorMessage={error ? 'Email already in use' : ''}
                  onChange={(val) => {
                    setEmail(val);
                    if (!emailCheck(val)) {
                      setEmailError(true)
                    } else {
                      setEmailError(false)
                    }
                  }}
                ></Input>
              </IonCol>
            </IonRow>
            <IonRow >
              <IonCol>By selecting agree and continue below, I agree to the
                <IonCol style={{ color: 'goldenrod' }}> Terms of Service and Privacy</IonCol>
              </IonCol>

            </IonRow>
            <IonRow>
              <IonCol >
              <Button
              onClick={() => { checkUserExist() }}
              label='REGISTER'
              large={true}
              className=''
              disabled={!validate()}
            />
            
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
                already have an account?
              </IonCol>
              <IonCol
                onClick={() => history.push("/login")}
                size="4"
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: 'Nunito Sans',
                  fontWeight: '700',
                  color: '#D6980E',
                  fontSize: '15px',
                }}
              >
                Sign In
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonRow>
      </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUpDetails;
