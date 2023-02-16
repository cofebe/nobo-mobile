import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
} from '@ionic/react';
import './URP.css';
import './PrimarySport.css';

const PrimarySport: React.FC = () => {
  //const [isActive, setIsActive] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  useIonViewWillEnter(() => {
    // some initialization code
  });
  const history = useHistory();
  const location = history.location;
  const btnColor = '#00816D';

  const sportOptions: { [key: number]: string } = {
    0: 'football',
    1: 'wbasketball',
    2: 'mbasketball',
    3: 'baseball',
    4: 'softball',
    5: 'wlacrosse',
    10: 'mlacrosse',
    6: 'wsoccer',
    7: 'msoccer',
    8: 'wvolleyball',
    9: 'mvolleyball',
  };

  function signup() {
    switch (location.state) {
      case 'athlete':
        history.push({
          pathname: '/signup-athlete',
          state: selectedSport,
        });
        break;
      case 'trainer':
        history.push({
          pathname: '/signup-trainer',
          state: selectedSport,
        });
        break;
      case 'coach':
        history.push({
          pathname: '/signup-coach',
          state: selectedSport,
        });
        break;
      default:
        break;
    }
  }

  function handleClick(value: number) {
    setSelectedSport(sportOptions[value]);
    //setIsActive((current) => !current);
  }

  function isActiveSport(sport: string) {
    return selectedSport === sport;
  }

  return (
    <IonPage className="nobo-page" id="roles-page">
      <IonContent scrollY>
        <IonRow>
          <IonCol class="ion-text-center">
            <div className="primary-sport-sub-header">
              Select your primary sport
            </div>
            <IonLabel class="primary-sport-sub-label">
              Don't worry. You can add additional sports to your profile later.
            </IonLabel>
          </IonCol>
        </IonRow>
        <form
          style={{ paddingLeft: '10px', paddingRight: '10px' }}
          className="nobo-form"
        >
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                detail={false}
                onClick={() => handleClick(0)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('football') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Football
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                // disabled={true}
                detail={false}
                onClick={() => handleClick(1)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('wbasketball') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Women's Basketball
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                // disabled={true}
                detail={false}
                onClick={() => handleClick(2)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('mbasketball') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Men's Basketball
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                // disabled={true}
                detail={false}
                onClick={() => handleClick(8)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('wvolleyball') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Women's Volleyball
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                // disabled={true}
                detail={false}
                onClick={() => handleClick(9)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('mvolleyball') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Men's Volleyball
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                // disabled={true}
                detail={false}
                onClick={() => handleClick(3)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('baseball') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Baseball
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                detail={false}
                onClick={() => handleClick(4)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('softball') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Softball
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                detail={false}
                onClick={() => handleClick(5)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('wlacrosse') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Woman's Lacrosse
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                detail={false}
                onClick={() => handleClick(10)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('mlacrosse') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Men's Lacrosse
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                detail={false}
                onClick={() => handleClick(6)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('wsoccer') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Women's Soccer
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="nobo-center" size="11">
              <IonItem
                button
                detail={false}
                onClick={() => handleClick(7)}
                className={
                  'primary-sport-input ' +
                  (isActiveSport('msoccer') ? 'selected' : '')
                }
              >
                <IonLabel
                  className="primary-sport-label"
                  style={{ color: '#00816D' }}
                >
                  Men's Soccer
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol className="nobo-center" size="11">
              {selectedSport === '' && (
                <IonButton
                  disabled={true}
                  expand="block"
                  className="sport-button"
                >
                  Get Started
                </IonButton>
              )}
              {selectedSport !== '' && (
                <IonButton
                  onClick={(e) => {
                    e.preventDefault();
                    signup();
                  }}
                  color={btnColor}
                  className="nobo-green-btn"
                  style={{ display: 'block', color: '#FFFFFF' }}
                >
                  Lets Go!
                </IonButton>
              )}
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default PrimarySport;
