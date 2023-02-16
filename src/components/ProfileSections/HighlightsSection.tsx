import {
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  IonItem,
  IonInput,
  IonList,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonRow,
  IonCol,
  useIonViewWillEnter,
} from '@ionic/react';
import { add, addOutline } from 'ionicons/icons';
import './HighlightsSection.css';
import './HighlightsSection.scss';
import { useHistory } from 'react-router-dom';
import { OverlayEventDetail } from '@ionic/core/components';
import { embedLink } from '../../pages/SignUpAthlete';
import { useState, useRef, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { ellipsisHorizontal } from 'ionicons/icons';
import { AthleteProfile, emptyProfile } from '../../data/athlete-detail';

interface HighlightsSectionProps {
  data: { title: string };
  className: string;
  highlights: any[];
  myProfile: boolean;
  userId: number;
  athleteProfile: AthleteProfile;
  isPremium: boolean;
}

interface Highlight {
  url: string;
}

const validUrlRegex =
  /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

//const playVideo = (url: string) => {
//  // alert(videoPlayer);
//  // VideoPlayer.play('file:///videos/videoplayback.mp4').then(() => {
//  //     console.log('video completed');
//  // }).catch(err => {
//  //     console.log(err);
//  // });
//
//  window.open(url, "_system");
//};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  userId,
  data,
  className,
  highlights = [{ url: 'https://www.youtube.com/embed/NL9VuYMx7k0' }],
  myProfile,
  athleteProfile,
  isPremium,
}) => {
  //console.log("Highlights Section: ", highlights);
  let highlightUrl = '';
  let showHighlight = false;
  const history = useHistory();
  const date = new Date();
  const highlightModal = useRef<HTMLIonModalElement>(null);
  const highlightInput = useRef<HTMLIonInputElement>(null);
  const removeHighlightModal = useRef<HTMLIonModalElement>(null);
  const removeHighlightInput = useRef<HTMLIonInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSingleHighlight, setEditSingleHighlight] = useState<Highlight[]>([
    {
      url: '',
    },
  ]);
  const [addSingleHighlight, setAddSingleHighlight] = useState<Highlight>({
    url: '',
  });
  const [allHighlights, setAllHighlights] = useState<Highlight[]>([]);
  const [validHighlight, setValidHighlight] = useState(true);
  const [highlightToRemove, setHighlightToRemove] = useState<Highlight[]>([
    {
      url: 'https://www.youtube.com/embed/NL9VuYMx7k0',
    },
  ]);
  const [isHovered, setIsHovered] = useState(false);
  const [addHighlightPreview, setAddHighlightPreview] = useState('');
  // const [isPremium, setIsPremium] = useState(false);
  const userService = new UserService();

  useIonViewWillEnter(() => {
    if (userId !== 0 || !userId) {
      userService
        .getProfile(userId)
        .then((res) => {
          res.json().then((data) => {
            // setIsPremium(data.is_premium?.String === 'true');
            if (data.athlete_user_profile.highlights) {
              const newHighlights = data.athlete_user_profile.highlights.map(
                (h: any) => JSON.parse(h)
              );
              setAllHighlights(newHighlights);
            }
            // const newHighlights = data.athlete_user_profile.highlights.map(
            //   (h: any) => JSON.parse(h)
            // );
            // setAllHighlights(newHighlights);
          });
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }
  });

  useEffect(() => {
    if (userId !== 0 || !userId) {
      userService
        .getProfile(userId)
        .then((res) => {
          res.json().then((data) => {
            // setIsPremium(data.is_premium?.String === 'true');
            if (data.athlete_user_profile.highlights) {
              const newHighlights = data.athlete_user_profile.highlights.map(
                (h: any) => JSON.parse(h)
              );
              setAllHighlights(newHighlights);
            }
            // const newHighlights = data.athlete_user_profile.highlights.map(
            //   (h: any) => JSON.parse(h)
            // );
            // setAllHighlights(newHighlights);
          });
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }
  }, [userId]);

  const removeHighlight = (removeHighlight: any) => {
    let experiences = athleteProfile.experiences;
    let stats = athleteProfile.stats;
    const emptyStats = [
      {
        season: `${date.getFullYear() + 1} Season`,
        categories: [],
      },
    ];
    if (
      athleteProfile.stats === undefined ||
      athleteProfile.stats?.length === 0
    ) {
      stats = emptyStats;
    }
    let sportStats = { stats2: stats };
    if (
      JSON.stringify(athleteProfile.experiences) ===
      JSON.stringify([
        {
          startYear: '',
          endYear: '',
          position: '',
          school: '',
          city: '',
          state: '',
        },
      ])
    ) {
      experiences = [];
    } else {
      experiences = athleteProfile.experiences?.map((e) => JSON.parse(e));
    }
    let req = {
      first_name: athleteProfile.firstName,
      last_name: athleteProfile.lastName,
      primary_position: athleteProfile.position,
      class_year: athleteProfile.year,
      weight: athleteProfile.weight,
      height: athleteProfile.height,
      school: athleteProfile.school,
      country: athleteProfile.country,
      state: athleteProfile.state,
      city: athleteProfile.city,
      social_links: athleteProfile.socialLinks?.split(','),
      bio: athleteProfile.data,
      rating: athleteProfile.rating,
      gpa: athleteProfile.gpa,
      sat: athleteProfile.sat,
      act: athleteProfile.act,
      other_sports: athleteProfile.otherSports,
      extra_curriculars: athleteProfile.extraCurriculars,
      athlete_awards: athleteProfile.awards,
      athlete_experiences: experiences,
      highlights: allHighlights.filter((h) => h.url !== removeHighlight[0].url),
      athlete_measurements: athleteProfile.measurements
        ? athleteProfile.measurements
        : {},
      athlete_stats: sportStats,
      athlete_offers: athleteProfile.offers,
    };
    userService
      .updateProfile(req, userId)
      .then((res) => res.json())
      .then((data) => {
        console.log('updateProfile: ', data);
      })
      .catch((err) => {
        console.error('Error:', err);
      });
    userService
      .getProfile(userId)
      .then((res) => {
        res.json().then((data) => {
          console.log('getProfile: ', data);
          // const newHighlights = data.athlete_user_profile.highlights.map(
          //   (h: any) => JSON.parse(h)
          // );
          setAllHighlights(
            allHighlights.filter((h) => h.url !== removeHighlight[0].url)
          );
        });
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  };
  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    setAddHighlightPreview('');
    setAddSingleHighlight({
      url: '',
    });
    userService
      .getProfile(userId)
      .then((res) => {
        res.json().then((data) => {
          if (data.athlete_user_profile.highlights) {
            const newHighlights = data.athlete_user_profile.highlights.map(
              (h: any) => JSON.parse(h)
            );
            setAllHighlights(newHighlights);
            setEditMode(false);
          }
          // const newHighlights = data.athlete_user_profile.highlights.map(
          //   (h: any) => JSON.parse(h)
          // );
          // setAllHighlights(newHighlights);
        });
      })
      .catch((err) => {
        console.error('Error:', err);
      });
    setIsOpen(false);
  };
  const confirm = () => {
    const newAllHighlights = [...allHighlights];
    newAllHighlights.push(addSingleHighlight);
    let experiences = athleteProfile.experiences;
    let stats = athleteProfile.stats;
    const emptyStats = [
      {
        season: `${date.getFullYear() + 1} Season`,
        categories: [],
      },
    ];
    if (
      athleteProfile.stats === undefined ||
      athleteProfile.stats?.length === 0
    ) {
      stats = emptyStats;
    }
    let sportStats = { stats2: stats };
    if (
      JSON.stringify(athleteProfile.experiences) ===
      JSON.stringify([
        {
          startYear: '',
          endYear: '',
          position: '',
          school: '',
          city: '',
          state: '',
        },
      ])
    ) {
      experiences = [];
    } else {
      experiences = athleteProfile.experiences?.map((e) => JSON.parse(e));
    }
    if (editMode) {
      // console.log("This is the edit mode's highlights ", allHighlights);
      // console.log(
      //   "This is the edit mode's editSingleHighlight ",
      //   editSingleHighlight
      // );
      const editedHighlights = newAllHighlights.filter(
        (h) => h.url !== editSingleHighlight[0].url
      );
      console.log('This is the edited highlights ', editedHighlights);
      // setAllHighlights(editedHighlights);
      // console.log('This is the highlights from edit mode ', allHighlights);
      let editReq = {
        first_name: athleteProfile.firstName,
        last_name: athleteProfile.lastName,
        primary_position: athleteProfile.position,
        class_year: athleteProfile.year,
        weight: athleteProfile.weight,
        height: athleteProfile.height,
        school: athleteProfile.school,
        country: athleteProfile.country,
        state: athleteProfile.state,
        city: athleteProfile.city,
        social_links: athleteProfile.socialLinks?.split(','),
        bio: athleteProfile.data,
        rating: athleteProfile.rating,
        gpa: athleteProfile.gpa,
        sat: athleteProfile.sat,
        act: athleteProfile.act,
        other_sports: athleteProfile.otherSports,
        extra_curriculars: athleteProfile.extraCurriculars,
        athlete_awards: athleteProfile.awards,
        athlete_experiences: experiences,
        highlights: editedHighlights,
        athlete_measurements: athleteProfile.measurements
          ? athleteProfile.measurements
          : {},
        athlete_stats: sportStats,
        athlete_offers: athleteProfile.offers,
      };
      console.log('This is the req: ', editReq);
      userService
        .updateProfile(editReq, userId)
        .then((res) => res.json())
        .then((data) => {
          console.log('updateProfile: ', data);
          setEditSingleHighlight([{ url: '' }]);
          setAddSingleHighlight({
            url: '',
          });
        })
        .catch((err) => {
          console.error('Error:', err);
        });
      userService
        .getProfile(userId)
        .then((res) => {
          res.json().then((data) => {
            console.log('getProfile: ', data);
            setAllHighlights(editedHighlights);
            setAddHighlightPreview('');
            setAddSingleHighlight({
              url: '',
            });
          });
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    } else {
      let req = {
        first_name: athleteProfile.firstName,
        last_name: athleteProfile.lastName,
        primary_position: athleteProfile.position,
        class_year: athleteProfile.year,
        weight: athleteProfile.weight,
        height: athleteProfile.height,
        school: athleteProfile.school,
        country: athleteProfile.country,
        state: athleteProfile.state,
        city: athleteProfile.city,
        social_links: athleteProfile.socialLinks?.split(','),
        bio: athleteProfile.data,
        rating: athleteProfile.rating,
        gpa: athleteProfile.gpa,
        sat: athleteProfile.sat,
        act: athleteProfile.act,
        other_sports: athleteProfile.otherSports,
        extra_curriculars: athleteProfile.extraCurriculars,
        athlete_awards: athleteProfile.awards,
        athlete_experiences: experiences,
        highlights: newAllHighlights,
        athlete_measurements: athleteProfile.measurements
          ? athleteProfile.measurements
          : {},
        athlete_stats: sportStats,
        athlete_offers: athleteProfile.offers,
      };
      console.log('This is the req: ', req);
      userService
        .updateProfile(req, userId)
        .then((res) => res.json())
        .then((data) => {
          console.log('updateProfile: ', data);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
      userService
        .getProfile(userId)
        .then((res) => {
          res.json().then((data) => {
            console.log('getProfile: ', data);
            setAllHighlights(allHighlights);
            setAddHighlightPreview('');
          });
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }

    highlightModal.current?.dismiss(highlightInput.current?.value, 'confirm');
  };

  if (highlights.length > 0) {
    let highlight: Highlight = JSON.parse(highlights[0]);
    highlightUrl = highlight.url;
  }

  if (highlightUrl) {
    showHighlight = true;
  }

  if (showHighlight && allHighlights?.length > 0) {
    return (
      <div className={'highlights-section nobo-profile-section-mobile ' + className}>
        <IonContent scrollY={false}>
          <div style={{ paddingBottom: '60px' }}>
            {allHighlights?.map((singleHiglight) => {
              return (
                validUrlRegex.test(singleHiglight.url) && (
                  <>
                    <div
                      className="nobo-highlight-video-container"
                      style={{ marginBottom: '10px' }}
                    >
                      <iframe
                        style={{ pointerEvents: isHovered ? 'none' : 'auto' }}
                        className="nobo-highlight-video"
                        src={embedLink(singleHiglight.url)}
                        title="Highlight video"
                      ></iframe>
                    </div>
                    {myProfile && (
                      <div
                        style={{
                          marginLeft: 'auto',
                          marginRight: 0,
                          width: '10%',
                        }}
                        onClick={() => {
                          setHighlightToRemove([{ url: singleHiglight.url }]);
                          setEditSingleHighlight([{ url: singleHiglight.url }]);
                          setIsOpen(true);
                        }}
                      >
                        <IonIcon icon={ellipsisHorizontal} />
                      </div>
                    )}
                  </>
                )
              );
            })}
          </div>
          {myProfile && isPremium && allHighlights?.length < 3 && (
            <div
              style={{
                display: 'flex',
                position: 'fixed',
                bottom: '0',
                left: '0',
                width: '100%',
                justifyContent: 'flex-end',
                padding: '20px 0',
                backgroundColor: 'white',
              }}
              onMouseEnter={() => {
                setIsHovered(true);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
              }}
            >
              <div
                style={{ display: 'flex', width: '35%', alignItems: 'center' }}
              >
                <div style={{ backgroundColor: '#00D6B6' }}>
                  <IonIcon
                    style={{
                      position: 'relative',
                      top: '2px',
                      color: 'white',
                      zindex: 1000,
                    }}
                    icon={add}
                  ></IonIcon>
                </div>
                <div
                  id="open-new-highlight-modal"
                  style={{ textAlign: 'end', paddingLeft: '10px' }}
                >
                  <IonLabel style={{ color: '#00D6B6' }}>
                    <h3>New Highlight</h3>
                  </IonLabel>
                </div>
              </div>
            </div>
          )}

          <IonModal
            className="highlight-modal"
            ref={highlightModal}
            isOpen={editMode}
            initialBreakpoint={0.9}
            breakpoints={[0, 0.9]}
            trigger="open-new-highlight-modal"
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
                    onClick={() => highlightModal.current?.dismiss()}
                  >
                    Cancel
                  </IonButton>
                </IonButtons>

                <IonTitle>
                  {editMode ? 'Edit Highlight' : 'New Highlight'}
                </IonTitle>
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
                    disabled={!validHighlight || !addHighlightPreview}
                  >
                    {editMode ? 'Update' : 'Add to List'}
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem style={{ fontSize: '12px' }} lines="none">
                  <IonLabel position="stacked">New Highlight</IonLabel>

                  <IonItem
                    className={validHighlight ? '' : ' invalid'}
                    style={{
                      paddingBottom: '20px',
                      width: '90%',
                      fontSize: '12px',
                    }}
                  >
                    <IonInput
                      autoCapitalize="on sentence"
                      spellCheck={true}
                      onIonChange={(e) => {
                        const value = e.detail.value!;
                        setAddHighlightPreview(value);
                        const target: any = e.target;
                        setValidHighlight(target.nativeInput.validity.valid);
                        setAddSingleHighlight({ url: value });
                        // setAllHighlights([
                        //   ...allHighlights,
                        //   {
                        //     url: value,
                        //   },
                        // ]);
                      }}
                      type="url"
                      pattern="https?://.+"
                      placeholder="https://www.link.com"
                    />
                  </IonItem>
                </IonItem>
                <IonItem lines="none">
                  {validUrlRegex.test(addHighlightPreview) && (
                    <div
                      className="nobo-highlight-video-container"
                      style={{ marginBottom: '10px' }}
                    >
                      <iframe
                        className="nobo-highlight-video"
                        src={embedLink(addHighlightPreview)}
                        title="Highlight video"
                      ></iframe>
                    </div>
                  )}
                </IonItem>
              </IonList>
            </IonContent>
          </IonModal>
          <IonModal
            className="remove-highlight-modal"
            ref={removeHighlightModal}
            isOpen={isOpen}
            // trigger="open-remove-highlight-modal"
            onWillDismiss={(ev) => onWillDismiss(ev)}
            initialBreakpoint={0.2}
            breakpoints={[0, 0.2]}
          >
            <IonContent>
              <IonList lines="full">
                <IonItem
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  <IonLabel>
                    <h2>Edit Link</h2>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel
                    onClick={() => {
                      removeHighlight(highlightToRemove);
                      removeHighlightModal.current?.dismiss();
                    }}
                  >
                    <h2 style={{ color: '#FF0101' }}>Delete this Highlight</h2>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonModal>
        </IonContent>
      </div>
    );
  }

  if (!myProfile) {
    return (
      <div className={'highlights-section ' + className}>
        <div className="nobo-highlight-add-media-container">
          <p className="nobo-highlight-add-media-title">
            Uh! Looks like the user hasn't added any highlights yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={'highlights-section ' + className}>
      <div className="nobo-highlight-add-media-container">
        <p className="nobo-highlight-add-media-title">
          Uh! Looks like you haven’t added any highlights to your account yet
        </p>
        <p
          className="nobo-highlight-add-media-text"
          onClick={(e) => {
            e.preventDefault();
            history.push(`edit-athlete/${userId}`);
          }}
        >
          Add Video
        </p>
      </div>
    </div>
  );
};

export default HighlightsSection;
