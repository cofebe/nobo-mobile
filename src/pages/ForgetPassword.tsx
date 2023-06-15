import {
  IonButton,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  IonContent,
  useIonToast
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/UserService';
import Input from '../components/Input';
import './ForgetPassword.scss';


interface ResData{
  exists:Boolean
}

const ForgetPassword: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const [present] = useIonToast();

  const presentToast = (position: 'top' | 'middle' | 'bottom') => {
    present({
      message: `Please Check Your Email`,
      duration: 1800,
      position: position,
    });
  };



  useIonViewWillEnter(() => {
    setError(false);
  });
  const emailCheck = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = () => {
    userService.forgotPassword(email)
      .then((res:ResData) => {
        if(res.exists){
          console.log('check your mail for reset link')
          presentToast('top')
          setTimeout(() => {
            history.push('/login');
          }, 1500);

        }else{
          console.log('email does not exist')
          setError(true)

        }
      })
      .catch((err) => { console.log('err response ', err) })
  };

  const validate = () => {
    if (emailError || email.length < 7) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <IonPage className="nobo-forget-p-page">
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


          <IonRow>
            <IonGrid className={error ? 'forget-p-box-error' : 'forget-p-box'}>
              <IonRow style={{ paddingTop: 20 }} class="ion-justify-content-center">
                <IonCol
                  size="12"
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 400,
                    fontFamily: 'Georgia',
                    letterSpacing: '.05rem',
                  }}
                >
                  FORGOT PASSWORD
                </IonCol>
              </IonRow>

              <IonRow style={{ marginTop: '90px' }}>
                <IonCol>
                  <Input
                    invalid={error}

                    value={email}
                    className={`nobo-input nobo-input2 ${error ? 'invalid-text-color' : ''}`}
                    placeholder="EMAIL ADDRESS"
                    type="email"
                    errorMessage={error ? 'EMAIL DOES NOT EXIST' : ''}
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

              <IonRow style={{ marginTop: '25px' }}>
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
                      handleSubmit();
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
              <IonRow style={{ paddingBottom: 12, paddingLeft:8,  paddingRight:8}}>
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
                  Already know your password?
                </IonCol>
                <IonCol
                  size="4"
                  style={{
                    textDecorationLine: 'none',
                    fontFamily: 'Nunito Sans',
                    fontWeight: '700',
                    color: '#D6980E',
                    fontSize: '15px',
                    textAlign: 'right',

                  }}
                  onClick={() => {
                    history.push('/login');
                  }}
                >
                  Login
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonRow>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgetPassword;
