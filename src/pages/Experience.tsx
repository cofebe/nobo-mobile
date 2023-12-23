import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonRow, IonCol, IonGrid } from '@ionic/react';
import './Experience.scss';
import { UserService } from '../services/UserService';
import { User } from '../models';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import HeaderComponent from '../components/HeaderComponent';

const Experience: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [selectedExperienceArray, setSelectedExpArray] = useState<string[]>([]);


  const handleTicker = (expId: string) => {
    if (!selectedExperienceArray.includes(expId, 0)) {
      setSelectedExpArray([expId])
    } else if (selectedExperienceArray.includes(expId, 0)) {
      const updatedRemove = selectedExperienceArray.filter((expOption) => expOption !== expId)
      setSelectedExpArray(updatedRemove)
    }
  };

  const handleSubmit = async () => {
    userService
      .experience(selectedExperienceArray[0])
      .then((user: User) => {
        if (user) {
          history.push('/profile-picture');
        } else {
          console.log('something went wrong');
        }
      })
      .catch((err: any) => {
        console.log('experience error', err);
      });
  };


  return (
    <IonPage className='experience-main-container'>
      <IonContent className='experience-ion-content'>
        <HeaderComponent />
        <IonRow >
          <IonCol className='experience-title'>CHOOSE YOUR EXPERIENCE</IonCol>
        </IonRow>
            <IonGrid className='experience-form-container'>
          {/* WOMEN */}
          <IonCol
            size='12'
            className='experience-img-container'
            onClick={() => {
              handleTicker('women');
            }}
          >
            <img
              className={
                selectedExperienceArray.includes('women')
                  ? 'exp-img-selected'
                  : ''
              }
              src='assets/images/experience-women2.png'
              alt='women'
            />
            <h3 className='exp-img-title'> WOMEN </h3>
            <div className='exp-checkbox-ticker'>
              <Checkbox value={selectedExperienceArray.includes('women')} onChange={() => { }} />
            </div>
          </IonCol>

          {/* MEN */}
          <IonCol
            size='12'
            className='experience-img-container'
            onClick={() => {
              handleTicker('men');
            }}
          >
            <img
              className={
                selectedExperienceArray.includes('men')
                  ? 'exp-img-selected'
                  : ''
              }
              src='assets/images/experience-men2.png'
              alt='men'
            />
            <h3 className='exp-img-title'> MEN </h3>
            <div className='exp-checkbox-ticker'>
              <Checkbox value={selectedExperienceArray.includes('men')} onChange={() => { }} />
            </div>
          </IonCol>

          {/* SNEAKERS */}
          <IonCol
            size='12'
            className='experience-img-container'
            onClick={() => {
              handleTicker('sneakers');
            }}
          >
            <img
              className={
                selectedExperienceArray.includes('sneakers')
                  ? 'exp-img-selected'
                  : ''
              }
              src='assets/images/experience-sneakers2.png'
              alt='sneakers'
            />
            <h3 className='exp-img-title'> SNEAKERS </h3>
            <div className='exp-checkbox-ticker'>
              <Checkbox value={selectedExperienceArray.includes('sneakers')} onChange={() => { }} />
            </div>
          </IonCol>

        </IonGrid>


        <IonRow >
          <IonCol size='12'>
            <div className='experience-btn-container'>
              <Button
                className='experience-btn'
                label='NEXT'
                large
                onClick={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={selectedExperienceArray.length < 1}
              />
            </div>
          </IonCol>
        </IonRow>

      </IonContent>
    </IonPage>
  );
};

export default Experience;
