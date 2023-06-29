import { useHistory } from 'react-router-dom';
import { IonCol, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react';
import '../styles.scss';
import './Splash.css';
import { UserService } from '../services/UserService';

const Splash: React.FC = () => {
  const history = useHistory();

  useIonViewWillEnter(() => {
    const userService = new UserService();
    let userLoggedIn = false;
    userService
      .getMe()
      .then(user => {
        if (user) {
          userLoggedIn = true;
          history.push(`/home/explore/${user.experiencePreferences}/explore`);
          return;
        }
      })
      .catch(error => {
        console.error(`There was an error fetching the user: ${error}`);
      })
      .finally(() => {
        setTimeout(() => {
          if (!userLoggedIn) {
            history.push('/get-started');
          }
        }, 2000);
      });
  });

  return (
    <IonPage
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}
      id="nobo-splash-page"
    >
      <IonRow>
        <IonCol className='splash-logo-container' size='12'>
          <div className='splash-logo-box'>
            <img
              className="splash-logo"
              src="assets/images/nobo_logo.png" alt="logo" />
          </div>
        </IonCol>
      </IonRow>

      {/* <div>
        <img
        className="splash-logo"
        src="assets/images/nobo_logo.png" alt="logo" />
      </div> */}
    </IonPage>
  );
};

export default Splash;
