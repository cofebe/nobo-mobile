import { useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonRow,
  IonToolbar,
  IonPage,
  IonContent,
} from '@ionic/react';
import './NoboHomePage.scss';
import NoboHeader from '../components/NoboHeader';

const NoboHomePage: React.FC = () => {
  const getSectionName = (sectionName: string) => {
    console.log('sectionName', sectionName);
  };
  return (
    <IonPage className="nobo-home-page">
      <NoboHeader sectionNameCallback={getSectionName} />
    </IonPage>
  );
};

export default NoboHomePage;
