import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
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
    setTimeout(()=>{
      history.push('/login');
    }, waitSeconds * 500);
  }

  return (
    <IonPage id="nobo-splash-page">
      <div className="nobo-splash-backdrop">
        <img className="splash-logo" src="assets/images/nobo_logo_rounded.png" width="200" height="200" alt="logo" />
      </div>
    </IonPage>
  )
};

export default Splash;
