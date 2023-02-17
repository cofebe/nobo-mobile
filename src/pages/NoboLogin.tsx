import { IonButton, IonPage, IonRow, IonCol, IonGrid, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import './NoboLogin.scss';

const NoboLogin: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage className="nobo-login-page">
      <div className="background-image">
        <IonRow>
          <IonCol size="2">
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
        </IonRow>
        <IonRow>
          <IonGrid className="login-box">
            <IonRow style={{ paddingTop: 20 }} class="ion-justify-content-center">
              <IonCol size="5" style={{ textAlign: 'center', fontSize: 20, fontWeight: 400, fontFamily: 'Baskerville', letterSpacing: '.05rem' }}>
                LOGIN
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput className="nobo-input" placeholder="USERNAME"></IonInput>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput className="nobo-input" placeholder="PASSWORD"></IonInput>
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
                  onClick={() => {}}
                  //   color={btnColor}
                  // disabled={!isActive || isSubscribed}
                  type="submit"
                  expand="block"
                  className="nobo-button"
                >
                  CONTINUE
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow style={{ paddingBottom: 20 }}>
              <IonCol
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
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: 'Nunito Sans',
                  fontWeight: '700',
                  color: '#D6980E',
                  fontSize: '15px',
                }}
              >
                Sign Up
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonRow>
        {/* <div style={{ display: 'flex', marginTop: '16px', marginLeft: '30px' }}>
          <div
            style={{
              fontFamily: 'Nunito Sans',
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '22.5px',
              color: '#FFFFFF',
            }}
          >
            Don't have an account?
          </div>
          <div
            style={{
              textDecorationLine: 'underline',
              fontFamily: 'Nunito Sans',
              fontWeight: '700',
              color: '#D6980E',
              marginLeft: '24px',
            }}
            onClick={() => {}}
          >
            Sign up
          </div>
        </div> */}
      </div>
    </IonPage>
  );
};

export default NoboLogin;
