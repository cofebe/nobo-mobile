import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import '../styles.scss';
import './Splash.css';

const Splash: React.FC = () => {
 const history = useHistory();

 useIonViewWillEnter(() => {
  setTimeout(() => {
   history.push('/get-started');
  }, 2000);
  // some initialization code
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
   <div>
    <img className="splash-logo" src="assets/images/nobo_logo.png" alt="logo" />
   </div>
  </IonPage>
 );
};

export default Splash;
