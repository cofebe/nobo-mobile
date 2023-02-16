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
  useIonActionSheet,
  useIonViewWillEnter,
} from '@ionic/react';
import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

const Settings: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const btnColor = '#00816D';
  const [userSubscribed, setUserSubscribed] = useState(false);

  const authService = new AuthService();
  const [present] = useIonActionSheet();

  const userId = authService.getUserID();

  function emailSupport(subject: string) {
    window.location.href = `mailto:support@noboplus.com?subject=${subject}`;
  }

  async function logout() {
    if (await authService.logout()) {
      history.push('/login');
    }
  }

  useIonViewWillEnter(() => {
    userService
      .getProfile(userId)
      .then((res) => res.json())
      .then((data) => {
        setUserSubscribed(data.is_premium?.String === 'true');
      });
  });

  function openContactUs() {
    present({
      cssClass: 'nobo-action-sheet',
      buttons: [
        {
          text: 'Send Support Email',
          data: {
            action: 'supportEmail',
          },
        },
        {
          text: 'Delete Account',
          data: {
            action: 'deleteAccount',
          },
          role: 'destructive',
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.data.action !== undefined) {
          console.log(detail);
        }

        if (detail.data.action == 'deleteAccount') {
          // emailSupport('Delete Account Request');
          userService
            .deleteAccount(userId, { user_id: userId })
            .then((res) => {
              res.json();
              console.log(res);
            })
            .then((data) => {
              logout();
            });
        }

        if (detail.data.action == 'supportEmail') {
          emailSupport('Support Email');
        }
      },
    });
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
                  history.push('/home');
                }}
                slot="icon-only"
                icon={chevronBackOutline}
              />
            </IonButtons>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem
          style={{ paddingTop: '1rem' }}
          onClick={() => {
            history.push('/manage-subscription');
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
                <h2>Manage Subscription</h2>
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
        </IonItem>
        <IonItem
          onClick={() => {
            history.push('/home/all-organizations');
          }}
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
                <h2>Organizations</h2>
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
                    history.push('/home/organization-profile');
                  }}
                  slot="icon-only"
                  icon={chevronForwardOutline}
                />
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonItem
          onClick={() => {
            history.push('/home/organization-profile');
          }}
          disabled
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
                <h2>Account Settings</h2>
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
                    history.push('/home/organization-profile');
                  }}
                  slot="icon-only"
                  icon={chevronForwardOutline}
                />
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonItem
          onClick={() => {
            history.push('/home/organization-profile');
          }}
          disabled
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
                <h2>Change Password</h2>
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonItem
          onClick={() => {
            history.push('/home/organization-profile');
          }}
          style={{ marginTop: '4rem' }}
          disabled
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
                <h2>Notifications</h2>
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
                    history.push('/home/all-organizations');
                  }}
                  slot="icon-only"
                  icon={chevronForwardOutline}
                />
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonItem
          onClick={() => {
            openContactUs();
          }}
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
                <h2>Contact Us / Delete Account</h2>
              </IonLabel>
            </IonCol>
            <IonCol size="1">
              <IonLabel
                style={{
                  color: '#00816D',
                }}
              >
                <IonIcon slot="icon-only" icon={chevronForwardOutline} />
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonItem>
        {userSubscribed && (
          <IonItem
            onClick={() => {
              history.push(`home/profile-insights/${userId}`);
            }}
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
                  <h2>View Insights</h2>
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
                      history.push(`home/profile-insights/${userId}`);
                    }}
                    slot="icon-only"
                    icon={chevronForwardOutline}
                  />
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonItem>
        )}
        <IonRow>
          <IonCol
            className="nobo-center"
            style={{ paddingTop: '2rem', textAlign: 'center' }}
            size="11"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <h5>Logout</h5>
            </a>
          </IonCol>
          <IonCol
            className="nobo-center"
            style={{
              paddingTop: '2rem',
              textAlign: 'center',
              textDecoration: 'underline',
            }}
            size="11"
          >
            <a href="/terms-and-conditions">
              <h5>Terms & Conditions</h5>
            </a>
          </IonCol>
          <IonCol
            className="nobo-center"
            style={{ textAlign: 'center', textDecoration: 'underline' }}
            size="11"
          >
            <a href="/privacy-policy">
              <h5>Privacy Policy</h5>
            </a>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
