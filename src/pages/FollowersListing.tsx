import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonLabel,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import './FollowingListing.scss';
import { UserService } from '../services/UserService';
import { User } from '../models';
import HeaderComponent from '../components/HeaderComponent';
import Search from '../components/Search';
import { uniqueId } from 'lodash';

const FollowerListing: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState('')

  const userFollowings = () => {
    const addressBarPathName = history.location.pathname;
    let userIdStr: any = addressBarPathName.substring(addressBarPathName.lastIndexOf('/') + 1);

    if (isNaN(userIdStr) && userIdStr.length > 10) {
      userIdStr = userIdStr.substring(userIdStr.lastIndexOf('-') + 1);
    }
    userService
      .getFollowers(userIdStr)
      .then(res => res.json())
      .then(data => {
        setUsers([...data?.followers]);
      });
  }

  useIonViewWillEnter(() => {
    userFollowings();
  });

  useIonViewWillLeave(()=> {
    setUsers([]);
    setInputValue('');
  })

  const mapFilter = users?.filter(user =>
    user.displayName.toLowerCase().includes(inputValue.toLowerCase(), 0)
  );

  return (
    <IonPage className='following-people-main-container'>
      <IonContent className='following-people-ion-content'>
        <HeaderComponent />
        <IonRow>
          <IonCol className='following-people-title'>FOLLOWERS NOBOINSIDERS</IonCol>
        </IonRow>
        <IonRow style={{ marginLeft: '20px', marginRight: '20px' }}>
          <IonCol>
            <Search
              value={inputValue}
              onChange={
                (e) => {
                  setInputValue(e)
                }} />
          </IonCol>
        </IonRow>
        <div className='following-people-body-container'>
          {mapFilter?.map(user => (
            <div key={user._id} className='following-people-users-row' onClick={e => {
              e.preventDefault();
              history.push(`/home/profile/${user._id}` , {
                random: uniqueId(),
              });
            }}>
              <div className='following-people-users-img-container'>
                <img className='following-people-users-img' src={user.avatar} alt={user.displayName} />
              </div>
              <div className='following-people-user-names-container'>
                <IonLabel>@{user.displayName}</IonLabel>
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FollowerListing;
