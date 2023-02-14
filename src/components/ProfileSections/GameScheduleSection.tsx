import React from 'react';
import {
  IonButtons,
  IonButton,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './GameScheduleSection.css';
import { AthleteProfile } from '../../data/athlete-detail';
import { useHistory } from 'react-router-dom';
import { OverlayEventDetail } from '@ionic/core/components';
import { UserService } from '../../services/UserService';
import { useState, useRef, useEffect } from 'react';

import './GameScheduleSection.scss';
import { add, close, pencilOutline, trashOutline } from 'ionicons/icons';

interface GameScheduleSectionProps {
  profile: AthleteProfile;
  className: string;
  myProfile: boolean;
  userId: number;
}

interface Game {
  id: number;
  date: any;
  name: string;
  opponent: string;
  location: string;
  description: string;
}

const GameScheduleSection: React.FC<GameScheduleSectionProps> = ({
  profile,
  className,
  myProfile,
  userId,
}) => {
  const history = useHistory();
  const gameModal = useRef<HTMLIonModalElement>(null);
  const gameInput = useRef<HTMLIonInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [newGame, setNewGame] = useState<Game>({
    date: new Date().toISOString(),
    id: 0,
    name: '',
    opponent: '',
    location: '',
    description: '',
  });
  const [gameList, setGameList] = useState<Game[]>([]);
  const daysOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [showCalendar, setShowCalendar] = useState(false);
  const [validGameDate, setValidGameDate] = useState(false);
  const [validGameName, setValidGameName] = useState(false);
  const [validGameOpponent, setValidGameOpponent] = useState(false);
  const [validGameLocation, setValidGameLocation] = useState(false);
  const [validGameDescription, setValidGameDescription] = useState(false);

  const userService = new UserService();

  // editGameSchedule

  // saveGameSchedule
  const confirm = () => {
    if (editMode) {
      const slider: any = document.querySelector('ion-item-sliding');
      slider.closeOpened();
      userService
        .updateGame(userId, newGame.id, newGame)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      userService
        .saveGame(userId, newGame)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    userService
      .getGameSchedule(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setGameList(dataCopy);
        setNewGame({
          id: 0,
          date: '',
          name: '',
          opponent: '',
          location: '',
          description: '',
        });
        setValidGameName(false);
        gameModal.current?.dismiss(gameInput.current?.value, 'confirm');
        setNewGame({
          id: 0,
          date: '',
          name: '',
          opponent: '',
          location: '',
          description: '',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    const slider: any = document.querySelector('ion-item-sliding');
    slider.closeOpened();
    userService
      .getGameSchedule(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setGameList(dataCopy);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    userService
      .getGameSchedule(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setGameList(dataCopy);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const validate = () => {
    if (
      validGameDate &&
      validGameName &&
      validGameOpponent &&
      validGameLocation &&
      validGameDescription
    ) {
      return true;
    } else if (newGame.name.length !== 0) {
      return true;
    }
    return false;
  };

  const statsList: any = [];
  let showStats = false;

  function getTimeHour(date: any) {
    if (date != '') {
      let gameTime = new Date(date);
      let gameTimeHour =
        gameTime.getHours() > 12
          ? gameTime.getHours() % 12
          : gameTime.getHours();
      let gameTimeMinute =
        gameTime.getMinutes() < 10
          ? '0' + gameTime.getMinutes()
          : gameTime.getMinutes();
      let gameTimeMeridiem = gameTime.getHours() < 12 ? ' AM' : ' PM';

      if (gameTimeHour == 0) {
        gameTimeHour = 12;
      }

      if (gameTimeMinute == 0) {
        return gameTimeHour + ' ' + gameTimeMeridiem;
      } else {
        return gameTimeHour + ':' + gameTimeMinute + ' ' + gameTimeMeridiem;
      }
    }
    return '';
  }

  function getGameDay(date: any, short: boolean = false) {
    if (date != '' && !short) {
      let gameTime = new Date(date);
      let gameGameDay = daysOfWeek[gameTime.getDay()];
      let gameGameDate = gameTime.getDate();
      let gameTimeMonth = monthOfYear[gameTime.getMonth()];

      return gameGameDay + ', ' + gameTimeMonth + ' ' + gameGameDate;
    }

    if (date != '' && short) {
      let gameTime = new Date(date);
      let gameGameDay = daysOfWeekShort[gameTime.getDay()];
      let gameGameDate = gameTime.getDate();
      let gameTimeMonth = gameTime.getMonth();
      return gameGameDay + ', ' + gameTimeMonth + '/' + gameGameDate;
    }

    return '';
  }

  return (
    <div>
      <IonContent style={{ fontSize: '10px' }}>
        {gameList.map((game, index) => (
          <IonItemSliding>
            <IonItem style={{ fontSize: '10px' }} lines="none">
              <IonRow style={{ padding: '12px 0px 6px 0px', width: '100%' }}>
                <IonCol size="2" className="game-schedule-text">
                  {getGameDay(game.date, true)}
                </IonCol>
                <IonCol size="2" className="game-schedule-text">
                  {getTimeHour(game.date)}
                </IonCol>
                <IonCol
                  size="4"
                  className="game-schedule-text"
                  style={{ color: '#00D6B6' }}
                >
                  {game.name} vs {game.opponent}
                </IonCol>
                <IonCol size="4" className="game-schedule-text">
                  {game.location}
                </IonCol>
                <IonCol
                  size="12"
                  style={{ color: '#CCDBDC', padding: '8px 0px 12px 0px' }}
                >
                  {game.description}
                </IonCol>
              </IonRow>
            </IonItem>
            {myProfile && (
              <IonItemOptions>
                <IonItemOption
                  style={{
                    backgroundColor: '#2F736F',
                  }}
                  onClick={() => {
                    const gameCopy = { ...game };
                    setNewGame(gameCopy);
                    setEditMode(true);
                  }}
                >
                  <IonIcon slot="icon-only" icon={pencilOutline} />
                </IonItemOption>
                <IonItemOption
                  style={{
                    backgroundColor: '#9BC9C1',
                  }}
                  onClick={() => {
                    gameList.splice(index, 1);
                    userService
                      .removeGame(userId, game.id)
                      .then((res) => {
                        setGameList([...gameList]);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
              </IonItemOptions>
            )}
          </IonItemSliding>
        ))}
        {myProfile && (
          <div className="game-schedule-add-container">
            <div className="game-schedule-add-container-btn">
              <div style={{ backgroundColor: '#00D6B6' }}>
                <IonIcon
                  style={{
                    position: 'relative',
                    top: '1px',
                    color: 'white',
                    width: '17px',
                    height: '17px',
                  }}
                  icon={add}
                ></IonIcon>
              </div>
              <div
                id="open-add-game-modal"
                style={{ textAlign: 'end', paddingLeft: '10px' }}
              >
                <IonLabel style={{ color: '#00D6B6' }}>
                  <h3>Add Game</h3>
                </IonLabel>
              </div>
            </div>
          </div>
        )}
        <IonModal
          isOpen={editMode}
          className="new-deal-modal"
          ref={gameModal}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
          trigger="open-add-game-modal"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar
              style={{
                '--background': 'white',
                padding: '10px 5px',
                marginTop: '40px',
              }}
            >
              <IonButtons slot="start">
                <IonButton
                  style={{ '--color': '#9BC9C1' }}
                  onClick={() => gameModal.current?.dismiss()}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle>{editMode ? 'Game' : 'New Game'}</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  style={{
                    fontSize: '14px',
                    '--padding-end': '15px',
                    '--padding-start': '15px',
                  }}
                  fill="solid"
                  strong={true}
                  onClick={() => confirm()}
                  disabled={!validate()}
                >
                  {editMode ? 'Update' : 'Add to List'}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent scrollY={true}>
            <IonList className="deal-list">
              <IonItem
                style={{ fontSize: '12px', '--background-activated': '#fff' }}
                lines="full"
              >
                <IonLabel position="stacked">Date</IonLabel>
                <IonRow
                  style={{
                    width: '100%',
                    marginBottom: '10px',
                    paddingTop: '5px',
                  }}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <IonCol size="9">{getGameDay(newGame.date)}</IonCol>
                  <IonCol size="3">{getTimeHour(newGame.date)}</IonCol>
                </IonRow>
                {showCalendar && (
                  <IonRow>
                    <IonDatetime
                      style={{ '--background': '#ffffff', marginLeft: '-10px' }}
                      id="game-calendar"
                      onIonChange={(ev) =>
                        setNewGame({ ...newGame, date: ev.detail.value || '' })
                      }
                      value={newGame.date}
                    ></IonDatetime>
                    <IonButton onClick={() => setShowCalendar(!showCalendar)}>
                      <IonIcon
                        style={{ paddingTop: '1px' }}
                        icon={close}
                      ></IonIcon>
                      Close
                    </IonButton>
                  </IonRow>
                )}
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Game Name</IonLabel>
                <IonItem
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={newGame.name}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidGameName(true);
                      } else {
                        setValidGameName(false);
                      }
                      setNewGame({ ...newGame, name: value });
                    }}
                    placeholder="Game Type"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Opponent</IonLabel>
                <IonItem
                  // className={validGameOpponent ? '' : ' invalid'}
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={newGame.opponent}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidGameOpponent(true);
                      } else {
                        setValidGameOpponent(false);
                      }
                      setNewGame({ ...newGame, opponent: value });
                    }}
                    placeholder="Opponent"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Location</IonLabel>
                <IonItem
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={newGame.location}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      setNewGame({
                        ...newGame,
                        location: value,
                      });
                    }}
                    placeholder="Location"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Description</IonLabel>
                <IonItem
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={newGame.description}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      setNewGame({
                        ...newGame,
                        description: value,
                      });
                    }}
                    placeholder="Description"
                  />
                </IonItem>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </div>
  );
};

export default GameScheduleSection;
