import { useHistory } from 'react-router-dom';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import '../styles.scss';
import './Splash.css';
import { UserService } from '../services/UserService';

const Splash: React.FC = () => {
  const history = useHistory();

  useIonViewWillEnter(() => {
    const userService = new UserService();
    userService.getMe()
      .then(user => {
        if (user) {
          history.push(`/home/explore/${user.experiencePreferences}/explore`);
          return;
        }
      })
      .catch(error => {
        console.error(`There was an error fetching the user: ${error}`);
      })
      .finally(() => {
        setTimeout(() => {
          history.push('/get-started');
        }, 2000);
      });
  })

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
      <div>
        <img className="splash-logo" src="assets/images/nobo_logo.png" alt="logo" />
      </div>
    </IonPage>
  );
};

export default Splash;
