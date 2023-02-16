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
  IonIcon,
  IonItemOptions,
  useIonViewWillEnter,
} from '@ionic/react';
import './NILDealsSection.scss';
import { useHistory } from 'react-router-dom';
import { OverlayEventDetail } from '@ionic/core/components';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { UserService } from '../../services/UserService';
import { useState, useRef, useEffect } from 'react';

import {
  linkOutline,
  chevronDownOutline,
  chevronUpOutline,
  trashOutline,
  pencilOutline,
  add,
} from 'ionicons/icons';

interface NILDealsSectionProps {
  data: { title: string };
  className: string;
  myProfile: boolean;
  userId: number;
  userType: string;
}

interface NILDeal {
  dealName: string;
  dealSourceLink?: string;
  dealDescription?: string;
  id: number;
}

const NILDealsSection: React.FC<NILDealsSectionProps> = ({
  data,
  userId,
  className,
  myProfile,
  userType,
}) => {
  const history = useHistory();
  const dealModal = useRef<HTMLIonModalElement>(null);
  const [editMode, setEditMode] = useState(false);
  const dealInput = useRef<HTMLIonInputElement>(null);
  const [openDetails, setOpenDetails] = useState<any[]>([]);
  const [newDeals, setNewDeals] = useState<NILDeal[]>([]);
  const [singleNewDeal, setSingleNewDeal] = useState<NILDeal>({
    dealName: '',
    dealSourceLink: '',
    dealDescription: '',
    id: 0,
  });
  const [validDealName, setValidDealName] = useState(false);
  const [validDealSourceLink, setValidDealSourceLink] = useState(true);
  const [validDealDescription, setValidDealDescription] = useState(true);
  const userService = new UserService();

  const toggleOpenDetails = (dealIndex: number) => {
    if (openDetails.includes(dealIndex)) {
      setOpenDetails(openDetails.filter((index) => index !== dealIndex));
    } else {
      let newOpenDetails = [...openDetails];
      newOpenDetails.push(dealIndex);
      setOpenDetails(newOpenDetails);
    }
  };

  const confirm = () => {
    if (editMode) {
      const slider: any = document.querySelector('ion-item-sliding');
      slider.closeOpened();
      userService
        .updateNilDeal(userId, singleNewDeal.id, singleNewDeal)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setNewDeals([...newDeals, singleNewDeal]);
      userService
        .saveNilDeals(userId, singleNewDeal)
        .then((res) => {
          console.log('This is the updated deal: ', res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    userService
      .getNILDeals(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewDeals(dataCopy);
        setSingleNewDeal({
          dealName: '',
          dealSourceLink: '',
          dealDescription: '',
          id: 0,
        });
        setValidDealName(false);
        dealModal.current?.dismiss(dealInput.current?.value, 'confirm');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    const slider: any = document.querySelector('ion-item-sliding');
    slider.closeOpened();
    userService
      .getNILDeals(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewDeals(dataCopy);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validate = () => {
    if (validDealSourceLink && validDealDescription && validDealName) {
      return true;
    } else if (singleNewDeal.dealName.length !== 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log('Entered NILDealsSection');
    userService
      .getNILDeals(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewDeals(dataCopy);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      id="nobo-nil-deals-section"
      className={'nobo-nil-deals-section ' + className}
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
          {newDeals.map((deal, index) => (
            <IonItemSliding>
              <IonItem lines="none">
                <div
                  key={deal.dealName}
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
                        fontSize: '12px',
                      }}
                    >
                      <IonLabel
                        onClick={(e) =>
                          deal.dealSourceLink &&
                          InAppBrowser.create(
                            deal.dealSourceLink!,
                            '_blank',
                            'location=yes'
                          )
                        }
                        style={{ color: '#00D6B6' }}
                      >
                        <span className="capatilze-first-letter">
                          {deal.dealName}
                        </span>
                      </IonLabel>
                      <div
                        style={{
                          paddingLeft: '5px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {deal.dealSourceLink && (
                          <IonIcon
                            onClick={(e) =>
                              deal.dealSourceLink &&
                              InAppBrowser.create(
                                deal.dealSourceLink!,
                                '_blank',
                                'location=yes'
                              )
                            }
                            style={{
                              transform: 'rotate(135deg)',
                              color: '#00D6B6',
                            }}
                            icon={linkOutline}
                          ></IonIcon>
                        )}
                      </div>
                    </div>
                    {deal.dealDescription && (
                      <div
                        onClick={() => toggleOpenDetails(index)}
                        style={{ alignItems: 'center', display: 'flex' }}
                      >
                        <IonLabel color={'secondary'}>
                          <h3 style={{ fontSize: '12px' }}>Details</h3>
                        </IonLabel>
                        <div
                          style={{
                            position: 'relative',
                            top: '1px',
                            paddingLeft: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '12px',
                          }}
                        >
                          {openDetails.includes(index) ? (
                            <IonIcon
                              color="secondary"
                              icon={chevronUpOutline}
                            ></IonIcon>
                          ) : (
                            <IonIcon
                              color="secondary"
                              icon={chevronDownOutline}
                            ></IonIcon>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {openDetails.includes(index) && (
                      <div>
                        <p style={{ color: '#9BC9C1', fontSize: '12px' }}>
                          {deal.dealDescription}
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
                      const dealCopy = { ...deal };
                      setSingleNewDeal(dealCopy);
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
                      newDeals.splice(index, 1);
                      userService
                        .removeNilDeal(userId, deal.id)
                        .then((res) => {
                          console.log(res);
                          setNewDeals([...newDeals]);
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
                style={{ display: 'flex', width: '30%', alignItems: 'center' }}
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
                  id="open-new-deal-modal"
                  style={{ textAlign: 'end', paddingLeft: '10px' }}
                >
                  <IonLabel style={{ color: '#00D6B6' }}>
                    <h3>New Deal</h3>
                  </IonLabel>
                </div>
              </div>
            </div>
          )}
        </div>
        <IonModal
          isOpen={editMode}
          className="new-deal-modal"
          ref={dealModal}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
          trigger="open-new-deal-modal"
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
                  onClick={() => dealModal.current?.dismiss()}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle>New Deal</IonTitle>
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
                <IonLabel position="stacked">Deal Name</IonLabel>
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
                    value={singleNewDeal.dealName}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidDealName(true);
                      } else {
                        setValidDealName(false);
                      }
                      setSingleNewDeal({ ...singleNewDeal, dealName: value });
                    }}
                    placeholder="Brand Name"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">
                  Source Link <span className="nobo-optional">Optional</span>
                </IonLabel>

                <IonItem
                  className={validDealSourceLink ? '' : ' invalid'}
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={singleNewDeal.dealSourceLink}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      const target: any = e.target;
                      setValidDealSourceLink(target.nativeInput.validity.valid);
                      setSingleNewDeal({
                        ...singleNewDeal,
                        dealSourceLink: value,
                      });
                    }}
                    type="url"
                    pattern="https?://.+"
                    placeholder="https://www.link.com"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">
                  Description <span className="nobo-optional">Optional</span>
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
                    value={singleNewDeal.dealDescription}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      setSingleNewDeal({
                        ...singleNewDeal,
                        dealDescription: value,
                      });
                    }}
                    placeholder="Location..."
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

export default NILDealsSection;
