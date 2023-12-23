import { IonButton, IonPage } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import backgroundImage1 from '../assets/nobo-splash-1.jpeg';
import backgroundImage3 from '../assets/nobo-splash-2.jpeg';
import backgroundImage2 from '../assets/nobo-splash-3.jpeg';

import './GetStarted.scss';

const GetStarted: React.FC = () => {
  const history = useHistory();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sentences = [
    `DISCOVER \nSUSTAINABLE \nLUXURY`,
    'TRADE,\nBUY & SELL \nLUXURY',
    'A NEW LUXURY \nEXPERIENCE \nAWAITS',
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
            fontFamily: 'Georgia',
            // fontSize: '40px',
            // fontFamily: 'Baskerville',
            fontSize: '37px',
            fontWeight: '400',
            lineHeight: '60px',
            marginTop: '474px',
            color: '#FFFFFF',
            marginLeft: '40px',
            height:'200px',
            whiteSpace: 'pre-wrap'
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
              width: '100%',
              margin: '0 24px',
              height: '51px',
              fontFamily: 'Nunito Sans',
              fontSize: '15px',
              fontWeight: '700',
              lineHeight: '15px',
              // border: '0.5px solid #ffffff',
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
              fontWeight: '700',
              fontSize: '15px',
              lineHeight: '22.5px',
              color: '#FFFFFF',
            }}
          >
            Already a NOBO Insider?
          </div>
          <div
            style={{
              textDecorationLine: 'underline',
              fontFamily: 'Nunito Sans',
              fontWeight: '700',
              color: 'white',
              fontSize: '15px',
              marginLeft: '24px',
            }}
            onClick={() => {
              history.push('/login');
            }}
          >
            LOGIN
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default GetStarted;
