import {
  IonButton,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  IonLabel,
  IonContent,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserService } from '../services/UserService';
import { SignUpResponse, SignUpType, User } from '../models';
import { loadingStore } from '../loading-store';
import Input from '../components/Input';
import './SignUp.scss';
import Button from '../components/Button';




const SignUp = () => {
  const history = useHistory();
  const userService = new UserService();
  const [error, setError] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    setError(false);
  });

  const state2: any = history.location.state

  const [person, setPerson] = useState<SignUpType>({
    firstName: state2?.firstName,
    lastName: state2?.lastName,
    userName: "",
    email: state2?.email,
    password: "",
    comfirmPassword: "",
  })


  const signup = () => {
    loadingStore.increment('Signup:timeout');

    userService
      .signup(person)
      .then((data:SignUpResponse) => {
        console.log("loging the user ", data.success)
        loadingStore.decrement('SignUp:timeout');
        if (data.success){
          console.log(data.user._id)
          window.localStorage.setItem("userToken", JSON.stringify(data.token))
          history.replace({pathname:`/experience`, state:data.token});
        } else if (data.user.displayName === "exists") {
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
      person.userName.length < 3 || person.password.length < 6 || person.comfirmPassword.length < 6 || person.password !== person.comfirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  };


  return (
    <IonPage className="signup-container">
      <IonContent className='signup-ion-content' >

        <div className='signup-header'  >

          <img
            onClick={() => { history.push("/signup-details") }}
            className='signup-back-btn'
            style={{ color: "#fff" }}
            height={40}
            src="assets/images/nobo-back-icon.png"
            alt="logo"
          />

          <img
        
            className='signup-logo'
            src="assets/images/nobo-logo-white.png"
            alt="logo"
          />
        </div>
        <IonRow >
          <IonCol className='signup-title' >GET REGISTERED</IonCol>
        </IonRow>
        <IonGrid className='form-grid' style={{marginTop:"150px"}} >

          <IonRow style={{width:"85%", margin:"auto"}} >
            <IonCol  >
              <Input
             errorMessage={error ? 'Username already in use' : ''}
                invalid={error}
                value={person.userName}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder="USERNAME"
                onChange={(val) => { setPerson({ ...person, userName: val }) }}
              />
            </IonCol>
          </IonRow >
          <IonRow style={{width:"85%", margin:"auto"}}>
            <IonCol>
              <IonLabel className='signup-privacy-info' >
                For privacy concerns, your username cannot be your email, it will
                be displayed in your style feed, account selection, and reviews
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow style={{width:"85%", margin:"auto"}}>
            <IonCol >
              <Input
                value={person.password}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder="PASSWORD"
                onChange={(val) => { setPerson({ ...person, password: val }) }}

              />
            </IonCol>
          </IonRow>
          <IonRow style={{width:"85%", margin:"auto"}}>
            <IonCol >

              <Input
                value={person.comfirmPassword}
                className={`nobo-input ${error ? 'invalid-text-color' : ''}`}
                placeholder="COMFIRM PASSWORD"
                onChange={(val) => { setPerson({ ...person, comfirmPassword: val }) }}
              ></Input>
            </IonCol>
          </IonRow>

        </IonGrid>

        <IonRow style={{width:"85%", margin:"auto"}} >
          <IonCol style={{ marginTop: 170 }}>
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
              onClick={() => { signup()}}
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

export default SignUp;
