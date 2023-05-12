import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonLabel,
  useIonViewWillEnter,
  IonButton,
} from '@ionic/react';
import 'cropperjs/dist/cropper.css';
import './FollowPeople.scss';
import Button from '../components/Button';
import 'cropperjs/dist/cropper.css';
import { UserService } from '../services/UserService';
import { User } from '../models';

const FollowPeople: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [users, setUsers] = useState<User[]>([]);
  const [follow, setFollow] = useState<string[]>([]);
  const [peopleIfollow, setPeopleIfollow] = useState<string[]>([]);

  //  fetching exiting users to follow
  useIonViewWillEnter(() => {
    userService
      .getUsers()
      .then(res => res)
      .then(users => {
        setUsers(users?.users);
      })
      .catch(error => {
        console.log('follow users error', error);
      });
  });

  const myFollowList = () => {
    userService
      .getMe()
      .then((user: User) => {
        setPeopleIfollow(user.following);
      })
      .catch(error => {
        console.log('error msg while fetching user profile', error);
      });
  };

  // Load My Following List
  useIonViewWillEnter(() => {
    myFollowList();
  });

  // Following  a user
  const followUser = async (userId: string) => {
    myFollowList();
    setFollow([...follow, userId]);
    const result = peopleIfollow.includes(userId, 0);
    if (!result) {
      userService
        .followUsers(userId)
        .then(user => {
          console.log(' my updated following list ', user.following);
        })
        .catch((err: any) => {
          console.log(' FollowUser', err);
        });
    } else {
      console.log(`You already followed this user ${userId}`);
    }
  };

  return (
    <IonPage className="follow-people-main-container">
      <IonContent className="follow-people-ion-content">
        <div className="follow-people-header">
          <img
            onClick={() => {
              history.goBack();
            }}
            className="follow-people-back-btn"
            style={{ color: 'black' }}
            height={23}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />

          <img className="follow-people-nobo-logo" src="assets/images/nobo_logo.png" alt="logo" />
        </div>

        <IonRow>
          <IonCol className="follow-people-title">FOLLOW PEOPLE</IonCol>
        </IonRow>
        <IonRow className="follow-people-desc-container">
          <IonCol className="follow-people-desc">
            Follow 5 other users to begin connecting with other insiders!
          </IonCol>
        </IonRow>

        <div className="follow-people-body-container" style={{}}>
          {users?.map(user => (
            <div key={user._id} className="follow-people-users-row">
              <div className="follow-people-users-img-container">
                <img className="follow-people-users-img" src={user.avatar} alt={user.displayName} />
              </div>
              <div className="follow-people-user-names-container">
                <IonLabel>@{user.displayName}</IonLabel>
              </div>

              <div className="follow-people-button-container">
                <Button
                  disabled={follow.includes(user._id, 0)}
                  className="profile-picture-btn"
                  label={!follow.includes(user._id, 0) ? 'FOLLOW' : 'FOLLOWING'}
                  large={true}
                  onClick={e => {
                    e.preventDefault();
                    followUser(user._id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {follow.length > 0 ? (
          ''
        ) : (
          <IonRow className={'follow-people-skip-container'}>
            <IonButton
              fill="clear"
              className="follow-people-skip-text"
              disabled={follow.length > 0}
              onClick={() => {
                history.push('/select-brands');
              }}
            >
              SKIP FOR NOW
            </IonButton>
          </IonRow>
        )}

        <div
          className={
            follow.length < 1
              ? 'follow-people-submit-btn-container2'
              : 'follow-people-submit-btn-container'
          }
        >
          <Button
            label="NEXT"
            large={true}
            onClick={e => {
              e.preventDefault();
              history.push('/select-brands');
            }}
            disabled={follow.length < 5}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FollowPeople;
