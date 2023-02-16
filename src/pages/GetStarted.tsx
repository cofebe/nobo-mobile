import { IonButton, IonPage } from '@ionic/react';

import './GetStarted.scss';

const GetStarted: React.FC = () => {
  return (
    <IonPage>
      <div className="background-image">
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
          TRADE,
          <br /> BUY, & SELL LUXURY
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
            }}
            // id="open-subscription-modal"
            onClick={() => {}}
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
              textDecorationLine: 'underline',
              fontFamily: 'Nunito Sans',
              fontWeight: '700',
              color: '#D6980E',
              marginLeft: '24px',
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
