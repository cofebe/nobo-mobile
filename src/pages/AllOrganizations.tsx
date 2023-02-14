import {
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
  useIonViewWillEnter,
} from '@ionic/react';
import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { OrganizationService } from '../services/OrganizationService';
import { OrganizationProfile } from '../data/organization';
import { UserService } from '../services/UserService';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

const AllOrganizations: React.FC = () => {
  const history = useHistory();

  const authService = new AuthService();
  const userService = new UserService();
  const organizationServive = new OrganizationService();

  const [organizations, setOrganizations] = useState<OrganizationProfile[]>([]);

  function loadOrganizations() {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    console.log(user.user['user_id'])

    organizationServive
      .getOrganizaitonByUserID(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setOrganizations(data);
      })
  }

  const userId = authService.getUserID();

  useIonViewWillEnter(() => {
      loadOrganizations();
  });

  return (
    <IonPage>
      <IonHeader className="home-header">
        <IonToolbar className="home-header-toolbar">
          <IonButtons slot="start">
            <IonButtons slot="start">
              <IonIcon
                style={{ paddingLeft: '1rem' }}
                onClick={() => {
                  history.push('/settings');
                }}
                slot="icon-only"
                icon={chevronBackOutline}
              />
            </IonButtons>
          </IonButtons>
          <IonTitle>All Organizations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem style={{ marginTop: '10px' }} lines="none">
          <IonRow
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IonCol size="8">
              <div style={{ fontWeight: '500' }}>Organizations You Manage </div>
            </IonCol>
          </IonRow>
        </IonItem>
        {organizations.map((o) => {
          return (
        <IonItem
          style={{ paddingTop: '1rem' }}
          onClick={() => {
            history.push(`/home/organization-profile/${o.organization_id}`);
          }}
          // disabled
        >
            <IonRow
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
                  <h2>{o.organization_name}</h2>
                </IonLabel>
              </IonCol>
              <IonCol size="1">
                <IonLabel
                  style={{
                    color: '#00816D',
                  }}
                >
                  <IonIcon
                    onClick={() => {
                      history.push('/settings');
                    }}
                    slot="icon-only"
                    icon={chevronForwardOutline}
                  />
                </IonLabel>
              </IonCol>
            </IonRow>
        </IonItem>)
        })}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            padding: '20px',
          }}
        >
          <div
            onClick={() => {
              history.push(`/home/add-organization/${userId}`);
            }}
            style={{
              padding: '5px 20px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <IonLabel
              style={{
                color: '#00d6b6',
                fontWeight: 500,
                fontSize: '12px',
              }}
            >
              <h3>Add Organization</h3>
            </IonLabel>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AllOrganizations;
