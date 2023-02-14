import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  useIonViewWillEnter,
} from '@ionic/react';
import './Watchlist.css';
import { Profile, AthleteUserProfile } from '../data/profile';

import WatchListItem from '../components/WatchlistItem';
import { UserService } from '../services/UserService';
import SortWidget from '../components/SortWidget';
import UrpHeader from '../components/UrpHeader';

const Watchlist: React.FC = () => {
  const [messages, setMessages] = useState<Profile[]>([]);
  const [profiles, setProfiles] = useState<any>();
  const [notes, setNotes] = useState<string[]>([]);
  const userService = new UserService();
  let storage: any = window.localStorage.getItem('persistedState');
  let user = JSON.parse(storage);

  useIonViewWillEnter(() => {
    let watchListItems: any = [];
    userService
      .getWatchlist(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        let notesCopy = [...notes];
        for (let i = 0, il = data.length; i < il; i++) {
          watchListItems.push(data[i].profile);
          notesCopy.push(data[i].notes);
        }
        setNotes(notesCopy);
        setProfiles(data);
        setMessages(watchListItems);
      });
  });

  const convertHeightStringtoInches = (height: string) => {
    const feet = parseInt(height.split("'")[0]);
    const inches = height.split("'")[1].replace('"', '');
    const totalInches = feet * 12 + parseInt(inches);
    return JSON.stringify(totalInches);
  };

  const sortMessages = (profiles: any, val: string) => {
    const valFilter = val.split(' ')[0];
    const valType = val.split(' ')[1];
    console.log('valFilter', valFilter);
    console.log('valType', valType);
    profiles.sort((a: any, b: any) => {
      let aVal = null;
      let bVal = null;
      if (valFilter === 'Height') {
        aVal = convertHeightStringtoInches(
          a.profile.athlete_user_profile.height.String
        );
        bVal = convertHeightStringtoInches(
          b.profile.athlete_user_profile.height.String
        );
      } else if (valFilter === 'Weight') {
        aVal = parseInt(a.profile.athlete_user_profile.weight.String);
        bVal = parseInt(b.profile.athlete_user_profile.weight.String);
      } else {
        aVal = parseInt(a.profile.basic_user_profile.class_year.String);
        bVal = parseInt(b.profile.basic_user_profile.class_year.String);
      }
      if (valType === '(ASC)') {
        if (aVal < bVal) {
          return -1;
        }
        if (aVal > bVal) {
          return 1;
        }
        return 0;
      } else {
        if (aVal > bVal) {
          return -1;
        }
        if (aVal < bVal) {
          return 1;
        }
        return 0;
      }
    });
    let profilesCopy = [...profiles];
    let newMessages = [];
    let newNotes = [];
    for (let i = 0, il = profiles.length; i < il; i++) {
      newMessages.push(profilesCopy[i].profile);
      newNotes.push(profilesCopy[i].notes);
    }
    setMessages(newMessages);
    setNotes(newNotes);
  };

  useEffect(() => {
    //setIsAthlete(true);
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage className="home-page">
      <UrpHeader></UrpHeader>
      <IonContent style={{ '--background': '#f9fbfb' }} fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <div style={{ paddingLeft: 25, paddingTop: 16, paddingBottom: 17 }}>
            <SortWidget
              types={[
                'Class (ASC)',
                'Class (DESC)',
                'Height (ASC)',
                'Height (DESC)',
                'Weight (ASC)',
                'Weight (DESC)',
              ]}
              onSort={(val) => {
                sortMessages(profiles, val);
              }}
              asc={true}
            />
          </div>
        </IonHeader>
        <IonList className="urp-list-background"></IonList>
        <IonList className="urp-list-background">
          {messages.map((m, i) => (
            <WatchListItem key={m.user_id + 1} notes={notes[i]} profile={m} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Watchlist;
