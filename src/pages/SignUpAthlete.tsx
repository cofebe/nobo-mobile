import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonInput,
  IonAccordionGroup,
  IonAccordion,
  IonGrid,
  IonIcon,
  IonFabButton,
  IonTextarea,
  IonDatetime,
  IonSpinner,
  IonText,
  useIonToast,
  IonPopover,
} from '@ionic/react';
import '../styles.scss';
import './SignUpAthlete.scss';
import './cropper.css';
import SignupAddStatsCategoryModal from '../components/SignupAddStatsCategoryModal';
import { AuthService } from '../services/AuthService';
import { getCountries } from '../data/countries';
import { getStates } from '../data/states';
import { takePicture } from '../components/UrpCam';
import Cropper from 'react-cropper';
import UrpSelect from '../components/Select';
import { getPositions } from '../data/sport-positions';
import { getSchools } from '../data/schools';
import { getUniversities } from '../data/university-full';
import { UserService } from '../services/UserService';
import { UpdateAthleteProfileRequest } from '../data/profile';
import { closeOutline } from 'ionicons/icons';
import { getSportStats } from '../helpers/StatsHelper';
import { normalizeSportGender } from '../util';
import { loadingOptions } from '../util';
import { IKContext, IKUpload } from 'imagekitio-react';
import { environment } from '../environments/environment';
import { Worker, Viewer } from '@react-pdf-viewer/core';

interface Measurables {
  wingspan?: string;
  vertical?: string;
  squat?: string;
  shuttleTime?: string;
  fortyYardDash?: string;
  threeConeDrill?: string;
  threeForthsCourtSprint?: string;
  laneAgilityDrill?: string;
  shuttleRun?: string;
  standingReach?: string;
  blockJump?: string;
  attackJump?: string;
  batSpeed?: string;
  armVelocity?: string;
  exitVelocity?: string;
  sixtyYardDash?: string;
  mileRun?: string;
  powerballToss?: string;
  shotSpeed?: string;
  tenYardSplit?: string;
}

// interface basketballMeasurables {
//   // vertical?: string;
//   threeForthsCourtSprint?: string;
//   laneAgilityDrill?: string;
//   shuttleRun?: string;
// }

// interface baseballMeasurables {
//   batSpeed: string;
//   armVelocity: string;
//   sixtyTime: string;
// }

// interface volleyballMeasurables {
//   standingReach: string;
//   blockJump: string;
//   verticalJump: string;
//   attackJump: string;
// }

// interface softballMeasurables {
//   pitchVelocity: string;
//   battingAverage: string;
//   height: string;
// }

interface Props {
  editMode?: boolean;
}

// social link helper function
function processSocialLinks(slinks: string) {
  let slinkArray = slinks.replace('{', '').replace('}', '')?.split(',');
  let slinkObj = {
    hudl:
      slinkArray.filter(
        (s: string) => s.toLowerCase().indexOf('hudl') > -1
      )[0] || '',
    sports24:
      slinkArray.filter((s: string) => s.toLowerCase().indexOf('24') > -1)[0] ||
      '',
    instagram:
      slinkArray.filter(
        (s: string) => s.toLowerCase().indexOf('gram') > -1
      )[0] || '',
    maxpreps:
      slinkArray.filter(
        (s: string) => s.toLowerCase().indexOf('max') > -1
      )[0] || '',
    rivals:
      slinkArray.filter(
        (s: string) => s.toLowerCase().indexOf('riv') > -1
      )[0] || '',
    tiktok:
      slinkArray.filter(
        (s: string) => s.toLowerCase().indexOf('tik') > -1
      )[0] || '',
    twitter:
      slinkArray.filter(
        (s: string) => s.toLowerCase().indexOf('twit') > -1
      )[0] || '',
  };
  return slinkObj;
}

export function embedLink(origlink: string) {
  const url = new URL(origlink);
  const youtubeEmbedLinkBase = 'https://www.youtube.com/embed/';
  const hudlEmbedLinkBase = 'https://www.hudl.com/embed/video';

  let v = url.searchParams.get('v');

  if (v) {
    return `${youtubeEmbedLinkBase}${v}`;
  } else if (
    origlink.includes('https://www.hudl.com/') &&
    !origlink.includes('embed')
  ) {
    return origlink.replace('https://www.hudl.com/video', hudlEmbedLinkBase);
  } else if (origlink.includes('https://youtu.be')) {
    return (
      youtubeEmbedLinkBase + origlink.substring(origlink.lastIndexOf('/') + 1)
    );
  }

  return origlink;
}

const publicKey =
  environment?.videoLibraryPublicKey || 'public_pqTTDCXhzT8ZmQ4RFQUCQYkKY0s=';
const authenticationEndpoint =
  environment?.videoAuthenticationEndpoint ||
  'https://api.noboplus.com/auth/video';
const urlEndpoint =
  environment?.videoUrlEndpoint || 'https://ik.imagekit.io/nobovideo/';

