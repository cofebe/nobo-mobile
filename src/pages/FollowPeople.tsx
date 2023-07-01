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
import HeaderComponent from '../components/HeaderComponent';
import Search from '../components/Search';

const FollowPeople: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [users, setUsers] = useState<User[]>([]);
  const [peopleIfollow, setPeopleIfollow] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('')



  function getMyFollowingList() {
    userService.getMe()
      .then((user: User) => {
        setPeopleIfollow(user.following)

      })

  }

  //  fetching exiting users to follow
  const getUsers = (query: string) => {
    getMyFollowingList()
    userService
      .getUsers(query)
      .then(res => res)
      .then(users => {
        setUsers(users?.users);
      })
      .catch(error => {
        console.log('follow users error', error);
      });
  }


  useIonViewWillEnter(() => {
    getMyFollowingList()
    getUsers('a')
  });


  // Following  a user
  const followUser = async (userId: string) => {
    if (peopleIfollow.includes(userId, 0)) {
      console.log(`You already followed this user ${userId}`);
      userService
        .removeFollowUser(userId)
        .then((user) => {
          getMyFollowingList()
        })
        .catch((err: any) => {
          // console.log(' FollowUser', err);
        });


    } else {
      console.log(userId, 'not in your')
      userService
        .followUsers(userId)
        .then((user: User) => {
          getMyFollowingList()
        })
        .catch((err: any) => {
          // console.log(' FollowUser', err);
        });

    }



  };

  const mapFilter = users?.filter(user =>
    user.displayName.toLowerCase().includes(inputValue.toLowerCase(), 0)
  );

  console.log(peopleIfollow)

  return (
    <IonPage className='follow-people-main-container'>
      <IonContent className='follow-people-ion-content'>
        <HeaderComponent />
        <IonRow>
          <IonCol className='follow-people-title'>FOLLOW PEOPLE</IonCol>
        </IonRow>
        <IonRow className='follow-people-desc-container'>
          <IonCol className='follow-people-desc'>
            follow 5 other users to begin connecting with other Insiders!
          </IonCol>
        </IonRow>
        <IonRow style={{ marginLeft: '20px', marginRight: '20px' }}>
          <IonCol>
            <Search
              value={inputValue}
              onChange={
                (e) => {
                  getUsers(e)
                  setInputValue(e)
                }} />
          </IonCol>
        </IonRow>
        <div className='follow-people-body-container' style={{}}>
          {mapFilter?.map(user => (
            <div key={user._id} className='follow-people-users-row'>
              <div className='follow-people-users-img-container'>
                <img className='follow-people-users-img' src={user.avatar} alt={user.displayName} />
              </div>
              <div className='follow-people-user-names-container'>
                <IonLabel>@{user.displayName}</IonLabel>
              </div>

              <div className='follow-people-button-container'>
                <Button
                  disabled={peopleIfollow.includes(user._id, 0)}
                  className='profile-picture-btn'
                  label={peopleIfollow.includes(user._id, 0) ? 'FOLLOWING' : 'FOLLOW'}
                  large={false}
                  onClick={e => {
                    e.preventDefault();
                    followUser(user._id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {peopleIfollow.length < 5 && (
          <IonRow className={'follow-people-skip-container'}>
            <IonButton
              fill='clear'
              className='follow-people-skip-text'
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
            peopleIfollow.length < 5
              ? 'follow-people-submit-btn-container2'
              : 'follow-people-submit-btn-container'
          }
        >
          <Button
            className='btn'
            label='NEXT'
            large={true}
            onClick={e => {
              e.preventDefault();
              history.push('/select-brands');
            }}
            disabled={peopleIfollow.length < 5}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FollowPeople;
