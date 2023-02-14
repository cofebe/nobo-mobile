import {
  IonContent,
  IonLabel,
  IonCol,
  IonRow,
  IonModal,
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonInput,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  useIonViewWillEnter,
} from '@ionic/react';
import './NILDealsSection.scss';
import { useHistory } from 'react-router-dom';
import { OverlayEventDetail } from '@ionic/core/components';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { UserService } from '../../services/UserService';
import { IonIcon } from '@ionic/react';
import { useState, useRef, useEffect } from 'react';

import {
  linkOutline,
  chevronDownOutline,
  chevronUpOutline,
  trashOutline,
  pencilOutline,
  add,
} from 'ionicons/icons';

interface PersonalTrainingSectionProps {
  data: { title: string };
  className: string;
  myProfile: boolean;
  userId: number;
  userType: string;
}

interface PersonalTrainer {
  category: string;
  location: string;
  name: string;
  description?: string;
  id: number;
}

const PersonalTrainingSection: React.FC<PersonalTrainingSectionProps> = ({
  data,
  userId,
  className,
  myProfile,
  userType,
}) => {
  const history = useHistory();
  const personalTrainerModal = useRef<HTMLIonModalElement>(null);
  const personalTrainerInput = useRef<HTMLIonInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  //   const [showMore, setShowMore] = useState(false);
  const [openDetails, setOpenDetails] = useState<any[]>([]);
  const [newPersonalTrainers, setNewPersonalTrainers] = useState<
    PersonalTrainer[]
  >([]);
  const [singleNewPersonalTrainer, setSingleNewPersonalTrainer] =
    useState<PersonalTrainer>({
      category: '',
      location: '',
      name: '',
      description: '',
      id: 0,
    });
  const [validName, setValidName] = useState(false);
  const [validCategory, setValidCategory] = useState(false);
  const [validDescription, setValidDescription] = useState(true);
  const [validLocation, setValidLocation] = useState(false);
  const userService = new UserService();

  const toggleOpenDetails = (personalTrainerIndex: number) => {
    if (openDetails.includes(personalTrainerIndex)) {
      setOpenDetails(
        openDetails.filter((index) => index !== personalTrainerIndex)
      );
    } else {
      let newOpenDetails = [...openDetails];
      newOpenDetails.push(personalTrainerIndex);
      setOpenDetails(newOpenDetails);
    }
  };

  const confirm = () => {
    if (editMode) {
      const slider: any = document.querySelector('ion-item-sliding');
      slider.closeOpened();
      userService
        .updatePersonalTrainer(
          userId,
          singleNewPersonalTrainer.id,
          singleNewPersonalTrainer
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setNewPersonalTrainers([
        ...newPersonalTrainers,
        singleNewPersonalTrainer,
      ]);
      userService
        .savePersonalTrainers(userId, singleNewPersonalTrainer)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    userService
      .getPersonalTrainers(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewPersonalTrainers(dataCopy);
        setSingleNewPersonalTrainer({
          category: '',
          location: '',
          name: '',
          description: '',
          id: 0,
        });
        setValidName(false);
        setValidLocation(false);
        setValidCategory(false);
        personalTrainerModal.current?.dismiss(
          personalTrainerInput.current?.value,
          'confirm'
        );
      })
      .catch((err) => {
        console.log(err);
      });
    // setSingleNewPersonalTrainer({
    //   category: '',
    //   location: '',
    //   name: '',
    //   description: '',
    //   id: 0,
    // });
    // setValidName(false);
    // personalTrainerModal.current?.dismiss(
    //   personalTrainerInput.current?.value,
    //   'confirm'
    // );
  };

  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    const slider: any = document.querySelector('ion-item-sliding');
    slider.closeOpened();
    userService
      .getPersonalTrainers(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewPersonalTrainers(dataCopy);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validate = () => {
    if (validCategory && validName && validLocation) {
      return true;
    } else if (
      singleNewPersonalTrainer.category.length !== 0 &&
      singleNewPersonalTrainer.name.length !== 0 &&
      singleNewPersonalTrainer.location.length !== 0
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log('Entered Personal Training Section');
    userService
      .getPersonalTrainers(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewPersonalTrainers(dataCopy);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      id="urp-personal-training-section"
      className={'urp-personal-training-section ' + className}
    >
      <IonContent style={{ fontSize: '10px' }}>
        <div
          style={{
            display: 'flex',
            marginBottom: '10px',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {newPersonalTrainers.map((PersonalTrainer, index) => (
            <IonItemSliding>
              <IonItem lines="none">
                <div
                  key={PersonalTrainer.category}
                  style={{
                    borderBottom: '1px solid lightgrey',
                    width: '100%',
                    padding: '20px 0',
                  }}
                >
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div
                      style={{
                        flex: '7',
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <IonLabel
                        // onClick={(e) =>
                        //   deal.dealSourceLink &&
                        //   InAppBrowser.create(
                        //     deal.dealSourceLink!,
                        //     '_blank',
                        //     'location=yes'
                        //   )
                        // }
                        style={{ color: '#00D6B6' }}
                      >
                        <span style={{ fontWeight: '500', fontSize: '12px' }}>
                          {PersonalTrainer.category}
                        </span>
                      </IonLabel>
                      <div
                        style={{
                          paddingLeft: '10px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <IonLabel>
                          <span style={{ fontSize: '10px' }}>
                            @ {PersonalTrainer.location}
                          </span>
                        </IonLabel>
                      </div>
                    </div>
                    <div
                      onClick={() => toggleOpenDetails(index)}
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <IonLabel>
                        <span
                          style={{
                            fontSize: '10px',
                          }}
                        >
                          {PersonalTrainer.name}
                        </span>
                      </IonLabel>
                      <div
                        style={{
                          paddingLeft: '5px',
                          position: 'relative',
                          top: '2px',
                          //   display: 'flex',
                          //   alignItems: 'center',
                        }}
                      >
                        {openDetails.includes(index) ? (
                          <IonIcon
                            style={{
                              fontSize: '10px',
                            }}
                            color="secondary"
                            icon={chevronUpOutline}
                          ></IonIcon>
                        ) : (
                          <IonIcon
                            style={{
                              fontSize: '10px',
                            }}
                            color="secondary"
                            icon={chevronDownOutline}
                          ></IonIcon>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {openDetails.includes(index) && (
                      <div>
                        <p
                          style={{
                            fontSize: '10px',
                            textAlign: 'end',
                          }}
                        >
                          {PersonalTrainer.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </IonItem>
              {myProfile && (
                <IonItemOptions>
                  <IonItemOption
                    style={{
                      backgroundColor: '#2F736F',
                    }}
                    onClick={() => {
                      const personalTrainerCopy = { ...PersonalTrainer };
                      setSingleNewPersonalTrainer(personalTrainerCopy);
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
                      newPersonalTrainers.splice(index, 1);
                      userService
                        .removePersonalTrainer(userId, PersonalTrainer.id)
                        .then((res) => {
                          console.log(res);
                          setNewPersonalTrainers([...newPersonalTrainers]);
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
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                padding: '20px 0',
              }}
            >
              <div
                style={{ display: 'flex', width: '35%', alignItems: 'center' }}
              >
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
                  id="open-new-personal-trainer-modal"
                  style={{ textAlign: 'end', paddingLeft: '10px' }}
                >
                  <IonLabel style={{ color: '#00D6B6' }}>
                    <h3>New Trainer</h3>
                  </IonLabel>
                </div>
              </div>
            </div>
          )}
        </div>
        <IonModal
          isOpen={editMode}
          className="new-personal-trainer-modal"
          ref={personalTrainerModal}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
          trigger="open-new-personal-trainer-modal"
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
                  onClick={() => personalTrainerModal.current?.dismiss()}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle>New Trainer</IonTitle>
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
                  Add to List
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList className="deal-list">
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Category</IonLabel>
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
                    value={singleNewPersonalTrainer.category}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidCategory(true);
                      } else {
                        setValidCategory(false);
                      }
                      setSingleNewPersonalTrainer({
                        ...singleNewPersonalTrainer,
                        category: value,
                      });
                    }}
                    placeholder="Strength"
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
                    value={singleNewPersonalTrainer.location}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidLocation(true);
                      } else {
                        setValidLocation(false);
                      }
                      setSingleNewPersonalTrainer({
                        ...singleNewPersonalTrainer,
                        location: value,
                      });
                    }}
                    placeholder="Los Angeles"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Name</IonLabel>
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
                    value={singleNewPersonalTrainer.name}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidName(true);
                      } else {
                        setValidName(false);
                      }
                      setSingleNewPersonalTrainer({
                        ...singleNewPersonalTrainer,
                        name: value,
                      });
                    }}
                    placeholder="Full Name"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">
                  Description <span className="urp-optional">Optional</span>
                </IonLabel>
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
                    value={singleNewPersonalTrainer.description}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      setSingleNewPersonalTrainer({
                        ...singleNewPersonalTrainer,
                        description: value,
                      });
                    }}
                    placeholder="Strength and Fitness Trainer"
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

export default PersonalTrainingSection;
