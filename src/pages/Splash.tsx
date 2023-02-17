import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import './URP.css';
import './Splash.css';

const Splash: React.FC = () => {
  useEffect(() => {
    preloadAppContentAndNav();
  });

  useIonViewWillEnter(() => {
    // some initialization code
  });

  const history = useHistory();
  const waitSeconds = 1;

  function preloadAppContentAndNav() {
    setTimeout(() => {
      history.push('/get-started');
    }, waitSeconds * 2000);
  }

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
        <img
          className="splash-logo"
          src="assets/images/nobo_logo.png"
          alt="logo"
        />
      </div>
    </IonPage>
  );
};

export default Splash;
