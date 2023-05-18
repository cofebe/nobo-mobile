import { IonButton, IonPage } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import backgroundImage1 from '../assets/nobo-splash-1.png';
import backgroundImage2 from '../assets/nobo-splash-2.png';
import backgroundImage3 from '../assets/nobo-splash-3.png';

import './GetStarted.scss';

const GetStarted: React.FC = () => {
  const history = useHistory();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sentences = [
    'TRADE \n BUY, & SELL LUXURY',
    'RECEIVE \n BETTER \n DEALS',
    'DISCOVER NEW \n ELEGANCE',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(currentImageIndex => (currentImageIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage className="get-started-page">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${
            [backgroundImage1, backgroundImage2, backgroundImage3][currentImageIndex]
          })`,
        }}
      >
        <div
          style={{
            fontFamily: 'Baskerville',
            fontSize: '40px',
            fontWeight: '400',
            lineHeight: '60px',
            marginTop: '474px',
            maxWidth: '259px',
            color: '#FFFFFF',
            marginLeft: '40px',
          }}
        >
          {sentences[currentImageIndex]}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <IonButton
            style={{
              width: '341px',
              height: '51px',
              fontFamily: 'Nunito Sans',
              fontSize: '10px',
              fontWeight: '700',
              lineHeight: '15px',
              border: '0.5px solid #ffffff',
            }}
            // id="open-subscription-modal"
            onClick={() => {
              history.push('/signup1');
            }}
            //   color={btnColor}
            // disabled={!isActive || isSubscribed}
            type="submit"
            expand="block"
            className="nobo-button"
          >
            GET STARTED
          </IonButton>
        </div>
        <div style={{ display: 'flex', marginTop: '16px', marginLeft: '30px' }}>
          <div
            style={{
              fontFamily: 'Nunito Sans',
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '22.5px',
              color: '#FFFFFF',
            }}
          >
            Already a NOBO Insider?
          </div>
          <div
            style={{
              textDecorationLine: 'none',
              fontFamily: 'Nunito Sans',
              fontWeight: '700',
              color: '#D6980E',
              fontSize: '15px',
              marginLeft: '24px',
            }}
            onClick={() => {
              history.push('/login');
            }}
          >
            Login
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default GetStarted;
