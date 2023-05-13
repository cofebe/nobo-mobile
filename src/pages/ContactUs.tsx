import {
 IonButton,
 IonContent,
 IonHeader,
 IonItem,
 IonLabel,
 IonPage,
 IonToolbar,
 IonRow,
 IonCol,
 IonTitle,
 IonButtons,
 IonIcon,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

const ContactUs: React.FC = () => {
 const history = useHistory();

 function emailSupport(subject: string) {
  window.location.href = `mailto:support@noboplus.com?subject=${subject}`;
 }

 return (
  <IonPage>
   <IonHeader className="home-header">
    <IonToolbar className="home-header-toolbar">
     <IonButtons slot="start">
      <IonButtons slot="start">
       <IonIcon
        style={{ paddingLeft: '1rem' }}
        onClick={() => {
         history.goBack();
        }}
        slot="icon-only"
        icon={chevronBackOutline}
       />
      </IonButtons>
     </IonButtons>
     <IonTitle>Contact Us</IonTitle>
    </IonToolbar>
   </IonHeader>
   <IonContent>
    <IonItem>
     <IonRow
      onClick={() => emailSupport('Delete Account Request')}
      style={{
       marginTop: '2rem',
       width: '100%',
       display: 'flex',
       alignItems: 'center',
      }}
     >
      <IonCol size="1">
       <div>
        <IonIcon name="card"></IonIcon>
       </div>
      </IonCol>
      <IonCol offset=".25" size="9">
       <IonLabel
        style={{
         color: '#00816D',
        }}
       >
        <h2>Request Account Deletion</h2>
       </IonLabel>
      </IonCol>
     </IonRow>
    </IonItem>

    <IonItem>
     <IonRow
      onClick={() => emailSupport('Support Email')}
      style={{
       width: '100%',
       display: 'flex',
       alignItems: 'center',
      }}
     >
      <IonCol size="1">
       <div>
        <IonIcon name="card"></IonIcon>
       </div>
      </IonCol>
      <IonCol offset=".25" size="9">
       <IonLabel
        style={{
         color: '#00816D',
        }}
       >
        <h2>Send Support Email</h2>
       </IonLabel>
      </IonCol>
     </IonRow>
    </IonItem>
   </IonContent>
  </IonPage>
 );
};

export default ContactUs;