const SignUpAthlete: React.FC<Props> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const popover = useRef<HTMLIonPopoverElement>(null);
  const schoolPopover = useRef<HTMLIonPopoverElement>(null);
  const date = new Date();
  const [present, dismiss] = useIonToast();
  const [birthdayMonth, setBirthdayMonth] = useState<string>('');
  const [birthdayDay, setBirthdayDay] = useState<string>('');
  const [birthdayYear, setBirthdayYear] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [birtdayDayList, setBirthdayDayList] = useState<any>([]);
  const [progressActive, setProgressActive] = useState(false);
  const [uploadVideoMode, setUploadVideoMode] = useState(false);
  const [videoUploadComplete, setVideoUploadComplete] = useState(false);

  const transcriptsVals = useRef<InternalValues>({
    file: false,
  });

  const videoVals = useRef<InternalValues>({
    file: false,
  });

  const videoUpload = useRef(null);
  const [toggleCropper, setToggleCropper] = useState(false);
  const [toggleCropperBanner, setToggleCropperBanner] = useState(false);

  const transcriptsUpload = useRef(null);
  const formData = new FormData();
  const onTranscriptFileChange = async (fileChangeEvent: any) => {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    transcriptsVals.current.file = fileChangeEvent.target.files[0];
    formData.append(
      'file',
      transcriptsVals?.current.file,
      transcriptsVals.current.file.name
    );
    /*const response =*/ await fetch(
      `http://nobo.cofebe.com:8080/upload/${user.user['user_id']}/transcript`,
      {
        method: 'POST',
        body: formData,
      }
    );
  };
  const onVideoFileChange = async (fileChangeEvent: any) => {
    videoVals.current.file = fileChangeEvent.target.files[0];
  };

  const allSchools: string[] = getSchools(); // + EDIT ADDITION //
  const userService = new UserService();

  const authService = new AuthService();
  const allCountries: string[] = getCountries();
  const allStates: string[] = getStates();
  const allUniversities = getUniversities();

  // Basic Information
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profilePicData, setProfilePicData] = useState(Object);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [bannerPicData, setBannerPicData] = useState(Object);
  const [bannerPicPreview, setBannerPicPreview] = useState('');
  const [primarySport, setPrimarySport] = useState<string>('');
  const [primaryPosition, setPrimaryPosition] = useState<string>('');
  const [classYear, setClassYear] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [socialLinkInstagram, setSocialLinksInstagram] = useState<string>('');
  const [socialLinkInstagramValid, setSocialLinksInstagramValid] =
    useState<boolean>(true);
  const [socialLinkTwitter, setSocialLinksTwitter] = useState<string>('');
  const [socialLinkTwitterValid, setSocialLinksTwitterValid] =
    useState<boolean>(true);
  const [socialLinkTikTok, setSocialLinksTikTok] = useState<string>('');
  const [socialLinkTikTokValid, setSocialLinksTikTokValid] =
    useState<boolean>(true);
  const [socialLinkHudl, setSocialLinksHudl] = useState<string>('');
  const [socialLinkHudlValid, setSocialLinksHudlValid] =
    useState<boolean>(true);
  const [socialLink247Sports, setSocialLinks247Sports] = useState<string>('');
  const [socialLink247SportsValid, setSocialLinks247SportsValid] =
    useState<boolean>(true);
  const [socialLinkRivals, setSocialLinksRivals] = useState<string>('');
  const [socialLinkRivalsValid, setSocialLinksRivalsValid] =
    useState<boolean>(true);
  const [socialLinkMaxPreps, setSocialLinksMaxPreps] = useState<string>('');
  const [socialLinkMaxPrepsValid, setSocialLinksMaxPrepsValid] =
    useState<boolean>(true);

  const [allSocialLinksValid, setAllSocialLinksValid] = useState<boolean>(true);

  const [bio, setBio] = useState<string>('');
  const [yourRating, setYourRating] = useState(0);
  const [gpa, setGpa] = useState<string>();
  const [gpaValid, setGpaValid] = useState<boolean>(true);
  const [sat, setSat] = useState<string>();
  const [satValid, setSatValid] = useState<boolean>(true);
  const [act, setAct] = useState<string>();
  const [actValid, setActValid] = useState<boolean>(true);
  const [otherSports, setOtherSports] = useState<string[]>(['']);
  const [extraCurriculars, setExtraCurriculars] = useState<string[]>([]);
  const [singleAwardDropdownField, setSingleAwardDropdownField] = useState<any>(
    []
  );
  const [awards, setAwards] = useState<any>([
    {
      award: '',
      description: '',
    },
  ]); // Needs to be a object, dropdown of options
  const [previousTeams, setPreviousTeams] = useState<any>([
    {
      startYear: '',
      endYear: '',
      position: '',
      school: '',
      city: '',
      state: '',
    },
  ]);

  // Stats

  const [
    singlePrevTeamPositionDropdownField,
    setSinglePrevTeamPositionDropdownField,
  ] = useState<any>([]);
  const [
    singlePrevTeamStateDropdownField,
    setSinglePrevTeamStateDropdownField,
  ] = useState<any>([]);
  const [numberOfTeamsPlayedFor, setNumberOfTeamsPlayedFor] =
    useState<number>(1);

  // Highlights
  const [highlightLink, setHighlightLink] = useState<string>('');
  const [highlightLinkValid, setHighlightLinkValid] = useState<boolean>(true);
  const [highlightLinkOrUpload, setHighlightLinkOrUpload] =
    useState<string>('link');

  // Stats
  const emptyStats = [
    {
      season: `${date.getFullYear() + 1} Season`,
      categories: [],
    },
  ];
  const statSeasonOptions = [
    {
      label: `${date.getFullYear() + 1} Season`,
      value: `${date.getFullYear() + 1} Season`,
    },
    {
      label: `${date.getFullYear()} Season`,
      value: `${date.getFullYear()} Season`,
    },
    {
      label: `${date.getFullYear() - 1} Season`,
      value: `${date.getFullYear() - 1} Season`,
    },
    {
      label: `${date.getFullYear() - 2} Season`,
      value: `${date.getFullYear() - 2} Season`,
    },
    {
      label: `${date.getFullYear() - 3} Season`,
      value: `${date.getFullYear() - 3} Season`,
    },
    {
      label: `${date.getFullYear() - 4} Season`,
      value: `${date.getFullYear() - 4} Season`,
    },
    {
      label: `${date.getFullYear() - 5} Season`,
      value: `${date.getFullYear() - 5} Season`,
    },
    {
      label: `${date.getFullYear() - 6} Season`,
      value: `${date.getFullYear() - 6} Season`,
    },
    {
      label: `${date.getFullYear() - 7} Season`,
      value: `${date.getFullYear() - 7} Season`,
    },
    {
      label: `${date.getFullYear() - 8} Season`,
      value: `${date.getFullYear() - 8} Season`,
    },
    {
      label: `${date.getFullYear() - 9} Season`,
      value: `${date.getFullYear() - 9} Season`,
    },
    {
      label: `${date.getFullYear() - 10} Season`,
      value: `${date.getFullYear() - 10} Season`,
    },
  ];
  const [stats, setStats] = useState<any[]>(emptyStats);
  const [sportStats, setSportStats] = useState<any>(
    getSportStats(((location.state as string) || '').toString()) || {}
  );

  const [measurables, setMeasurables] = useState<Measurables | undefined>();
  const [invalidStartYearIds, setInvalidStartYearIds] = useState<number[]>([]);
  const [invalidEndYearIds, setInvalidEndYearIds] = useState<number[]>([]);
  const [invalidAwardIds, setInvalidAwardIds] = useState<number[]>([]);

  // Offers
  const [offers, setOffers] = useState<string[]>([]);
  const [offersBubble, setOffersBubble] = useState<string[]>([]);

  const [states, setStates] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [schoolPopoverOpen, setSchoolPopoverOpen] = useState<boolean>(false);
  const [PopoverOpen, setPopoverOpen] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>(
    []
  );
  const [filteredSchools, setFilteredSchools] = useState<string[]>([]);

  // EDIT MODE ADDED //
  const [profile, setProfile] = useState<UpdateAthleteProfileRequest>({
    basic_user_profile: {
      first_name: {
        String: '',
        Valid: false,
      },
      last_name: {
        String: '',
        Valid: false,
      },
      city: {
        String: '',
        Valid: false,
      },
      class_year: {
        String: '',
        Valid: false,
      },
      country: {
        String: '',
        Valid: false,
      },
      end_year: {
        String: '',
        Valid: false,
      },
      start_year: {
        String: '',
        Valid: false,
      },
      state: {
        String: '',
        Valid: false,
      },
      school: {
        String: '',
        Valid: false,
      },
      timezone: {
        String: '',
        Valid: false,
      },
      bio: {
        String: '',
        Valid: false,
      },
      profile_image: {
        String: '',
        Valid: false,
      },
      instagram_handle: {
        String: '',
        Valid: false,
      },
      twitter_handle: {
        String: '',
        Valid: false,
      },
    },
    athlete_user_profile: {
      city: {
        String: '',
        Valid: false,
      },
      class: {
        String: '',
        Valid: false,
      },
      height: {
        String: '',
        Valid: false,
      },
      highlights: {},
      other_sports: {
        String: '',
        Valid: false,
      },
      primary_position: {
        String: '',
        Valid: false,
      },
      primary_sport: {
        String: '',
        Valid: false,
      },
      rating: 0,
      school: {
        String: '',
        Valid: false,
      },
      social_links: {
        String: '',
        Valid: false,
      },
      team: {
        String: '',
        Valid: false,
      },
      weight: {
        String: '',
        Valid: false,
      },
      sat: {
        String: '',
        Valid: false,
      },
      act: {
        String: '',
        Valid: false,
      },
      gpa: {
        String: '',
        Valid: false,
      },
      athlete_awards: [],
      athlete_experiences: [],
    },
  });

  // this when true will show the dropdown menu allowing the user to upload a video as opposed to only entering a link
  const [uploadVideoOptionEnabled /*, setUploadVideoOptionEnabled*/] =
    useState(false);

  const validUrlRegex =
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  let retry = 0;
  let showPDF = false;

  const addStatsModal = useRef<HTMLIonModalElement>(null);
  let [season, setSeason] = useState<any>();

  useIonViewWillEnter(() => {
    const universities = getUniversities();
    setVideoUploadComplete(false);
    setUploadVideoMode(false);
    setProgressActive(false);
    // some initialization code
    setCountries(allCountries);
    setStates(allStates);
    const universitiesArray = universities.map((university) => {
      return university.name;
    });
    setFilteredUniversities(universitiesArray);

    // EDIT MODE ADDITION //
    if (props.editMode) {
      getProfile();
    }
  });

  let storage: any = window.localStorage.getItem('persistedState');
  let user = JSON.parse(storage);
  let pdfURL = `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/transcript/11/db65caea-44d5-4e66-928b-d414e4e89f83/transcript.pdf`;
  console.log(pdfURL);

  // EDIT MODE ADDITION //
  function getUserId() {
    let pathUserID = history.location.pathname.substring(
      history.location.pathname.lastIndexOf('/') + 1
    );
    return parseInt(pathUserID);
  }

  const onError = (err: any) => {
    console.log('Error', err);
    // document?.querySelector('.video-upload-file-progress .progress')?.setAttribute('style',`display:none`);
    setProgressActive(false);
    setUploadVideoMode(false);
  };

  const onSuccess = (res: any) => {
    console.log('Success', res);
    // const target: any = e.target;
    setHighlightLinkValid(true);
    setHighlightLink(res?.url);
    setProgressActive(true);
    setVideoUploadComplete(true);
  };

  const onUploadProgress = (progress: any) => {
    //let containerWidth = document?.querySelector('.video-upload-file-progress')?.clientWidth;
    let loadPercent = (progress?.loaded / progress?.total) * 100;
    // console.log("Progress", progress);
    // console.log(`total${progress?.total}  loaded${progress?.loaded}`);
    console.log(loadPercent);
    document
      ?.querySelector('.video-upload-file-progress .progress')
      ?.setAttribute('style', `width:${Math.round(loadPercent)}%`);
    // document?.querySelector('.video-upload-file-progress')?.setAttribute('style', `opacity:1`);
    // document?.querySelector('.video-upload-file-progress')?.setAttribute('style', `height:50px`);
  };

  const onUploadStart = (evt: any) => {
    //console.log("Start", evt);
    setProgressActive(true);
    setUploadVideoMode(true);
    // document?.querySelector('.video-upload-file-progress .progress')?.setAttribute('style', `display:block`);
  };

  // EDIT MODE ADDITION //
  async function getProfile() {
    console.log('get profile');
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    return await userService
      .getProfile(user.user['user_id'])
      .then((res) => res.json())
      .then((data) => {
        console.log('Profile: ', data);

        let basicInfo = {
          basic_user_profile: {
            first_name: data.basic_user_profile.first_name,
            last_name: data.basic_user_profile.last_name,
            city: data.basic_user_profile.city,
            class_year: data.basic_user_profile.class_year,
            country: data.basic_user_profile.country,
            end_year: data.basic_user_profile.end_year,
            start_year: data.basic_user_profile.start_year,
            state: data.basic_user_profile.state,
            school: data.basic_user_profile.school,
            timezone: data.basic_user_profile.timezone,
            bio: data.basic_user_profile.bio,
            profile_image: data.basic_user_profile.profile_image, // likely needs to be changed to profile_picture to match the database
            instagram_handle: data.basic_user_profile.instagram_handle,
            twitter_handle: data.basic_user_profile.twitter_handle,
          },
          athlete_user_profile: {
            weight: data.athlete_user_profile.weight,
            height: data.athlete_user_profile.height,
            highlights: data.athlete_user_profile.highlights || [],
            primary_position: data.athlete_user_profile.primary_position,
            primary_sport: data.athlete_user_profile.primary_sport,
            rating: data.athlete_user_profile.rating.Int16,
            school: data.athlete_user_profile.school,
            social_links: data.athlete_user_profile.social_links,
            team: data.athlete_user_profile.team,
            class: data.athlete_user_profile.class,
            city: data.basic_user_profile.city,
            other_sports: data.athlete_user_profile.other_sports,
            sat: data.athlete_user_profile.sat,
            act: data.athlete_user_profile.act,
            gpa: data.athlete_user_profile.gpa,
            extra_curriculars: data.athlete_user_profile.extra_curriculars,
            offers: data.athlete_user_profile.athlete_offers,
            measurables: data.athlete_user_profile.athlete_measurements,
            stats: data.athlete_user_profile.athlete_stats,
            athlete_awards: data.athlete_user_profile.athlete_awards,
            athlete_experiences: data.athlete_user_profile.athlete_experiences,
          },
        };
        setProfile(basicInfo);
        // BRING IN ALL SAVED DATA AND SAVE IT TO THE STATE VARIABLES!!!
        setFirstName(basicInfo?.basic_user_profile?.first_name?.String);
        setLastName(basicInfo?.basic_user_profile?.last_name?.String);
        // TODO: images (url should be from config)
        let pathUserId = getUserId();
        setProfilePicPreview(
          data.basic_user_profile.profile_image?.String ||
            `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/pictures/${pathUserId}/profile.jpeg?fail`
        );
        setBannerPicPreview(
          data.basic_user_profile.banner_image?.String ||
            `https://cofebe-upload-files.s3.us-west-2.amazonaws.com/pictures/${pathUserId}/banner.jpeg?fail`
        );
        setCity(basicInfo?.basic_user_profile?.city?.String);
        setClassYear(basicInfo?.basic_user_profile?.class_year?.String);
        setCountry(
          basicInfo?.basic_user_profile?.country?.String.replaceAll(`"`, '')
        );
        setState(
          basicInfo?.basic_user_profile?.state?.String.replaceAll(`"`, '')
        );
        setSchool(basicInfo?.basic_user_profile?.school?.String);
        setProfilePicData(basicInfo?.basic_user_profile?.profile_image);

        setWeight(basicInfo?.athlete_user_profile?.weight?.String);
        setHeight(basicInfo?.athlete_user_profile?.height?.String);
        setHighlightLink(
          JSON.parse(basicInfo?.athlete_user_profile?.highlights).url
        );
        setPrimarySport(basicInfo?.athlete_user_profile?.primary_sport?.String);
        setPrimaryPosition(
          basicInfo?.athlete_user_profile?.primary_position?.String.replaceAll(
            `"`,
            ''
          )
        );
        basicInfo?.athlete_user_profile?.primary_sport?.String &&
          setSportStats(
            getSportStats(
              basicInfo?.athlete_user_profile?.primary_sport?.String
            )
          );
        let athleteAwards = basicInfo?.athlete_user_profile?.athlete_awards.map(
          (e: string) => {
            return JSON.parse(e);
          }
        );
        setAwards(athleteAwards);

        setBio(basicInfo?.basic_user_profile?.bio?.String);
        setRating(basicInfo?.athlete_user_profile?.rating);
        setGpa(basicInfo?.athlete_user_profile?.gpa?.String);
        setSat(basicInfo?.athlete_user_profile?.sat?.String);
        setAct(basicInfo?.athlete_user_profile?.act?.String);
        setExtraCurriculars(basicInfo?.athlete_user_profile?.extra_curriculars);
        setOtherSports(basicInfo?.athlete_user_profile?.other_sports);

        // process social links
        let slinksResult = processSocialLinks(
          basicInfo?.athlete_user_profile?.social_links?.String
        );
        setSocialLinksHudl(slinksResult.hudl);
        setSocialLinks247Sports(slinksResult.sports24);
        setSocialLinksInstagram(slinksResult.instagram);
        setSocialLinksMaxPreps(slinksResult.maxpreps);
        setSocialLinksRivals(slinksResult.rivals);
        setSocialLinksTikTok(slinksResult.tiktok);
        setSocialLinksTwitter(slinksResult.twitter);

        setOffers(basicInfo?.athlete_user_profile?.offers);

        if (
          basicInfo?.athlete_user_profile?.athlete_experiences === undefined
        ) {
          setPreviousTeams([
            {
              startYear: '',
              endYear: '',
              position: '',
              school: '',
              city: '',
              state: '',
            },
          ]);
        } else {
          let athleteExperiences =
            basicInfo?.athlete_user_profile?.athlete_experiences.map(
              (e: string) => {
                return JSON.parse(e);
              }
            );
          setPreviousTeams(athleteExperiences);
        }

        if (basicInfo?.athlete_user_profile?.stats === undefined) {
          setStats(emptyStats);
        } else {
          setStats(
            basicInfo?.athlete_user_profile?.stats?.stats2 || emptyStats
          );
        }

        setMeasurables(basicInfo?.athlete_user_profile?.measurables);
        return data;
      });
  }

  const [totalProgressItemCount /*, setTotalProgressItemCount*/] = useState(7);
  const [progressPercentage, setProgressPercentage] = useState('');
  const [progressStep, setProgressStep] = useState({
    step: 1,
    section: 'Basic Info',
  });
  useEffect(() => {
    // this area handles the progress bars
    // NOTE: sections are listed in descending order
    // so that the completion checks cascade downward toward the most basic
    // step, aka "Basic Info" in the correct order
    if (props.editMode) {
      // don't update / run progress bar calculations
    } else {
      // update / run progress bar calculations
      setProgressStep({ step: 7, section: 'Complete' });

      if (
        false //offers.length === 0
      ) {
        setProgressStep({ step: 7, section: 'Transcripts Upload' });
      }

      if (offers.length === 0) {
        setProgressStep({ step: 6, section: 'Offers' });
      }

      if (false) {
        setProgressStep({ step: 5, section: 'Measureables' });
      }

      if (highlightLink === '') {
        setProgressStep({ step: 4, section: 'Player Highlights' });
      }

      if (
        bio === '' ||
        gpa === '' ||
        sat === '' ||
        act === '' ||
        extraCurriculars.length === 0
      ) {
        setProgressStep({ step: 3, section: 'Background' });
      }

      if (
        false // dissabled
      ) {
        setProgressStep({ step: 2, section: 'Stats' });
      }

      if (
        firstName === '' ||
        lastName === '' ||
        !profilePicData?.base64String ||
        !bannerPicData?.base64String
      ) {
        setProgressStep({ step: 1, section: 'Basic Info' });
      }
      let perc =
        Math.round((progressStep.step / totalProgressItemCount) * 100) + '%';

      if (progressStep.step === totalProgressItemCount) {
        perc = '100%';
      }
      setProgressPercentage(perc);
    }
  }, [
    firstName,
    lastName,
    profilePicData,
    bannerPicData,
    bio,
    gpa,
    sat,
    act,
    extraCurriculars?.length,
    highlightLink,
    offers?.length,
  ]);

  useEffect(() => {
    //check if all social links are valid
    if (
      !socialLink247SportsValid ||
      !socialLinkHudlValid ||
      !socialLinkInstagramValid ||
      !socialLinkMaxPrepsValid ||
      !socialLinkRivalsValid ||
      !socialLinkTikTokValid ||
      !socialLinkTwitterValid
    ) {
      setAllSocialLinksValid(false);
    } else {
      setAllSocialLinksValid(true);
    }
  }, [
    socialLink247SportsValid,
    socialLinkHudlValid,
    socialLinkInstagramValid,
    socialLinkMaxPrepsValid,
    socialLinkRivalsValid,
    socialLinkTikTokValid,
    socialLinkTwitterValid,
  ]);

  // useEffect(() => {

  // }, [statsCategoryDropdownField]);

  async function uploadProfilePic() {
    let ppData = await takePicture({ quality: 90, active: true });
    setProfilePicData(ppData);
    setToggleCropper(true);
  }

  async function closeProfilePicCropper() {
    setToggleCropper(false);
  }

  async function closeBannerPicCropper() {
    setToggleCropperBanner(false);
  }

  async function executeProfilePicCrop() {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      let canvas = cropper.getCroppedCanvas({ maxWidth: 800, maxHeight: 800 });
      canvas.toBlob(function (blob: any) {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          // attempt to shrink image
          let tempImage: any = new Image();
          tempImage.src = reader.result;
          setTimeout(() => {
            let maxWidth = 400;
            let maxHeight = 300;
            let height = tempImage.height;
            let width = tempImage.width;
            if (height > maxHeight) {
              width = width / (height / maxHeight);
              height = maxHeight;
            }
            if (width > maxHeight) {
              height = height / (width / maxWidth);
              width = maxWidth;
            }
            let c = document.createElement('canvas');
            c.width = width;
            c.height = height;
            let ctx = c.getContext('2d');
            ctx?.drawImage(tempImage, 0, 0, width, height);

            let b64str = c.toDataURL('image/jpeg');
            let base64data = b64str; //(reader.result || "").toString();

            setProfilePicData({
              ...profilePicData,
              format: 'png',
              base64String: base64data.split(',')[1],
            });
            setProfilePicPreview(base64data);
          }, 500);
        };
      });
    }
    setToggleCropper(false);
  }

  async function executeBannerPicCrop() {
    const imageElement: any = cropperRefBanner?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      let canvas = cropper.getCroppedCanvas({ maxWidth: 800, maxHeight: 800 });
      canvas.toBlob(function (blob: any) {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          // attempt to shrink image
          let tempImage: any = new Image();
          tempImage.src = reader.result;
          setTimeout(() => {
            let maxWidth = 500;
            let maxHeight = 400;
            let height = tempImage.height;
            let width = tempImage.width;
            if (height > maxHeight) {
              width = width / (height / maxHeight);
              height = maxHeight;
            }
            if (width > maxHeight) {
              height = height / (width / maxWidth);
              width = maxWidth;
            }
            let c = document.createElement('canvas');
            c.width = width;
            c.height = height;
            let ctx = c.getContext('2d');
            ctx?.drawImage(tempImage, 0, 0, width, height);

            let b64str = c.toDataURL('image/jpeg');
            let base64data = b64str; // (reader.result || "").toString();
            setBannerPicData({
              ...bannerPicData,
              format: 'png',
              base64String: base64data.split(',')[1],
            });
            setBannerPicPreview(base64data);
          }, 500);
        };
      });
    }
    setToggleCropperBanner(false);
  }

  const cropperRef = useRef<HTMLImageElement>(null);
  const onPhotoCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      /*let canvas =*/ cropper.getCroppedCanvas({
        maxWidth: 800,
        maxHeight: 800,
      });
    }
  };

  const cropperRefBanner = useRef<HTMLImageElement>(null);
  const onBannerPhotoCrop = async () => {
    const imageElement: any = cropperRefBanner?.current;
    const cropperBanner: any = imageElement?.cropper;
    if (cropperBanner) {
      /*let canvas =*/ cropperBanner.getCroppedCanvas({
        maxWidth: 800,
        maxHeight: 800,
      });
    }
  };

  async function uploadBannerPic() {
    let bpData = await takePicture({ quality: 90, active: true });
    setBannerPicData(bpData);
    setToggleCropperBanner(true);
  }

  async function uploadTranscripts() {
    console.log('Transcroipt uploads');
  }

  //async function uploadHighlightVideo() {
  //  let vuP = videoUpload.current;
  //  console.log("Highlight video uploading...");
  //}

  interface InternalValues {
    file: any;
  }

  function isSectionActive(section: string) {
    if (section === location.state || section === primarySport) {
      return true;
    }
    return false;
  }

  const validityChecks = [
    [
      gpaValid,
      '• Invalid GPA: The GPA entered is not valid. Please try again. <br/><br/>',
    ],
    [
      satValid,
      '• Invalid SAT: The SAT entered is not valid. Please try again. <br/><br/>',
    ],
    [
      actValid,
      '• Invalid ACT: The ACT entered is not valid. Please try again. <br/><br/>',
    ],

    [
      socialLinkInstagramValid,
      '• Invalid Social Link: The Instagram link entered is not valid. Please try again. <br/><br/>',
    ],
    [
      socialLinkTwitterValid,
      '• Invalid Social Link: The Twitter link entered is not valid. Please try again. <br/><br/>',
    ],
    [
      socialLinkTikTokValid,
      '• Invalid Social Link: The TikTok link entered is not valid. Please try again. <br/><br/>',
    ],
    [
      socialLinkHudlValid,
      '• Invalid Social Link: The Hudl link entered is not valid. Please try again. <br/><br/>',
    ],
    [
      socialLink247SportsValid,
      '• Invalid Social Link: The 247Sports link entered is not valid. Please try again. <br/><br/>',
    ],
    [
      socialLinkRivalsValid,
      '• Invalid Social Link: The Rivals link entered is not valid. Please try again. <br/><br/>',
    ],
    [
      socialLinkMaxPrepsValid,
      '• Invalid Social Link: The MaxPreps link entered is not valid. Please try again. <br/><br/>',
    ],

    [
      highlightLinkValid,
      '• Invalid Highlight Link: The highlight link entered is not valid. Please try again. <br/><br/>',
    ],
  ];

  function validateSignup(request: any) {
    let valid = true;
    let fixTheFollowing = [];
    // basic info
    if ((request?.first_name || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing First Name: Please enter a first name.  <br/><br/>'
      );
    }
    if ((request?.last_name || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Last Name: Please enter a last name.  <br/><br/>'
      );
    }
    if ((request?.primary_position || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Position: Please select a position.  <br/><br/>'
      );
    }
    if ((request?.class || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Class Year: Please select a class year.  <br/><br/>'
      );
    }
    if ((request?.weight || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Weight: Please enter a weight.  <br/><br/>'
      );
    }
    if ((request?.height || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Height: Please enter a height.  <br/><br/>'
      );
    }
    if (!request?.profile_picture?.base64String && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Profile Picture: Please upload a profile picture.   <br/><br/>'
      );
    }
    if (!request?.banner_picture?.base64String && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Banner Picture: Please upload a banner picture.   <br/><br/>'
      );
    }
    if ((request?.school || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing School: Please enter a school.  <br/><br/>'
      );
    }
    if ((request?.country || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Country: Please select a country.  <br/><br/>'
      );
    }
    if ((request?.state || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing State: Please select a state.  <br/><br/>'
      );
    }
    if ((request?.city || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push('• Missing City: Please enter a city.  <br/><br/>');
    }
    if (request?.social_links.length === 0) {
      valid = false;
      fixTheFollowing.push(
        '• Invalid Social Links: The social link entered are not valid. Please try again.   <br/><br/>'
      );
    }

    if ((request?.bio || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push('• Missing Bio: Please enter a bio.  <br/><br/>');
    }

    if (invalidStartYearIds.length > 0) {
      valid = false;
      fixTheFollowing.push(
        '• Invalid Previous Team Start Year: The start year entered for a previous team is not valid. Please try again.   <br/><br/>'
      );
    }

    if (invalidEndYearIds.length > 0) {
      valid = false;
      fixTheFollowing.push(
        '• Invalid Previous Team End Year: The end year entered for a previous team is not valid. Please try again.   <br/><br/>'
      );
    }

    if (invalidAwardIds.length > 0) {
      valid = false;
      fixTheFollowing.push(
        '• Invalid Awards: The awards entered are not valid. Please try again.  <br/><br/>'
      );
    }

    validityChecks.forEach((v) => {
      const [isValid, message] = v;
      if (!isValid) {
        valid = false;
        fixTheFollowing.push(message);
      }
    });

    return { valid, corrections: fixTheFollowing };

    // background

    // player highlights
  }

  async function editAthlete() {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    console.log('UserId: ', user.user['user_id']);

    let awardsString = awards.map((e: any) => {
      return JSON.stringify(e);
    });

    let sportStats = { stats2: stats };

    let req = {
      first_name: firstName
        ? firstName
        : profile.basic_user_profile?.first_name.String,
      last_name: lastName
        ? lastName
        : profile.basic_user_profile?.last_name.String,
      profile_picture: profilePicData
        ? profilePicData
        : profile.basic_user_profile?.profile_image,
      banner_picture: bannerPicData,
      primary_position: primaryPosition
        ? primaryPosition
        : profile.athlete_user_profile?.primary_position.String,
      //   primary_sport: location.state,
      class_year: classYear
        ? classYear
        : profile.basic_user_profile?.class_year.String,
      weight: weight ? weight : profile.athlete_user_profile?.weight.String,
      height: height ? height : profile.athlete_user_profile?.height.String,
      //   birthday: birthday,
      school: school ? school : profile.basic_user_profile?.school.String,
      country: country ? country : profile.basic_user_profile?.country.String,
      state: state ? state : profile.basic_user_profile?.state.String,
      city: city ? city : profile.basic_user_profile?.city.String,
      social_links: allSocialLinksValid
        ? [
            socialLinkInstagram,
            socialLinkTwitter,
            socialLinkTikTok,
            socialLinkHudl,
            socialLink247Sports,
            socialLinkRivals,
            socialLinkMaxPreps,
          ]
        : [],
      bio: bio ? bio : profile.basic_user_profile?.bio.String,
      rating:
        yourRating || yourRating === 0
          ? yourRating
          : profile.athlete_user_profile?.rating,
      gpa: gpa ? gpa : profile.athlete_user_profile?.gpa.String,
      sat: sat ? sat : profile.athlete_user_profile?.sat.String,
      act: act ? act : profile.athlete_user_profile?.act.String,
      other_sports: otherSports
        ? otherSports
        : profile.athlete_user_profile?.other_sports.String,
      extra_curriculars: extraCurriculars,
      athlete_awards: awardsString,
      // awardsArray[0] === "{}"
      //   ? profile.athlete_user_profile?.athlete_awards
      //   : awardsArray,
      athlete_experiences:
        JSON.stringify(previousTeams) ===
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
          ? []
          : previousTeams,
      highlights: [
        { url: highlightLink },
        // { url: sportsLink },
        // { url: rivalsLink },
        // { url: maxPrepsLink },
        // { url: otherLink },
      ],
      athlete_measurements: measurables,
      athlete_stats: sportStats,
      athlete_offers: offers,
    };

    console.log('EditProfile Req: ', req);
    let validationResults = validateSignup(req);
    if (validationResults.valid) {
      console.log('Validation Valid: ', validationResults);
      let spinner = document.querySelectorAll('.nobo-spinner-container');
      spinner[0].classList.add('active');

      userService
        .updateProfile(req, user.user['user_id'])
        .then((res) => res.json())
        .then((data) => {
          console.log('updateProfile: ', data);
          //   authService.setUserData(data);

          setTimeout(() => {
            spinner[0].classList.remove('active');
            history.push('/home/my-athlete-profile');
          }, 1000);
        })
        .catch((err) => {
          console.error('Error:', err);
          if (retry < 3) {
            retry += 1;
            setTimeout(() => {
              console.log('Trying sign up again');
              editAthlete();
            }, 2000);
          } else {
            spinner[0].classList.remove('active');
            showError('Something went wrong. Please try again.');
          }
        });

      if (videoVals.current.file) {
        console.log('sending video file...');
        formData.append(
          'video',
          videoVals?.current.file,
          videoVals.current.file.name
        );
        /*const response =*/ await fetch(
          'http://localhost:8500/fileuploads/video',
          {
            method: 'POST',
            body: formData,
          }
        );
        console.log('sent video file.');
      }

      if (transcriptsVals.current.file) {
        console.log('sending transcript file...');
        formData.append(
          'video',
          videoVals?.current.file,
          videoVals.current.file.name
        );
        /*const response =*/ await fetch(
          'http://localhost:8500/fileuploads/transcripts',
          {
            method: 'POST',
            body: formData,
          }
        );
        console.log('sent transcript file.');
      }
    } else {
      console.log('Validation failed, alerting user: ', validationResults);
      // validation failed
      // TODO: respond to failure
      let correctionSummary = validationResults?.corrections?.join('\r\n');
      // alert("To continue, please correct the following:\r\n" + correctionSummary);
      showError(
        '<div>To continue, please correct the following: <br/><br/>' +
          correctionSummary +
          '<div>'
      );
    }
  }

  async function signUpAthlete() {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    console.log('UserId: ', user.user['user_id']);
    let awardsString = awards.map((e: any) => {
      return JSON.stringify(e);
    });

    let sportStats = { stats2: stats };

    let req = {
      user_id: user.user['user_id'],
      account_type: 'athlete',
      first_name: firstName,
      last_name: lastName,
      profile_picture: profilePicData, //{ base64string: profilePicData.base64String, format: profilePicData.format },
      banner_picture: bannerPicData,
      primary_position: primaryPosition,
      primary_sport: location.state,
      class: classYear,
      weight: weight,
      height: height,
      //birthday: birthday,
      school: school,
      country: country,
      state: state,
      city: city,
      social_links: allSocialLinksValid
        ? [
            socialLinkInstagram,
            socialLinkTwitter,
            socialLinkTikTok,
            socialLinkHudl,
            socialLink247Sports,
            socialLinkRivals,
            socialLinkMaxPreps,
          ]
        : [],
      bio: bio,
      rating: yourRating,
      gpa: gpa,
      sat: sat,
      act: act,
      other_sports: otherSports,
      extra_curriculars: extraCurriculars,
      athlete_awards: awardsString,
      athlete_experiences:
        JSON.stringify(previousTeams) ===
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
          ? []
          : previousTeams,
      highlights: [
        { url: highlightLink },
        // { url: sportsLink },
        // { url: rivalsLink },
        // { url: maxPrepsLink },
        // { url: otherLink },
      ],
      athlete_measurements: measurables,
      athlete_stats: sportStats,
      athlete_offers: offers,
    };

    console.log('SignUpAthlete Req: ', req);
    let validationResults = validateSignup(req);
    if (validationResults.valid) {
      console.log('Validation Valid: ', validationResults);
      let spinner = document.querySelectorAll('.nobo-spinner-container');
      spinner[0].classList.add('active');

      authService
        .signUpAthlete(req, user.user['user_id'])
        .then((res) => res.json())
        .then((data) => {
          console.log('signUpAthlete: ', data);
          authService.setUserData(data);

          setTimeout(() => {
            spinner[0].classList.remove('active');
            history.push('/home/my-athlete-profile');
          }, 1000);
        })
        .catch((err) => {
          console.error('Error:', err);
          if (retry < 3) {
            retry += 1;
            setTimeout(() => {
              console.log('Trying sign up again');
              signUpAthlete();
            }, 2000);
          } else {
            spinner[0].classList.remove('active');
            showError('Something went wrong. Please try again.');
          }
        });

      if (videoVals.current.file) {
        console.log('sending video file...');
        formData.append(
          'video',
          videoVals?.current.file,
          videoVals.current.file.name
        );
        /*const response =*/ await fetch(
          'http://localhost:8500/fileuploads/video',
          {
            method: 'POST',
            body: formData,
          }
        );
        console.log('sent video file.');
      }

      if (transcriptsVals.current.file) {
        console.log('sending transcript file...');
        formData.append(
          'video',
          videoVals?.current.file,
          videoVals.current.file.name
        );
        /*const response =*/ await fetch(
          'http://localhost:8500/fileuploads/transcripts',
          {
            method: 'POST',
            body: formData,
          }
        );
        console.log('sent transcript file.');
      }
    } else {
      console.log('Validation failed, alerting user: ', validationResults);
      // validation failed
      // TODO: respond to failure
      let correctionSummary = validationResults?.corrections?.join('\r\n');
      // alert("To continue, please correct the following:\r\n" + correctionSummary);
      showError(
        '<div>To continue, please correct the following: <br/><br/>' +
          correctionSummary +
          '<div>'
      );
    }
  }

  const btnColor = '#00816D';

  function setRating(num: number) {
    for (let i = 1; i < 6; i++) {
      let element = document.getElementById(`star-${i}`);
      if (element === null) {
        continue;
      }
      if (i <= num) {
        element.classList.add('checked');
      } else {
        element.classList.remove('checked');
      }
    }
    setYourRating(num);
  }

  // TODO: Add error messages
  function showError(errMessage: string) {
    // let errMessage = "Something went wrong. Please try again"

    // console.log("error: ", error)
    // if (errorCode === 1) {
    //     errMessage = "Error Connecting. Please try again."
    // }

    // if (error !== undefined) {
    //     console.log("errorMessage1: ", error)
    //     if (error.status === 409) {
    //         errMessage = "Account already exists with that email. Please click 'Sign In'"
    //     }
    // }
    present({
      buttons: [
        {
          text: 'Dismiss',
          handler: () => dismiss(),
        },
      ],
      message: errMessage,
      // color: errColor,
      duration: 5000,
      onDidDismiss: () => console.log('dismissed'),
      onWillDismiss: () => console.log('will dismiss'),
      cssClass: 'error-message',
    });
  }

  function scollToSection(sectionName: string) {
    console.log('scollToSection');
    let element = document.getElementById(sectionName);

    setTimeout(() => {
      if (element !== null) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const openSchoolPopover = (e: any) => {
    schoolPopover.current!.event = e;
    setSchoolPopoverOpen(true);
  };

  useEffect(() => {
    //get number of days in month conditional on month and year
    let daysInMonth = 0;
    if (birthdayMonth === '2') {
      if (parseInt(birthdayYear) % 4 === 0) {
        daysInMonth = 29;
      } else {
        daysInMonth = 28;
      }
    }
    if (
      birthdayMonth === '4' ||
      birthdayMonth === '6' ||
      birthdayMonth === '9' ||
      birthdayMonth === '11'
    ) {
      daysInMonth = 30;
    }
    if (
      birthdayMonth === '1' ||
      birthdayMonth === '3' ||
      birthdayMonth === '5' ||
      birthdayMonth === '7' ||
      birthdayMonth === '8' ||
      birthdayMonth === '10' ||
      birthdayMonth === '12'
    ) {
      daysInMonth = 31;
    }
    let dayList = [];
    for (let i = 1; i < daysInMonth + 1; i++) {
      dayList.push({
        value: `${i}`,
        label: `${i}`,
      });
    }
    setBirthdayDayList(dayList);
  }, [birthdayMonth, birthdayYear]);

  let birthdayYearList = [];
  for (let i = date.getFullYear(); i > 1904; i--) {
    birthdayYearList.push({
      value: `${i}`,
      label: `${i}`,
    });
  }

  let standingReachList = [];
  for (let i = 4; i < 11; i += 0.1) {
    standingReachList.push({
      value: `${i.toFixed(1)}"`,
      label: `${i.toFixed(1)}"`,
    });
  }

  let blockJumpList = [];
  for (let i = 4; i < 12; i += 0.1) {
    blockJumpList.push({
      value: `${i.toFixed(1)}"`,
      label: `${i.toFixed(1)}"`,
    });
  }

  let attackJumpList = [];
  for (let i = 4; i < 12; i += 0.1) {
    attackJumpList.push({
      value: `${i.toFixed(1)}"`,
      label: `${i.toFixed(1)}"`,
    });
  }

  let weightList = [];
  for (let i = 50; i <= 410; i += 1) {
    weightList.push({ value: `${i}`, label: `${i} lbs` });
  }

  let verticalList = [];
  for (let i = 15.0; i <= 50; i += 0.5) {
    verticalList.push({ value: `${i.toFixed(1)}"`, label: `${i.toFixed(1)}"` });
  }

  let powerballTossList = [];
  for (let i = 15.0; i <= 60; i += 0.5) {
    powerballTossList.push({
      value: `${i.toFixed(1)}ft`,
      label: `${i.toFixed(1)}ft`,
    });
  }

  let shotSpeedList = [];
  for (let i = 60; i <= 130; i += 1) {
    shotSpeedList.push({ value: `${i}`, label: `${i} mph` });
  }

  let tenYardSplitList = [];
  for (let i = 1.0; i <= 5.0; i += 0.1) {
    tenYardSplitList.push({
      value: `${i.toFixed(1)}s`,
      label: `${i.toFixed(1)}s`,
    });
  }

  let fortyYardDashList = [];
  for (let i = 4.1; i <= 6.5; i += 0.01) {
    fortyYardDashList.push({
      value: `${i.toFixed(2)}s`,
      label: `${i.toFixed(2)}s`,
    });
  }

  let threeConeDrillList = [];
  for (let i = 6.0; i <= 8.3; i += 0.01) {
    threeConeDrillList.push({
      value: `${i.toFixed(2)}s`,
      label: `${i.toFixed(2)}s`,
    });
  }

  let threeForthsCourtSprintList = [];
  for (let i = 2.0; i <= 4.0; i += 0.01) {
    threeForthsCourtSprintList.push({
      value: `${i.toFixed(2)}s`,
      label: `${i.toFixed(2)}s`,
    });
  }

  let laneAgilityDrillList = [];
  for (let i = 11.0; i <= 15.0; i += 0.01) {
    laneAgilityDrillList.push({
      value: `${i.toFixed(2)}s`,
      label: `${i.toFixed(2)}s`,
    });
  }

  let shuttleList = [];
  for (let i = 4.3; i <= 5.8; i += 0.01) {
    shuttleList.push({ value: `${i.toFixed(2)}s`, label: `${i.toFixed(2)}s` });
  }

  let heightList = [];
  for (let feet = 3; feet <= 7; feet += 1) {
    for (let inches = 0; inches <= 11; inches += 1) {
      heightList.push({
        value: `${feet}'${inches}"`,
        label: `${feet}'${inches}"`,
      });
    }
  }

  let batSpeedList = [];
  for (let i = 40; i <= 120; i += 1) {
    batSpeedList.push({ value: `${i} mph`, label: `${i} mph` });
  }

  let armVelocityList = [];
  for (let i = 40; i <= 120; i += 1) {
    armVelocityList.push({ value: `${i} mph`, label: `${i} mph` });
  }

  let exitVelocityList = [];
  for (let i = 40; i <= 120; i += 1) {
    exitVelocityList.push({ value: `${i} mph`, label: `${i} mph` });
  }

  let sixtyYardDashList = [];
  for (let i = 6.0; i <= 10.0; i += 0.01) {
    sixtyYardDashList.push({
      value: `${i.toFixed(2)}s`,
      label: `${i.toFixed(2)}s`,
    });
  }

  let mileRunList = [];

  for (let i = 3.5; i <= 12; i += 0.01) {
    mileRunList.push({
      value: `${i.toFixed(2)}`,
      label: `${i.toFixed(2)}`,
    });
  }

  function getStatsCopy() {
    return JSON.parse(JSON.stringify(stats));
  }

  function getAvailableSeasons(currentSeason?: string) {
    const selectedSeasons = stats.map((s) => s.season);
    const availableSeasons = statSeasonOptions.filter(
      (option) =>
        option.value === currentSeason ||
        !selectedSeasons.includes(option.value)
    );
    return availableSeasons;
  }

  return (
    <IonPage
      id="sign-up-athlete-page"
      className="nobo-page sign-up-athlete-page"
    >
      <div className="square-logo-desktop">
        <img src="assets/images/nobo-box-logo.png" alt="logo" />
      </div>
      <div className="header-desktop">
        <div></div>
      </div>
      {toggleCropper && (
        <div className="nobo-image-cropper">
          <span
            onClick={(e) => {
              e.preventDefault();
              closeProfilePicCropper();
            }}
          >
            X
          </span>
          <span className="nobo-crop-header-text" style={{ color: 'FFFFFF' }}>
            Crop your profile photo
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              executeProfilePicCrop();
            }}
          >
            Done
          </span>
          {/* <SwipeIcon></SwipeIcon> */}
          <Cropper
            className="nobo-profile-pic-cropper"
            // src="https://static.clubs.nfl.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/packers/nczkr5s3xzqebndsu9uk.jpg"
            src={`data:image/png;base64,${profilePicData?.base64String}`}
            // CropperJS options
            style={{ height: '100%' }}
            initialAspectRatio={75 / 75}
            guides={false}
            crop={onPhotoCrop}
            // autoCropArea={1}
            dragMode="move"
            ref={cropperRef}
            cropBoxMovable={false}
            cropBoxResizable={false}
            toggleDragModeOnDblclick={false}
            highlight={false}
          />
        </div>
      )}
      {toggleCropperBanner && (
        <div className="nobo-image-cropper">
          <span
            onClick={(e) => {
              e.preventDefault();
              closeBannerPicCropper();
            }}
          >
            X
          </span>
          <span className="nobo-crop-header-text" style={{ color: '#FFFFFF' }}>
            Crop your banner photo
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              executeBannerPicCrop();
            }}
          >
            Done
          </span>
          {/* <SwipeIcon></SwipeIcon> */}
          <Cropper
            className="nobo-banner-pic-cropper"
            // src="https://static.clubs.nfl.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/packers/nczkr5s3xzqebndsu9uk.jpg"
            src={`data:image/png;base64,${bannerPicData?.base64String}`}
            // CropperJS options
            style={{ height: '100%' }}
            initialAspectRatio={375 / 116}
            guides={false}
            crop={onBannerPhotoCrop}
            autoCropArea={1}
            dragMode="move"
            ref={cropperRefBanner}
            cropBoxMovable={false}
            cropBoxResizable={false}
            toggleDragModeOnDblclick={false}
            highlight={false}
          />
        </div>
      )}

      <IonHeader>
        <IonToolbar
          className="toolbar-no-border"
          style={{ paddingTop: props.editMode ? '' : '40px' }}
        >
          {!props.editMode && (
            <div className="nobo-custom-progress-bar">
              <div className="nobo-progress-label">{progressStep.section}</div>
              <div className="nobo-progress-graphic">
                <div style={{ width: progressPercentage }}></div>
              </div>
              <div className="nobo-progress-count">
                {progressStep.step}/{totalProgressItemCount}
              </div>
            </div>
          )}
          <IonButtons
            style={{ marginTop: props.editMode ? '10px' : '40px' }}
            slot="start"
          >
            {!props.editMode && (
              <IonBackButton
                text="&nbsp;  Sign Up"
                className="nobo-nav-text"
              ></IonBackButton>
            )}
            {props.editMode && (
              <IonBackButton
                text="&nbsp;  Edit Athlete Profile"
                className="nobo-nav-text"
              ></IonBackButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id="signup-sections" className="nobo-content-area">
        <div className="nobo-spinner-container">
          <IonSpinner className="nobo-spinner" name="bubbles" />
        </div>
        <IonList>
          <div className="toolbar-desktop">
            <div className="progress-desktop">
              <span className="bar-label-desktop">Basic Information</span>
              <div className="bar-desktop">
                <div
                  className="bar-value-desktop"
                  style={{ width: progressPercentage }}
                ></div>
              </div>
              <span className="bar-steps-desktop">
                {progressStep.step}/{totalProgressItemCount}
              </span>
            </div>
          </div>
          <IonAccordionGroup className="nobo-section-group">
            <div className="nobo-section">
              <IonAccordion id="basic-info" value="basic-info">
                <IonItem
                  lines="none"
                  slot="header"
                  style={{ class: 'item-inner' }}
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('basic-info')}
                >
                  <span className="nobo-step-num">1</span>
                  <h5 className="nobo-section-title required">
                    Basic Information
                  </h5>
                </IonItem>

                <IonList className="nobo-list-input" slot="content">
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      First Name
                    </IonLabel>

                    <IonInput
                      value={firstName}
                      onIonChange={(e) => setFirstName(e.detail.value!)}
                      placeholder="First Name"
                      autocapitalize="on word"
                      autocorrect="on"
                      type="text"
                      required
                    ></IonInput>
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Last Name
                    </IonLabel>

                    <IonInput
                      value={lastName}
                      onIonChange={(e) => setLastName(e.detail.value!)}
                      placeholder="Last Name"
                      autocapitalize="on word"
                      autocorrect="on"
                      type="text"
                      required
                    ></IonInput>
                  </IonItem>
                  <IonItem className="nobo-input" lines="none">
                    <IonRow>
                      <IonCol>
                        <IonLabel
                          className="nobo-signup-label"
                          position="stacked"
                        >
                          Profile Picture
                        </IonLabel>
                        <IonFabButton
                          className="photo-button-container"
                          onClick={(e) => {
                            e.preventDefault();
                            uploadProfilePic();
                          }}
                        >
                          <IonIcon
                            className="transparent-button"
                            src="assets/images/photo-upload.svg"
                          ></IonIcon>
                          {profilePicPreview !== '' && (
                            <div
                              className="nobo-preview-profile-pic"
                              style={{
                                background: `url(${profilePicPreview})`,
                                backgroundSize: 'contain',
                              }}
                            ></div>
                          )}
                        </IonFabButton>
                        <a
                          href="#"
                          className="nobo-upload-photo"
                          onClick={(e) => {
                            e.preventDefault();
                            uploadProfilePic();
                          }}
                        >
                          Upload Photo
                        </a>
                      </IonCol>
                      <IonCol className="profile-text-col">
                        <p className="profile-picture">
                          Profile picture must be in standard format .png, .jpeg
                        </p>
                      </IonCol>
                    </IonRow>
                  </IonItem>
                  <IonItem className="nobo-input" lines="none">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Banner Picture
                    </IonLabel>
                    {bannerPicPreview === '' && (
                      <IonButton
                        onClick={(e) => {
                          e.preventDefault();
                          uploadBannerPic();
                        }}
                        color={btnColor}
                        className="nobo-upload-btn"
                        style={{
                          display: 'block',
                          marginLeft: '0',
                          fontSize: '2em',
                          fontWeight: 'bold',
                          height: '5vh',
                          width: '100%',
                          color: '#00D6B6',
                          padding: '2px',
                          boxShadow: 'none !important',
                        }}
                      >
                        +
                      </IonButton>
                    )}
                    {bannerPicPreview !== '' && (
                      <div
                        className="nobo-banner-pic-previewer"
                        onClick={(e) => {
                          e.preventDefault();
                          uploadBannerPic();
                        }}
                        style={{
                          background: `url(${bannerPicPreview})`,
                          backgroundRepeat: 'no-repeat !important',
                          backgroundSize: 'cover !important',
                        }}
                      ></div>
                    )}
                    <span
                      className="nobo-optional"
                      style={{ paddingTop: 6, paddingLeft: '2px !important' }}
                    >
                      Banner picture must be in standard format .png, .jpeg
                    </span>
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Position
                    </IonLabel>
                    <UrpSelect
                      value={primaryPosition}
                      onChange={(e) => {
                        setPrimaryPosition(e?.length ? e[0] : '');
                      }}
                      placeholder="Select Position"
                      options={getPositions()
                        .filter((p) => {
                          return (
                            p.sport === normalizeSportGender(location.state) ||
                            p.sport === primarySport
                          );
                        })
                        .map((p) => {
                          return {
                            value: p.symbol || p.name,
                            label: p.name + (p.symbol ? ` (${p.symbol})` : ''),
                          };
                        })}
                    />
                  </IonItem>

                  <IonItem
                    lines="none"
                    style={{ '--background-activated': '#fff' }}
                  >
                    <IonGrid style={{ paddingLeft: '0px' }}>
                      <IonRow>
                        <IonCol size="5" style={{ paddingLeft: '0px' }}>
                          <IonItem className="nobo-input" lines="none">
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              Class Year
                            </IonLabel>
                            <UrpSelect
                              value={classYear}
                              onChange={(e) => {
                                setClassYear(e?.length ? e[0] : '');
                              }}
                              placeholder="Class"
                              border={true}
                              className="nobo-select-short"
                              //style={{
                              //  width: "80%",
                              //  marginRight: "10%",
                              //  borderBottom: "1px solid #e3e3e5",
                              //  color: "#9BC9C1",
                              //}}
                              options={[
                                {
                                  value: date.getFullYear().toString(),
                                  label: date.getFullYear().toString(),
                                },
                                {
                                  value: (date.getFullYear() + 1).toString(),
                                  label: (date.getFullYear() + 1).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 2).toString(),
                                  label: (date.getFullYear() + 2).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 3).toString(),
                                  label: (date.getFullYear() + 3).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 4).toString(),
                                  label: (date.getFullYear() + 4).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 5).toString(),
                                  label: (date.getFullYear() + 5).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 6).toString(),
                                  label: (date.getFullYear() + 6).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 7).toString(),
                                  label: (date.getFullYear() + 7).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 8).toString(),
                                  label: (date.getFullYear() + 8).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 9).toString(),
                                  label: (date.getFullYear() + 9).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 10).toString(),
                                  label: (date.getFullYear() + 10).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 11).toString(),
                                  label: (date.getFullYear() + 11).toString(),
                                },
                                {
                                  value: (date.getFullYear() + 12).toString(),
                                  label: (date.getFullYear() + 12).toString(),
                                },
                                { value: 'FR', label: 'Freshman' },
                                { value: 'SO', label: 'Sophmore' },
                                { value: 'JR', label: 'Junior' },
                                { value: 'SR', label: 'Senior' },
                                { value: 'JC', label: 'JUCO' },
                                { value: 'PRO', label: 'PRO' },
                                { value: 'Former', label: 'Former' },
                                { value: 'FA', label: 'Free Agent' },
                                { value: 'Retired', label: 'Retired' },
                                { value: 'GRAD', label: 'GRAD' },
                              ]}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="4" style={{ paddingLeft: '0px' }}>
                          <IonItem className="nobo-input" lines="none">
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              Weight
                            </IonLabel>
                            <UrpSelect
                              value={weight}
                              onChange={(e) => {
                                setWeight(e.length ? e[0] : '');
                              }}
                              placeholder="lbs"
                              border={true}
                              className="nobo-select-short"
                              options={weightList}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="3">
                          <IonItem className="nobo-input" lines="none">
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              Height
                            </IonLabel>
                            <UrpSelect
                              value={height}
                              onChange={(e) => {
                                setHeight(e?.length ? e[0] : '');
                              }}
                              placeholder={`0‘0"`}
                              border={true}
                              options={heightList}
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol style={{ paddingLeft: '0px' }}>
                          <IonLabel
                            className="nobo-signup-label"
                            position="stacked"
                          >
                            Birthday{' '}
                            <span className="disclaimer-text">
                              {' '}
                              Used for informational pnobooses only
                            </span>
                          </IonLabel>
                        </IonCol>
                        <IonCol size="5" style={{ paddingLeft: '0px' }}>
                          <IonItem
                            style={{ marginTop: 0 }}
                            className="nobo-input"
                            lines="none"
                          >
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              Month
                            </IonLabel>
                            <UrpSelect
                              value={birthdayMonth}
                              onChange={(e) => {
                                setBirthdayMonth(e?.length ? e[0] : '');
                              }}
                              placeholder="Month"
                              border={true}
                              className="nobo-select-short"
                              //style={{
                              //  width: "80%",
                              //  marginRight: "10%",
                              //  borderBottom: "1px solid #e3e3e5",
                              //  color: "#9BC9C1",
                              //}}
                              options={[
                                {
                                  value: '1',
                                  label: 'Jan',
                                },
                                {
                                  value: '2',
                                  label: 'Feb',
                                },
                                {
                                  value: '3',
                                  label: 'Mar',
                                },
                                {
                                  value: '4',
                                  label: 'Apr',
                                },
                                {
                                  value: '5',
                                  label: 'May',
                                },
                                {
                                  value: '6',
                                  label: 'Jun',
                                },
                                {
                                  value: '7',
                                  label: 'Jul',
                                },
                                {
                                  value: '8',
                                  label: 'Aug',
                                },
                                {
                                  value: '9',
                                  label: 'Sep',
                                },
                                {
                                  value: '10',
                                  label: 'Oct',
                                },
                                {
                                  value: '11',
                                  label: 'Nov',
                                },
                                {
                                  value: '12',
                                  label: 'Dec',
                                },
                              ]}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="4" style={{ paddingLeft: '0px' }}>
                          <IonItem
                            style={{ marginTop: 0 }}
                            className="nobo-input"
                            lines="none"
                          >
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              Day
                            </IonLabel>
                            <UrpSelect
                              value={birthdayDay}
                              onChange={(e) => {
                                setBirthdayDay(e.length ? e[0] : '');
                              }}
                              placeholder="Day"
                              border={true}
                              className="nobo-select-short"
                              options={birtdayDayList}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="3">
                          <IonItem
                            style={{ marginTop: 0 }}
                            className="nobo-input"
                            lines="none"
                          >
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              Year
                            </IonLabel>
                            <UrpSelect
                              value={birthdayYear}
                              onChange={(e) => {
                                setBirthdayYear(e?.length ? e[0] : '');
                              }}
                              placeholder="Year"
                              border={true}
                              options={birthdayYearList}
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      School / Organization
                    </IonLabel>
                    <IonInput
                      autofocus
                      value={school}
                      onIonChange={(e) => {
                        let count = 0;
                        if (e.detail.value === undefined) return;

                        const inputtedSchool = e.detail.value;
                        const autoCompleteSchools = allSchools.filter(
                          (singleSchool) => {
                            if (
                              count < 5 &&
                              singleSchool
                                .toLowerCase()
                                .includes(inputtedSchool!.toLowerCase())
                            ) {
                              count++;
                              return true;
                            }
                            return false;
                          },
                          { count: 0 }
                        );
                        !autoCompleteSchools.includes(inputtedSchool!) &&
                          openSchoolPopover(e);
                        setFilteredSchools(autoCompleteSchools);
                        setSchool(e.detail.value!);
                      }}
                      placeholder="School1, School2, etc.."
                      type="text"
                      required
                    ></IonInput>
                    <IonPopover
                      size="cover"
                      ref={schoolPopover}
                      isOpen={schoolPopoverOpen}
                      showBackdrop={false}
                      keyboardClose={false}
                      onDidDismiss={() => setSchoolPopoverOpen(false)}
                    >
                      <IonList lines="none">
                        {filteredSchools.map((oneSchool) => (
                          <IonItem
                            onClick={(e) => {
                              setSchool(oneSchool);
                              setSchoolPopoverOpen(false);
                            }}
                            key={oneSchool}
                          >
                            <IonLabel style={{ paddingLeft: '10px' }}>
                              {oneSchool}
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonPopover>
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Country
                    </IonLabel>
                    <UrpSelect
                      value={country}
                      onChange={(e) => setCountry(e?.length ? e[0] : '')}
                      placeholder="Select Country"
                      options={countries.map((c) => {
                        return { value: c, label: c };
                      })}
                    />
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      State
                    </IonLabel>
                    <UrpSelect
                      value={state}
                      onChange={(e) => setState(e?.length ? e[0] : '')}
                      placeholder="Select State"
                      options={states.map((c) => {
                        return { value: c, label: c };
                      })}
                    />
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      City
                    </IonLabel>
                    <IonInput
                      value={city}
                      onIonChange={(e) => setCity(e.detail.value!)}
                      placeholder="Los Angeles"
                      autocapitalize="on word"
                      autocorrect="on"
                      type="text"
                      required
                    ></IonInput>
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Bio
                    </IonLabel>
                    <IonTextarea
                      value={bio}
                      autoGrow={true}
                      onIonChange={(e) => setBio(e.detail.value!)}
                      autocapitalize="on sentence"
                      spellcheck={true}
                      placeholder="Bio"
                      maxlength={600}
                      inputmode="text"
                    ></IonTextarea>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' +
                      (socialLinkInstagramValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Instagram<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLinkInstagram}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinksInstagramValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinksInstagram(e.detail.value!);
                      }}
                      placeholder="https://instagram.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?instagram\.com\/.+"
                    ></IonInput>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' + (socialLinkTwitterValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Twitter<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLinkTwitter}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinksTwitterValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinksTwitter(e.detail.value!);
                      }}
                      placeholder="https://twitter.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?twitter\.com\/.+"
                    ></IonInput>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' + (socialLinkTikTokValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      TikTok<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLinkTikTok}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinksTikTokValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinksTikTok(e.detail.value!);
                      }}
                      placeholder="https://www.tiktok.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?tiktok\.com\/.+"
                    ></IonInput>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' + (socialLinkHudlValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Hudl<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLinkHudl}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinksHudlValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinksHudl(e.detail.value!);
                      }}
                      placeholder="https://www.hudl.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?hudl\.com\/.+"
                    ></IonInput>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' +
                      (socialLink247SportsValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      247Sports<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLink247Sports}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinks247SportsValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinks247Sports(e.detail.value!);
                      }}
                      placeholder="https://247sports.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?247sports\.com\/.+"
                    ></IonInput>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' + (socialLinkRivalsValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Rivals<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLinkRivals}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinksRivalsValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinksRivals(e.detail.value!);
                      }}
                      placeholder="https://n.rivals.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?(n\.)?rivals\.com\/.+"
                    ></IonInput>
                  </IonItem>
                  <IonItem
                    className={
                      'nobo-input' + (socialLinkMaxPrepsValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="nobo-signup-label" position="stacked">
                      MaxPreps<span className="nobo-optional">Optional</span>
                    </IonLabel>
                    <IonInput
                      value={socialLinkMaxPreps}
                      onIonChange={(e) => {
                        const target: any = e.target;
                        setSocialLinksMaxPrepsValid(
                          target.nativeInput.validity.valid
                        );
                        setSocialLinksMaxPreps(e.detail.value!);
                      }}
                      placeholder="https://www.maxpreps.com/"
                      type="url"
                      pattern="http(s)?:\/\/(www\.)?maxpreps\.com\/.+"
                    ></IonInput>
                  </IonItem>
                </IonList>
              </IonAccordion>
            </div>
            <div className="nobo-section">
              <IonAccordion id="stats" value="stats">
                <IonItem
                  lines="none"
                  slot="header"
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('stats')}
                >
                  <span className="nobo-step-num">2</span>
                  <h5 className="nobo-section-title">Stats</h5>
                  <span style={{ fontSize: '0.6em' }} className="nobo-optional">
                    Enter your stats for your primary sport
                  </span>
                </IonItem>

                <IonList
                  className="nobo-list-input stats-section"
                  slot="content"
                >
                  {stats.map((s: any) => {
                    return (
                      <>
                        <IonItem lines="none" className="section-header">
                          <IonGrid>
                            <IonRow>
                              <IonCol size="12">
                                <UrpSelect
                                  value={s.season}
                                  onChange={(e) => {
                                    if (e?.length) {
                                      const statsCopy = getStatsCopy();
                                      const season = statsCopy.find(
                                        (seas: any) => seas.season === s.season
                                      );
                                      if (season) {
                                        season.season = e[0];
                                        setStats(statsCopy);
                                      }
                                    }
                                  }}
                                  placeholder="Season"
                                  options={getAvailableSeasons(s.season)}
                                />
                                <div
                                  className="add-season"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const statsCopy = getStatsCopy();
                                    const availableSeasons =
                                      getAvailableSeasons();
                                    statsCopy.push({
                                      season: availableSeasons[0].value,
                                      categories: [],
                                    });
                                    setStats(statsCopy);
                                  }}
                                >
                                  <img
                                    src="assets/images/create-post.svg"
                                    alt="Add season"
                                  />
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonItem>
                        <IonItem className="stats-season-text" lines="none">
                          <IonGrid>
                            <IonRow>
                              <IonCol size="4" className="header">
                                Category
                              </IonCol>
                              <IonCol size="8" className="subtext">
                                Select a category and all stats that apply for
                                that category
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonItem>

                        {s.categories.map((c: any) => {
                          let section = sportStats.sections.find(
                            (sec: any) => sec.name === c.section
                          );
                          if (!section && sportStats.sections.length === 1) {
                            section = sportStats.sections[0];
                          }
                          if (!section) {
                            console.error('Could not find section', c.section);
                          }
                          const category = section.categories.find(
                            (cat: any) => cat.name === c.category
                          );
                          if (!category) {
                            console.error(
                              'Could not find category',
                              c.category
                            );
                          }

                          return (
                            <>
                              <IonItem className="stats-category">
                                <IonLabel className="stats-category-name">
                                  {category.name}
                                </IonLabel>
                                <IonLabel
                                  className="stats-category-remove"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const statsCopy = getStatsCopy();
                                    const season = statsCopy.find(
                                      (seas: any) => seas.name === s.name
                                    );
                                    if (season) {
                                      season.categories =
                                        season.categories.filter(
                                          (cat: any) =>
                                            cat.category !== c.category
                                        );
                                    }
                                    setStats(statsCopy);
                                  }}
                                  style={{ flex: '0.25' }}
                                >
                                  Remove
                                </IonLabel>
                              </IonItem>
                              <IonItem className="stats-entry" lines="none">
                                <IonGrid>
                                  {category.stats.map((stat: any) => {
                                    return (
                                      <IonRow key={stat.name}>
                                        <IonCol size="9">
                                          <IonLabel className="stats-entry-label">
                                            {stat.name}
                                          </IonLabel>
                                        </IonCol>
                                        <IonCol size="3">
                                          <IonInput
                                            className="stats-entry-input"
                                            inputmode="numeric"
                                            type="number"
                                            min="-99999999"
                                            onIonChange={(e) => {
                                              const statsCopy = getStatsCopy();
                                              const season = statsCopy.find(
                                                (seas: any) =>
                                                  seas.season === s.season
                                              );
                                              if (season) {
                                                const category =
                                                  season.categories.find(
                                                    (cat: any) =>
                                                      cat.category ===
                                                      c.category
                                                  );
                                                if (category) {
                                                  const value = e.detail.value!;
                                                  if (
                                                    value === '' ||
                                                    value === 'NaN' ||
                                                    value === null ||
                                                    value === undefined
                                                  ) {
                                                    category.values[
                                                      stat.fieldName
                                                    ] = undefined;
                                                  } else {
                                                    category.values[
                                                      stat.fieldName
                                                    ] = +value;
                                                  }
                                                  setStats(statsCopy);
                                                }
                                              }
                                            }}
                                            value={c.values[stat.fieldName]}
                                          />
                                        </IonCol>
                                      </IonRow>
                                    );
                                  })}
                                </IonGrid>
                              </IonItem>
                            </>
                          );
                        })}

                        <IonItem lines="none">
                          <IonLabel
                            className="add-category"
                            onClick={(e) => {
                              e.preventDefault();
                              season = s;
                              setSeason(season);
                              addStatsModal.current?.present();
                            }}
                          >
                            <span>Add Another Category</span>
                            <img
                              src="/assets/images/create-post.svg"
                              alt="Add category"
                            />
                          </IonLabel>
                        </IonItem>
                      </>
                    );
                  })}
                </IonList>
              </IonAccordion>
            </div>
            <div className="nobo-section">
              <IonAccordion id="background" value="background">
                <IonItem
                  lines="none"
                  slot="header"
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('background')}
                >
                  <span className="nobo-step-num">3</span>
                  <h5 className="nobo-section-title">Background</h5>
                </IonItem>
                <IonList className="nobo-list-input" slot="content">
                  {/* <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Bio
                    </IonLabel>
                    <IonTextarea
                      value={bio}
                      autoGrow={true}
                      onIonChange={(e) => setBio(e.detail.value!)}
                      autocapitalize="on sentence"
                      spellcheck={true}
                      placeholder="Bio"
                      maxlength={600}
                      inputmode="text"
                    ></IonTextarea>
                  </IonItem> */}
                  {isSectionActive('football') && (
                    <IonItem className="nobo-input" lines="none">
                      <IonLabel
                        className="nobo-signup-label nobo-rating-label"
                        position="stacked"
                      >
                        Your Rating
                      </IonLabel>
                      <IonRow>
                        <IonCol size="7">
                          <div
                            style={{ display: 'block', cursor: 'pointer' }}
                            className="nobo-rating-input"
                          >
                            <span style={{ marginLeft: '0' }}>
                              <svg
                                width="180"
                                height="30"
                                viewBox="0 0 170 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  id="star-1"
                                  className="fa-star"
                                  d="M11 0L13.4697 7.60081H21.4616L14.996 12.2984L17.4656 19.8992L11 15.2016L4.53436 19.8992L7.00402 12.2984L0.538379 7.60081H8.53035L11 0Z"
                                  onClick={(e) => {
                                    setRating(1);
                                  }}
                                />
                                <path
                                  id="star-2"
                                  className="fa-star"
                                  d="M37 0L39.4697 7.60081H47.4616L40.996 12.2984L43.4656 19.8992L37 15.2016L30.5344 19.8992L33.004 12.2984L26.5384 7.60081H34.5303L37 0Z"
                                  onClick={(e) => {
                                    setRating(2);
                                  }}
                                />
                                <path
                                  id="star-3"
                                  className="fa-star"
                                  d="M63 0L65.4697 7.60081H73.4616L66.996 12.2984L69.4656 19.8992L63 15.2016L56.5344 19.8992L59.004 12.2984L52.5384 7.60081H60.5303L63 0Z"
                                  onClick={(e) => {
                                    setRating(3);
                                  }}
                                />
                                <path
                                  id="star-4"
                                  className="fa-star"
                                  d="M89 0L91.4697 7.60081H99.4616L92.996 12.2984L95.4656 19.8992L89 15.2016L82.5344 19.8992L85.004 12.2984L78.5384 7.60081H86.5303L89 0Z"
                                  onClick={(e) => {
                                    setRating(4);
                                  }}
                                />
                                <path
                                  id="star-5"
                                  className="fa-star"
                                  d="M118 0L120.47 7.60081H128.462L121.996 12.2984L124.466 19.8992L118 15.2016L111.534 19.8992L114.004 12.2984L107.538 7.60081H115.53L118 0Z"
                                  onClick={(e) => {
                                    setRating(5);
                                  }}
                                />
                              </svg>
                            </span>
                          </div>
                        </IonCol>
                        <IonCol
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <IonText
                            style={{ paddingTop: '5px' }}
                            className="nobo-optional"
                            onClick={() => {
                              setRating(0);
                            }}
                          >
                            Clear
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItem>
                  )}
                  <IonItem className="nobo-input" lines="none">
                    <IonGrid style={{ paddingLeft: '0px' }}>
                      <IonRow>
                        <IonCol style={{ paddingLeft: '0px' }}>
                          <IonItem
                            className={gpaValid ? '' : ' invalid'}
                            lines="full"
                          >
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              GPA
                            </IonLabel>
                            <IonInput
                              value={gpa}
                              onIonChange={(e) => {
                                const value = e.detail.value!;
                                let isValid = true;
                                if (
                                  value !== null &&
                                  value !== undefined &&
                                  value !== ''
                                ) {
                                  if (!/^[0-9.]{1,3}$/.test(value)) {
                                    isValid = false;
                                  } else {
                                    const v = +value;
                                    if (v < 0.0 || v > 5.0) {
                                      isValid = false;
                                    }
                                  }
                                }
                                console.log(
                                  'value',
                                  value,
                                  typeof value,
                                  isValid
                                );
                                setGpaValid(isValid);
                                setGpa(value);
                              }}
                              placeholder="4.0"
                              type="number"
                              inputmode="decimal"
                              required
                            ></IonInput>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem
                            className={satValid ? '' : ' invalid'}
                            lines="full"
                          >
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              SAT
                            </IonLabel>
                            <IonInput
                              value={sat}
                              onIonChange={(e) => {
                                const value = e.detail.value!;
                                let isValid = true;
                                if (
                                  value !== null &&
                                  value !== undefined &&
                                  value !== ''
                                ) {
                                  if (!/^[0-9]{1,4}$/.test(value)) {
                                    isValid = false;
                                  } else {
                                    const v = +value;
                                    if (v < 400 || v > 1600) {
                                      isValid = false;
                                    }
                                  }
                                }
                                console.log(
                                  'value',
                                  value,
                                  typeof value,
                                  isValid
                                );
                                setSatValid(isValid);
                                setSat(value);
                              }}
                              placeholder="1600"
                              type="number"
                              inputmode="numeric"
                              required
                            ></IonInput>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem
                            className={actValid ? '' : ' invalid'}
                            lines="full"
                          >
                            <IonLabel
                              className="nobo-signup-label"
                              position="stacked"
                            >
                              ACT
                            </IonLabel>
                            <IonInput
                              value={act}
                              onIonChange={(e) => {
                                const value = e.detail.value!;
                                let isValid = true;
                                if (
                                  value !== null &&
                                  value !== undefined &&
                                  value !== ''
                                ) {
                                  if (!/^[0-9]{1,2}$/.test(value)) {
                                    isValid = false;
                                  } else {
                                    const v = +value;
                                    if (v < 1 || v > 36) {
                                      isValid = false;
                                    }
                                  }
                                }
                                console.log(
                                  'value',
                                  value,
                                  typeof value,
                                  isValid
                                );
                                setActValid(isValid);
                                setAct(value);
                              }}
                              placeholder="36"
                              type="number"
                              inputmode="numeric"
                              required
                            ></IonInput>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                  <IonItem className="nobo-input" lines="full">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Extracurriculars
                      <span className="nobo-optional">Seperate with comma</span>
                    </IonLabel>
                    <IonInput
                      placeholder="Student Council"
                      value={extraCurriculars?.join()}
                      autocapitalize="on word"
                      autocorrect="on"
                      type="text"
                      onIonChange={(e) => {
                        if (e?.detail?.value) {
                          setExtraCurriculars(e.detail.value!.split(',') || []);
                        } else {
                          setExtraCurriculars([]);
                        }
                      }}
                      required
                    ></IonInput>
                  </IonItem>
                  <IonItem className="nobo-input" lines="none">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      Additional Sport(s)
                      <span className="nobo-optional">
                        Select all that apply
                      </span>
                    </IonLabel>
                    <UrpSelect
                      placeholder="Select Sport"
                      className="nobo-select"
                      value={otherSports}
                      onChange={(e) => setOtherSports(e)}
                      multiple={true}
                      border={true}
                      options={[
                        { value: 'baseball', label: 'Baseball' },
                        { value: 'basketball', label: 'Basketball' },
                        { value: 'football', label: 'Football' },
                        { value: 'soccer', label: 'Soccer' },
                        { value: 'volleyball', label: 'Volleyball' },
                        { value: 'softball', label: 'Softball' },
                        { value: 'lacrosse', label: 'Lacrosse' },
                      ].filter((o) => {
                        let sport = primarySport || (location.state as string);
                        if (sport) {
                          if (sport[0] === 'w' || sport[0] === 'm') {
                            sport = sport.slice(1);
                          }
                        }
                        return !o.value.includes(sport);
                      })}
                    />
                  </IonItem>
                  {awards.map((element: any, index: any) => {
                    return (
                      <div key={index}>
                        <IonItem className="nobo-input" lines="none">
                          <IonLabel
                            className="nobo-signup-label"
                            position="stacked"
                          >
                            Awards / Recognition
                          </IonLabel>
                          {isSectionActive('football') && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                { value: 'MVP', label: 'MVP' },
                                { value: 'All League', label: 'All League' },
                                { value: 'All County', label: 'All County' },
                                { value: 'All State', label: 'All State' },
                                {
                                  value: 'All American',
                                  label: 'All American',
                                },
                                {
                                  value: 'Comeback Player',
                                  label: 'Comeback Player',
                                },
                                {
                                  value: 'Offensive Player',
                                  label: 'Offensive Player',
                                },
                                {
                                  value: 'Defensive Player',
                                  label: 'Defensive Player',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                          {isSectionActive('softball') && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                {
                                  value: 'All-American Award',
                                  label: 'All-American Award',
                                },
                                {
                                  value: 'All-Region Award',
                                  label: 'All-Region Award',
                                },
                                {
                                  value: 'College player of the Year',
                                  label: 'College player of the Year',
                                },
                                {
                                  value: 'Golden Shoe Award',
                                  label: 'Golden Shoe Award',
                                },
                                {
                                  value: 'Highshool player of the Year',
                                  label: 'Highshool player of the Year',
                                },
                                {
                                  value: 'Pitcher of the Year',
                                  label: 'Pitcher of the Year',
                                },
                                {
                                  value: 'Victory Club',
                                  label: 'Victory Club',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                          {isSectionActive('baseball') && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                { value: 'MVP', label: 'MVP' },
                                {
                                  value: 'College player of the Year',
                                  label: 'College player of the Year',
                                },
                                {
                                  value: 'Highshool player of the year',
                                  label: 'Highshool player of the year',
                                },
                                {
                                  value: 'Minor League Player of the Year',
                                  label: 'Minor League Player of the Year',
                                },
                                {
                                  value: 'All-Star Award',
                                  label: 'All-Star Award',
                                },
                                {
                                  value: 'Pitcher of the Year',
                                  label: 'Pitcher of the Year',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                          {(isSectionActive('msoccer') ||
                            isSectionActive('wsoccer')) && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                {
                                  value: 'Golden Boot',
                                  label: 'Golden Boot',
                                },
                                {
                                  value: 'Golden Ball',
                                  label: 'Golden Ball',
                                },
                                {
                                  value: 'Golden Glove',
                                  label: 'Golden Glove',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                          {(isSectionActive('mbasketball') ||
                            isSectionActive('wbasketball')) && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                {
                                  value: 'All-star Game MVP',
                                  label: 'All-star Game MVP',
                                },
                                {
                                  value: 'Defensive Player of the Year',
                                  label: 'Defensive Player of the Year',
                                },
                                {
                                  value: 'Most Improved Player',
                                  label: 'Most Improved Player',
                                },
                                { value: 'MVP', label: 'MVP' },
                                {
                                  value: 'Rookie of the Year',
                                  label: 'Rookie of the Year',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                          {(isSectionActive('mvolleyball') ||
                            isSectionActive('wvolleyball')) && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                {
                                  value: 'Player of the Year',
                                  label: 'Player of the Year',
                                },
                                {
                                  value: 'Freshman of the Year',
                                  label: 'Freshman of the Year',
                                },
                                {
                                  value: 'Libero of the Year',
                                  label: 'Libero of the Year',
                                },
                                {
                                  value: 'Setter of the Year',
                                  label: 'Setter of the Year',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                          {(isSectionActive('mlacrosse') ||
                            isSectionActive('wlacrosse')) && (
                            <UrpSelect
                              value={awards[index].award}
                              placeholder="Select Award"
                              border={true}
                              onChange={(e) => {
                                const newAwards = [...awards];
                                const event = e?.length ? e[0] : '';
                                if (
                                  event !== '' &&
                                  newAwards[index].description === ''
                                ) {
                                  setInvalidAwardIds([
                                    ...invalidAwardIds,
                                    index,
                                  ]);
                                } else {
                                  setInvalidAwardIds(
                                    invalidAwardIds.filter((id) => id !== index)
                                  );
                                }
                                newAwards[index] = {
                                  ...newAwards[index],
                                  award: e?.length ? e[0] : '',
                                };
                                setAwards(newAwards);
                              }}
                              options={[
                                {
                                  value: 'The Tewaaraton Award',
                                  label: 'The Tewaaraton Award',
                                },
                                {
                                  value: 'F. Morris Touchstone Award',
                                  label: 'F. Morris Touchstone Award',
                                },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                          )}
                        </IonItem>
                        <IonItem
                          className={
                            invalidAwardIds.includes(index) ? 'invalid' : ''
                          }
                          lines="full"
                        >
                          <IonInput
                            value={awards[index].description}
                            placeholder="Year Awarded"
                            type="text"
                            inputmode="numeric"
                            onIonChange={(e) => {
                              const newAwards = [...awards];
                              const event = e.detail.value
                                ? e.detail.value
                                : '';
                              if (
                                newAwards[index].award !== '' &&
                                event === ''
                              ) {
                                setInvalidAwardIds([...invalidAwardIds, index]);
                                //regex to check if string is less than 4 characters and contains no symbols
                              } else {
                                setInvalidAwardIds(
                                  invalidAwardIds.filter((id) => id !== index)
                                );
                              }
                              newAwards[index] = {
                                ...newAwards[index],
                                description: e.detail.value,
                              };
                              setAwards(newAwards);
                            }}
                          ></IonInput>
                        </IonItem>
                      </div>
                    );
                  })}
                  <IonRow>
                    <IonCol size="4">
                      {awards.length > 1 ? (
                        <IonLabel
                          style={{ color: '#9BC9C2', fontWeight: 'bold' }}
                          onClick={(e) => {
                            setSingleAwardDropdownField([
                              ...singleAwardDropdownField.slice(0, -1),
                            ]);
                            setAwards([...awards.slice(0, awards.length - 1)]);
                            setInvalidAwardIds(
                              invalidAwardIds.filter(
                                (id) => id !== awards.length - 1
                              )
                            );
                            // setNumberOfAwards(numberOfAwards - 1);

                            const elem: any = e.target;
                            setTimeout(() => {
                              elem.scrollIntoView({
                                block: 'end',
                                inline: 'nearest',
                              });
                            }, 100);
                          }}
                        >
                          Remove
                        </IonLabel>
                      ) : (
                        <IonLabel></IonLabel>
                      )}
                    </IonCol>
                    <IonCol size="4" offset="4">
                      <IonLabel
                        style={{ color: '#2F736F', fontWeight: 'bold' }}
                        onClick={(e) => {
                          setSingleAwardDropdownField([
                            ...singleAwardDropdownField,
                            '',
                          ]);
                          const newAwards = [...awards];
                          newAwards.push({
                            award: '',
                            description: '',
                          });
                          setAwards(newAwards);

                          const elem: any = e.target;
                          setTimeout(() => {
                            elem.scrollIntoView({
                              block: 'end',
                              inline: 'nearest',
                            });
                          }, 100);
                        }}
                      >
                        + Add More
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  {previousTeams.map((element: any, index: any) => {
                    return (
                      <div key={index}>
                        <IonItem className="nobo-input" lines="full">
                          <IonLabel
                            className="nobo-signup-label"
                            position="stacked"
                          >
                            Previous Team
                          </IonLabel>
                          <IonInput
                            placeholder="Varsity, JV, Pop Warner, 7v7, etc."
                            value={previousTeams[index].team}
                            autocapitalize="on word"
                            autocorrect="on"
                            type="text"
                            onIonChange={(e) => {
                              const newPreviousTeams = [...previousTeams];
                              newPreviousTeams[index] = {
                                ...newPreviousTeams[index],
                                team: e.detail.value,
                              };
                              setPreviousTeams(newPreviousTeams);
                              // setSinglePreviousTeam({
                              //   ...singlePreviousTeam,
                              //   team: e.detail.value,
                              // });
                            }}
                            // required
                          ></IonInput>
                        </IonItem>
                        <IonItem className="nobo-input" lines="none">
                          <IonGrid style={{ paddingLeft: '0px' }}>
                            <IonRow>
                              <IonCol style={{ paddingLeft: '0px' }}>
                                <IonItem
                                  className={
                                    invalidStartYearIds.includes(index)
                                      ? 'invalid'
                                      : ''
                                  }
                                  lines="full"
                                >
                                  <IonLabel
                                    className="nobo-signup-label"
                                    position="stacked"
                                  >
                                    Start Year
                                  </IonLabel>
                                  <IonInput
                                    inputmode="numeric"
                                    placeholder="YYYY"
                                    type="text"
                                    value={previousTeams[index].startYear}
                                    onIonChange={(e) => {
                                      const value = e.detail.value!;
                                      let lastPreviousTeamEndYear =
                                        previousTeams[index - 1]?.endYear;
                                      if (
                                        value !== null &&
                                        value !== undefined &&
                                        value !== ''
                                      ) {
                                        if (!/^[0-9]{4}$/.test(value)) {
                                          setInvalidStartYearIds([
                                            ...invalidStartYearIds,
                                            index,
                                          ]);
                                        } else if (
                                          value < lastPreviousTeamEndYear &&
                                          lastPreviousTeamEndYear !== undefined
                                        ) {
                                          setInvalidStartYearIds([
                                            ...invalidStartYearIds,
                                            index,
                                          ]);
                                        } else if (
                                          value >
                                            previousTeams[index].endYear &&
                                          previousTeams[index].endYear !==
                                            undefined &&
                                          previousTeams[index].endYear !== '' &&
                                          previousTeams[index].endYear !== null
                                        ) {
                                          setInvalidStartYearIds([
                                            ...invalidStartYearIds,
                                            index,
                                          ]);
                                        } else {
                                          const v = +value;
                                          setInvalidStartYearIds(
                                            invalidStartYearIds.filter(
                                              (id) => id !== index
                                            )
                                          );
                                          if (
                                            v < 1970 ||
                                            v > new Date().getFullYear() + 1
                                          ) {
                                            invalidStartYearIds.push(index);
                                          }
                                        }
                                      }
                                      const newPreviousTeams = [
                                        ...previousTeams,
                                      ];
                                      newPreviousTeams[index] = {
                                        ...newPreviousTeams[index],
                                        startYear: e.detail.value,
                                      };
                                      setPreviousTeams(newPreviousTeams);

                                      // setSinglePreviousTeam({
                                      //   ...singlePreviousTeam,
                                      //   startYear: e.detail.value,
                                      // });
                                    }}
                                    // required
                                  ></IonInput>
                                </IonItem>
                              </IonCol>
                              <IonCol>
                                <IonItem
                                  className={
                                    invalidEndYearIds.includes(index)
                                      ? 'invalid'
                                      : ''
                                  }
                                  lines="full"
                                >
                                  <IonLabel
                                    className="nobo-signup-label"
                                    position="stacked"
                                  >
                                    End Year
                                  </IonLabel>
                                  <IonInput
                                    inputmode="numeric"
                                    placeholder="YYYY"
                                    type="text"
                                    value={previousTeams[index].endYear}
                                    onIonChange={(e) => {
                                      const value = e.detail.value!;
                                      if (
                                        value !== null &&
                                        value !== undefined &&
                                        value !== ''
                                      ) {
                                        if (!/^[0-9]{4}$/.test(value)) {
                                          // isValid = false;
                                          setInvalidEndYearIds([
                                            ...invalidEndYearIds,
                                            index,
                                          ]);
                                        } else {
                                          const v = +value;
                                          setInvalidEndYearIds(
                                            invalidEndYearIds.filter(
                                              (id) => id !== index
                                            )
                                          );
                                          if (
                                            v < 1970 ||
                                            v > new Date().getFullYear() + 1
                                          ) {
                                            setInvalidEndYearIds([
                                              ...invalidEndYearIds,
                                              index,
                                            ]);
                                          } else if (
                                            v < previousTeams[index].startYear
                                          ) {
                                            setInvalidEndYearIds([
                                              ...invalidEndYearIds,
                                              index,
                                            ]);
                                          }
                                        }
                                      }

                                      const newPreviousTeams = [
                                        ...previousTeams,
                                      ];
                                      newPreviousTeams[index] = {
                                        ...newPreviousTeams[index],
                                        endYear: e.detail.value,
                                      };
                                      setPreviousTeams(newPreviousTeams);
                                    }}
                                    // required
                                  ></IonInput>
                                </IonItem>
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol>
                                <IonItem lines="full">
                                  <IonLabel
                                    className="nobo-signup-label"
                                    position="stacked"
                                  >
                                    Position
                                  </IonLabel>
                                  <UrpSelect
                                    value={previousTeams[index].position}
                                    onChange={(e) => {
                                      const newPreviousTeams = [
                                        ...previousTeams,
                                      ];
                                      newPreviousTeams[index] = {
                                        ...newPreviousTeams[index],
                                        position: e?.length ? e[0] : '',
                                      };
                                      setPreviousTeams(newPreviousTeams);
                                    }}
                                    placeholder="Select Position"
                                    options={getPositions()
                                      .filter((p) => {
                                        return (
                                          p.sport ===
                                            normalizeSportGender(
                                              location.state
                                            ) || p.sport === primarySport
                                        );
                                      })
                                      .map((p) => {
                                        return {
                                          value: p.symbol || p.name,
                                          label:
                                            p.name +
                                            (p.symbol ? ` (${p.symbol})` : ''),
                                        };
                                      })}
                                  />
                                </IonItem>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonItem>
                        <IonItem className="nobo-input" lines="full">
                          <IonLabel
                            className="nobo-signup-label"
                            position="stacked"
                          >
                            School
                          </IonLabel>
                          <IonInput
                            value={previousTeams[index].school}
                            placeholder="School / Organization"
                            autocapitalize="on word"
                            autocorrect="on"
                            type="text"
                            onIonChange={(e) => {
                              const newPreviousTeams = [...previousTeams];
                              newPreviousTeams[index] = {
                                ...newPreviousTeams[index],
                                school: e.detail.value,
                              };
                              setPreviousTeams(newPreviousTeams);
                            }}
                          ></IonInput>
                        </IonItem>
                        <IonItem className="nobo-input" lines="full">
                          <IonLabel
                            className="nobo-signup-label"
                            position="stacked"
                          >
                            State
                          </IonLabel>
                          <UrpSelect
                            value={previousTeams[index].state}
                            onChange={(e) => {
                              const newPreviousTeams = [...previousTeams];
                              newPreviousTeams[index] = {
                                ...newPreviousTeams[index],
                                state: e?.length ? e[0] : '',
                              };
                              setPreviousTeams(newPreviousTeams);
                            }}
                            placeholder="Select State"
                            options={states.map((c) => {
                              return { value: c, label: c };
                            })}
                          />
                        </IonItem>
                        <IonItem className="nobo-input" lines="full">
                          <IonLabel
                            className="nobo-signup-label"
                            position="stacked"
                          >
                            City
                          </IonLabel>
                          <IonInput
                            value={previousTeams[index].city}
                            placeholder="City"
                            autocapitalize="on word"
                            autocorrect="on"
                            type="text"
                            onIonChange={(e) => {
                              const newPreviousTeams = [...previousTeams];
                              newPreviousTeams[index] = {
                                ...newPreviousTeams[index],
                                city: e.detail.value,
                              };
                              setPreviousTeams(newPreviousTeams);
                            }}
                          ></IonInput>
                        </IonItem>
                      </div>
                    );
                  })}
                  <IonRow>
                    <IonCol size="4">
                      {previousTeams.length > 1 ? (
                        <IonLabel
                          style={{ color: '#9BC9C2', fontWeight: 'bold' }}
                          onClick={(e) => {
                            setSinglePrevTeamStateDropdownField([
                              ...singlePrevTeamStateDropdownField.slice(0, -1),
                            ]);
                            setSinglePrevTeamPositionDropdownField([
                              ...singlePrevTeamPositionDropdownField.slice(
                                0,
                                -1
                              ),
                            ]);
                            setPreviousTeams([
                              ...previousTeams.slice(
                                0,
                                previousTeams.length - 1
                              ),
                            ]);
                            setInvalidEndYearIds(
                              invalidEndYearIds.filter(
                                (id) => id !== previousTeams.length - 1
                              )
                            );
                            setInvalidStartYearIds(
                              invalidEndYearIds.filter(
                                (id) => id !== previousTeams.length - 1
                              )
                            );

                            const elem: any = e.target;
                            setTimeout(() => {
                              elem.scrollIntoView({
                                block: 'end',
                                inline: 'nearest',
                              });
                            }, 100);
                          }}
                        >
                          Remove
                        </IonLabel>
                      ) : (
                        <IonLabel></IonLabel>
                      )}
                    </IonCol>
                    <IonCol size="4" offset="4">
                      <IonLabel
                        style={{ color: '#2F736F', fontWeight: 'bold' }}
                        onClick={(e) => {
                          setSinglePrevTeamStateDropdownField([
                            ...singlePrevTeamStateDropdownField,
                            '',
                          ]);
                          setSinglePrevTeamPositionDropdownField([
                            ...singlePrevTeamPositionDropdownField,
                            '',
                          ]);
                          const newPreviousTeams = [...previousTeams];
                          newPreviousTeams.push({
                            startYear: '',
                            endYear: '',
                            position: '',
                            school: '',
                            state: '',
                          });
                          setPreviousTeams(newPreviousTeams);
                          const elem: any = e.target;
                          setTimeout(() => {
                            elem.scrollIntoView({
                              block: 'end',
                              inline: 'nearest',
                            });
                          }, 100);
                          setNumberOfTeamsPlayedFor(numberOfTeamsPlayedFor + 1);
                        }}
                      >
                        + Add Team
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonList>
              </IonAccordion>
            </div>
            <div className="nobo-section">
              <IonAccordion id="player-highlights" value="player-highlights">
                <IonItem
                  lines="none"
                  slot="header"
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('player-highlights')}
                >
                  <span className="nobo-step-num">4</span>
                  <h5 className="nobo-section-title">Player Highlights</h5>
                </IonItem>

                <IonList className="nobo-list-input" slot="content">
                  {uploadVideoOptionEnabled && (
                    <IonItem lines="none">
                      <UrpSelect
                        placeholder={
                          highlightLinkOrUpload === 'link'
                            ? 'Add a Link'
                            : 'Upload Video'
                        }
                        onChange={(e) =>
                          setHighlightLinkOrUpload(e?.length ? e[0] : '')
                        }
                        options={[
                          { value: 'link', label: 'Add a Link' },
                          { value: 'upload', label: 'Upload Video' },
                        ]}
                      />
                    </IonItem>
                  )}
                  {highlightLinkOrUpload === 'link' ? (
                    <>
                      <span
                        className="nobo-optional"
                        style={{
                          color: '#d6d6d6',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        <p>
                          Highlight link should be a Youtube or Hudl URL. Please
                          verify your video displays correctly in the preview
                          window which should appear below after you provide a
                          link.
                        </p>

                        <p>Maximum size for video upload is 260MB.</p>
                      </span>
                      {!uploadVideoMode && (
                        <div className="nobo-video-upload-button">
                          Upload Video
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticationEndpoint={authenticationEndpoint}
                          ></IKContext>
                          <IKUpload
                            className="nobo-video-file-uploader-control"
                            publicKey={publicKey}
                            authenticationEndpoint={authenticationEndpoint}
                            urlEndpoint={urlEndpoint}
                            // fileName="test-upload-2."
                            // tags={["sample-tag1", "sample-tag2"]}
                            // customCoordinates={"10,10,10,10"}
                            // isPrivateFile={false}
                            // useUniqueFileName={true}
                            // responseFields={["tags"]}
                            validateFile={(file: any) => {
                              let fileMax =
                                environment?.maxVideoFileSize || 260000000; // 260MB
                              if (file.size < fileMax) {
                                return true;
                              } else {
                                alert(
                                  'Video file is too large, must be less than 10MB'
                                );
                                return false;
                              }
                            }}
                            // folder={"/sample-folder"}
                            // extensions={[{
                            //   "name": "remove-bg",
                            //   "options": {
                            //     "add_shadow": true,
                            //   },
                            // }]}
                            // webhookUrl="https://www.example.com/imagekit-webhook" // replace with your webhookUrl
                            // overwriteFile={true}
                            // overwriteAITags={true}
                            // overwriteTags={true}
                            // overwriteCustomMetadata={true}
                            onError={onError}
                            onSuccess={onSuccess}
                            onUploadProgress={onUploadProgress}
                            onUploadStart={onUploadStart}
                          />
                        </div>
                      )}

                      {progressActive && (
                        <div
                          className="video-upload-file-progress"
                          style={{ marginBottom: '12px' }}
                          onClick={() => {
                            // alert('uploading from computer');
                          }}
                        >
                          <div className="progress">
                            {videoUploadComplete && <span>Video Uploaded</span>}
                          </div>
                        </div>
                      )}
                      {!uploadVideoMode && (
                        <>
                          <div className="nobo-upload-text-or">OR</div>
                          <div className="nobo-upload-text-signup">
                            Highlight Link
                          </div>
                          <IonItem
                            style={{ marginTop: 0 }}
                            className={
                              'nobo-input' +
                              (highlightLinkValid ? '' : ' invalid')
                            }
                            lines="full"
                          >
                            <IonInput
                              value={highlightLink}
                              onIonChange={(e) => {
                                const target: any = e.target;
                                setHighlightLinkValid(
                                  target.nativeInput.validity.valid
                                );
                                setHighlightLink(e.detail.value!);
                              }}
                              placeholder="https://www.youtube.com/watch?v=4x4MND-Rhrc"
                              type="url"
                              pattern="^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$"
                            ></IonInput>
                          </IonItem>
                        </>
                      )}
                    </>
                  ) : (
                    <IonItem lines="none">
                      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <input
                          type="file"
                          ref={videoUpload}
                          className="nobo-file-upload video"
                          onChange={(ev) => onVideoFileChange(ev)}
                        ></input>
                        <IonButton
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          color={btnColor}
                          className="nobo-upload-btn"
                          style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: '2em',
                            fontWeight: 'bold',
                            height: '5vh',
                            width: '85vw',
                            color: '#00D6B6',
                            padding: '2px',
                          }}
                        >
                          +
                        </IonButton>
                      </div>
                    </IonItem>
                  )}
                  {validUrlRegex.test(highlightLink) && (
                    <IonItem lines="none">
                      <div style={{ width: '100%' }}>
                        <div className="nobo-highlight-video-container">
                          <iframe
                            title="highlight"
                            className="nobo-highlight-video"
                            src={embedLink(highlightLink)}
                          />
                        </div>
                      </div>
                    </IonItem>
                  )}
                </IonList>
              </IonAccordion>
            </div>

            <div className="nobo-section">
              <IonAccordion id="measurables" value="measurables">
                <IonItem
                  lines="none"
                  slot="header"
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('measurables')}
                >
                  <span className="nobo-step-num">5</span>
                  <h5 className="nobo-section-title">Measureables</h5>
                </IonItem>
                {/* football */}
                {isSectionActive('football') && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Wingspan
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.wingspan}
                                placeholder="Wingspan"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    wingspan: e?.length ? e[0] : '',
                                  });
                                }}
                                options={[
                                  { value: `60"`, label: `60"` },
                                  { value: `61"`, label: `61"` },
                                  { value: `62"`, label: `62"` },
                                  { value: `63"`, label: `63"` },
                                  { value: `64"`, label: `64"` },
                                  { value: `65"`, label: `65"` },
                                  { value: `66"`, label: `66"` },
                                  { value: `67"`, label: `67"` },
                                  { value: `68"`, label: `68"` },
                                  { value: `69"`, label: `69"` },
                                  { value: `70"`, label: `70"` },
                                  { value: `71"`, label: `71"` },
                                  { value: `72"`, label: `72"` },
                                  { value: `73"`, label: `73"` },
                                  { value: `74"`, label: `74"` },
                                  { value: `75"`, label: `75"` },
                                  { value: `76"`, label: `76"` },
                                  { value: `77"`, label: `77"` },
                                  { value: `78"`, label: `78"` },
                                  { value: `79"`, label: `79"` },
                                  { value: `80"`, label: `80"` },
                                  { value: `81"`, label: `81"` },
                                  { value: `82"`, label: `82"` },
                                  { value: `83"`, label: `83"` },
                                  { value: `84"`, label: `84"` },
                                  { value: `85"`, label: `85"` },
                                  { value: `86"`, label: `86"` },
                                  { value: `87"`, label: `87"` },
                                  { value: `88"`, label: `88"` },
                                  { value: `89"`, label: `89"` },
                                  { value: `90"`, label: `90"` },
                                ]}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Vertical
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.vertical}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    vertical: e?.length ? e[0] : '',
                                  });
                                }}
                                options={verticalList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Squat
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.squat}
                                placeholder="lbs"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    squat: e?.length ? e[0] : '',
                                  });
                                }}
                                options={[
                                  { value: '50lbs', label: '50lbs' },
                                  { value: '100lbs', label: '100lbs' },
                                  { value: '150lbs', label: '150lbs' },
                                  { value: '200lbs', label: '200lbs' },
                                  { value: '250lbs', label: '250lbs' },
                                  { value: '300lbs', label: '300lbs' },
                                  { value: '350lbs', label: '350lbs' },
                                  { value: '400lbs', label: '400lbs' },
                                  { value: '450lbs', label: '450lbs' },
                                  { value: '500lbs', label: '500lbs' },
                                  { value: '550lbs', label: '550lbs' },
                                  { value: '600lbs', label: '600lbs' },
                                  { value: '650lbs', label: '650lbs' },
                                  { value: '700lbs', label: '700lbs' },
                                  { value: '750lbs', label: '750lbs' },
                                  { value: '800lbs', label: '800lbs' },
                                  { value: '800lbs+', label: '800lbs+' },
                                ]}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Shuttle Time
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.shuttleTime}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    shuttleTime: e?.length ? e[0] : '',
                                  });
                                }}
                                options={shuttleList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                40 yd Dash
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.fortyYardDash}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    fortyYardDash: e?.length ? e[0] : '',
                                  });
                                }}
                                options={fortyYardDashList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                3-Cone Drill
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.threeConeDrill}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    threeConeDrill: e?.length ? e[0] : '',
                                  });
                                }}
                                options={threeConeDrillList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}

                {/* basketball */}
                {(isSectionActive('wbasketball') ||
                  isSectionActive('mbasketball')) && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Standing vertical
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.vertical}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    vertical: e?.length ? e[0] : '',
                                  });
                                }}
                                options={verticalList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                3/4 Sprint
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.threeForthsCourtSprint}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    threeForthsCourtSprint: e?.length
                                      ? e[0]
                                      : '',
                                  });
                                }}
                                options={threeForthsCourtSprintList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Lane agility drill
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.laneAgilityDrill}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    laneAgilityDrill: e?.length ? e[0] : '',
                                  });
                                }}
                                options={laneAgilityDrillList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Shuttle Run
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.shuttleRun}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    shuttleRun: e?.length ? e[0] : '',
                                  });
                                }}
                                options={shuttleList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}

                {/* baseball */}
                {isSectionActive('baseball') && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Bat Speed
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.batSpeed}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    batSpeed: e?.length ? e[0] : '',
                                  });
                                }}
                                options={batSpeedList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Arm Velocity
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.armVelocity}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    armVelocity: e?.length ? e[0] : '',
                                  });
                                }}
                                options={armVelocityList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Exit Velocity
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.exitVelocity}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    exitVelocity: e?.length ? e[0] : '',
                                  });
                                }}
                                options={exitVelocityList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                60 time
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.sixtyYardDash}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    sixtyYardDash: e?.length ? e[0] : '',
                                  });
                                }}
                                options={sixtyYardDashList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}

                {/* softball */}
                {isSectionActive('softball') && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Bat Speed
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.batSpeed}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    batSpeed: e?.length ? e[0] : '',
                                  });
                                }}
                                options={batSpeedList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Arm Velocity
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.armVelocity}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    armVelocity: e?.length ? e[0] : '',
                                  });
                                }}
                                options={armVelocityList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Exit Velocity
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.exitVelocity}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    exitVelocity: e?.length ? e[0] : '',
                                  });
                                }}
                                options={exitVelocityList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                60 time
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.sixtyYardDash}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    sixtyYardDash: e?.length ? e[0] : '',
                                  });
                                }}
                                options={sixtyYardDashList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}

                {/* Volleyball */}
                {(isSectionActive('wvolleyball') ||
                  isSectionActive('mvolleyball')) && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Standing Reach
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.standingReach}
                                placeholder="Reach"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    standingReach: e?.length ? e[0] : '',
                                  });
                                }}
                                // disabled={true}
                                options={standingReachList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Block Jump
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.blockJump}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    blockJump: e?.length ? e[0] : '',
                                  });
                                }}
                                // disabled={true}
                                options={blockJumpList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Vertical Jump
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.vertical}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    vertical: e?.length ? e[0] : '',
                                  });
                                }}
                                // disabled={true}
                                options={verticalList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Attack Jump
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.attackJump}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    attackJump: e?.length ? e[0] : '',
                                  });
                                }}
                                options={attackJumpList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}
                {/* Lacrosse */}
                {(isSectionActive('wlacrosse') ||
                  isSectionActive('mlacrosse')) && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Power Ball Toss
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.powerballToss}
                                placeholder="Feet"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    powerballToss: e?.length ? e[0] : '',
                                  });
                                }}
                                options={powerballTossList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Vertical
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.vertical}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    vertical: e?.length ? e[0] : '',
                                  });
                                }}
                                options={verticalList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Shot Speed
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.shotSpeed}
                                placeholder="Mph"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    shotSpeed: e?.length ? e[0] : '',
                                  });
                                }}
                                options={shotSpeedList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Shuttle Time
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.shuttleTime}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    shuttleTime: e?.length ? e[0] : '',
                                  });
                                }}
                                options={shuttleList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                40 yd Dash
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.fortyYardDash}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    fortyYardDash: e?.length ? e[0] : '',
                                  });
                                }}
                                options={fortyYardDashList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                10 yd Split
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.tenYardSplit}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    tenYardSplit: e?.length ? e[0] : '',
                                  });
                                }}
                                options={tenYardSplitList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}

                {/* Soccer */}
                {(isSectionActive('wsoccer') || isSectionActive('msoccer')) && (
                  <IonList className="nobo-list-input" slot="content">
                    <IonItem lines="full" className="nobo-blank">
                      <IonLabel
                        className="nobo-signup-label"
                        position="stacked"
                      >
                        BLANK AREA
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                40 Yard Dash
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.fortyYardDash}
                                placeholder="Seconds"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    fortyYardDash: e?.length ? e[0] : '',
                                  });
                                }}
                                options={fortyYardDashList}
                              />
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Vertical Jump
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.vertical}
                                placeholder="Vertical"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    vertical: e?.length ? e[0] : '',
                                  });
                                }}
                                options={verticalList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonItem lines="none">
                              <IonLabel
                                className="nobo-signup-label"
                                position="stacked"
                              >
                                Mile Run
                              </IonLabel>
                              <UrpSelect
                                value={measurables?.mileRun}
                                placeholder="Minutes"
                                className="nobo-select-half"
                                border={true}
                                onChange={(e) => {
                                  setMeasurables({
                                    ...measurables,
                                    mileRun: e?.length ? e[0] : '',
                                  });
                                }}
                                options={mileRunList}
                              />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}
              </IonAccordion>
            </div>
            <div className="nobo-section">
              <IonAccordion id="offers" value="offers">
                <IonItem
                  lines="none"
                  slot="header"
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('offers')}
                >
                  <span className="nobo-step-num">6</span>
                  <h5 className="nobo-section-title">Offers</h5>
                </IonItem>
                <IonList className="nobo-list-input" slot="content">
                  <IonItem className="nobo-input" lines="full">
                    <IonInput
                      autofocus
                      value={offersBubble.join(',')}
                      onIonChange={(e) => {
                        let count = 0;
                        if (e.detail.value === undefined) return;

                        const lastElement = e.detail
                          .value!.split(',')
                          .pop()
                          ?.trim();
                        const autoCompleteSchools = allUniversities.filter(
                          (school) => {
                            if (
                              count < 5 &&
                              school.name
                                .toLowerCase()
                                .includes(lastElement!.toLowerCase())
                            ) {
                              count++;
                              return true;
                            } else if (
                              count < 5 &&
                              school.acronym
                                .toLowerCase()
                                .includes(lastElement!.toLowerCase())
                            ) {
                              count++;
                              return true;
                            }
                            return false;
                          },
                          { count: 0 }
                        );
                        const arrayOfAutoCompleteSchools =
                          autoCompleteSchools.map((school) => school.name);
                        !arrayOfAutoCompleteSchools.includes(lastElement!) &&
                          lastElement !== '' &&
                          openPopover(e);
                        setFilteredUniversities(arrayOfAutoCompleteSchools);
                        setOffersBubble(e.detail.value!.split(','));
                      }}
                      onIonFocus={(e) => {
                        const elem: any = e.target;
                        elem.scrollIntoView();
                      }}
                      placeholder="School"
                      type="text"
                      required
                    ></IonInput>
                    <IonPopover
                      size="cover"
                      ref={popover}
                      isOpen={PopoverOpen}
                      showBackdrop={false}
                      keyboardClose={false}
                      onDidDismiss={() => setPopoverOpen(false)}
                    >
                      <IonList lines="none">
                        {filteredUniversities.map((university) => (
                          <IonItem
                            onClick={(e) => {
                              let newOffers = [];
                              if (
                                offers?.length === 0 ||
                                offers === undefined
                              ) {
                                newOffers.push(university);
                              } else {
                                newOffers = [...offers];
                                newOffers.indexOf(university) === -1 &&
                                  newOffers.push(university);
                              }
                              setOffers(newOffers);
                              setOffersBubble([]);
                              setPopoverOpen(false);
                            }}
                            key={university}
                          >
                            <IonLabel style={{ paddingLeft: '10px' }}>
                              {university}
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonPopover>
                  </IonItem>
                  <IonItem lines="none">
                    <IonRow>
                      {offers &&
                        offers.map((offer) => {
                          return (
                            <div key={offer}>
                              <div
                                onClick={() => {
                                  setOffers(offers.filter((o) => o !== offer));
                                }}
                                className={'nobo-signup-tab-menu-item'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div>{offer}</div>
                                <div
                                  style={{
                                    marginLeft: '5px',
                                    position: 'relative',
                                    top: '2px',
                                  }}
                                >
                                  <IonIcon
                                    size="small"
                                    slot="icon-only"
                                    color="#00816d"
                                    icon={closeOutline}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </IonRow>
                  </IonItem>
                </IonList>
              </IonAccordion>
            </div>
            <div className="nobo-section">
              <IonAccordion id="uploads" value="uploads">
                <IonItem
                  lines="none"
                  slot="header"
                  className="nobo-section-head"
                  onClick={(e) => scollToSection('uploads')}
                >
                  <span className="nobo-step-num">7</span>
                  <h5 className="nobo-section-title">Transcript Upload</h5>
                </IonItem>

                <IonList className="nobo-list-input" slot="content">
                  <IonItem lines="full" className="nobo-blank">
                    <IonLabel className="nobo-signup-label" position="stacked">
                      BLANK AREA
                    </IonLabel>
                  </IonItem>
                  <span
                    className="nobo-optional"
                    style={{
                      color: '#9BC9C1',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                    }}
                  >
                    Upload your transcripts to be viewed by coaches
                  </span>
                  <IonItem
                    lines="none"
                    style={{
                      '--padding-start': '0',
                      '--padding-end': '0',
                      '--inner-padding-start': '0',
                      '--inner-padding-end': '0',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        width: '100%',
                      }}
                    >
                      <input
                        type="file"
                        ref={transcriptsUpload}
                        className="nobo-file-upload transcripts"
                        onChange={(ev) => onTranscriptFileChange(ev)}
                        accept="image/jpg,image/png,application/pdf"
                      ></input>
                      <IonButton
                        onClick={(e) => {
                          e.preventDefault();
                          uploadTranscripts();
                        }}
                        color={btnColor}
                        className="nobo-upload-btn"
                      >
                        +
                      </IonButton>
                    </div>
                  </IonItem>
                  {showPDF && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
                      <Viewer fileUrl={pdfURL} />;
                    </Worker>
                  )}
                </IonList>
              </IonAccordion>
            </div>

            {!props.editMode && (
              <div
                style={{
                  marginTop: '20px',
                  textAlign: 'center',
                  width: '100vw',
                }}
              >
                <IonButton
                  onClick={(e) => {
                    e.preventDefault();
                    signUpAthlete();
                  }}
                  color={btnColor}
                  className="nobo-green-btn"
                >
                  Lets Go!
                </IonButton>
              </div>
            )}
            {props.editMode && (
              <div
                style={{
                  marginTop: '20px',
                  textAlign: 'center',
                  width: '100vw',
                }}
              >
                <IonButton
                  onClick={(e) => {
                    e.preventDefault();
                    editAthlete();
                  }}
                  color={btnColor}
                  className="nobo-green-btn"
                >
                  Save
                </IonButton>
              </div>
            )}
          </IonAccordionGroup>
        </IonList>
      </IonContent>

      <SignupAddStatsCategoryModal
        ref={addStatsModal}
        sport={sportStats}
        currentSeason={season}
        onCancel={() => {
          addStatsModal.current?.dismiss();
        }}
        onClose={(season: string, section: string, category: string) => {
          const statsCopy = getStatsCopy();
          const s = statsCopy.find((s: any) => s.season === season);
          if (s) {
            s.categories.push({
              section: section,
              category: category,
              values: {},
            });
          }
          setStats(statsCopy);
          addStatsModal.current?.dismiss();
        }}
      />
    </IonPage>
  );
};

export default SignUpAthlete;
