import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/react';
import './URP.css';
import './Roles.css';

const Roles: React.FC = () => {
  useIonViewWillEnter(() => {
    // some initialization code
  });
  const history = useHistory();
  const btnColor = '#00816D';
  return (
    <IonPage className="urp-page" id="roles-page">
      <IonContent scrollY={false}>
        <IonGrid className="urp-desktop-login">
          <IonRow>
            <IonCol class="ion-text-center">
              <img
                className="logo-image logo-image-margin"
                src="assets/images/urp_logo_round.svg"
                width="150"
                height="150"
                alt="logo"
              />
              <div className="urp-sub-header">Select your Role</div>
            </IonCol>
          </IonRow>
          <form className="urp-form">
            <IonRow>
              <IonCol className="urp-center" size="11">
                <IonButton
                  className="urp-basic-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: '/primary-sport',
                      state: 'athlete',
                    });
                  }}
                  color={btnColor}
                  expand="block"
                >
                  Athlete
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="urp-center" size="11">
                <IonButton
                  className="urp-basic-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: '/primary-sport',
                      state: 'coach',
                    });
                  }}
                  color={btnColor}
                  expand="block"
                >
                  Coach / Recruiter
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="urp-center" size="11">
                <IonButton
                  className="urp-basic-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: '/primary-sport',
                      state: 'trainer',
                    });
                  }}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   history.push('signup-trainer');
                  // }}
                  color={btnColor}
                  expand="block"
                >
                  Athletic Trainer
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Roles;
