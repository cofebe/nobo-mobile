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
  IonPopover,
  useIonToast,
} from '@ionic/react';
import './URP.css';
import './SignUpAthlete.scss';
import './cropper.css';
import { AuthService } from '../services/AuthService';
import { getCountries } from '../data/countries';
import { getSchools } from '../data/schools';
import { getStates } from '../data/states';
import { takePicture } from '../components/UrpCam';
import Cropper from 'react-cropper';
import UrpSelect from '../components/UrpSelect';
import { UserService } from '../services/UserService';
import { UpdateTrainerProfileRequest } from '../data/profile';

// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";

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

const SignUpTrainer: React.FC<Props> = (props) => {
  const [present, dismiss] = useIonToast();
  const [birthdayMonth, setBirthdayMonth] = useState<string>('');
  const [birthdayDay, setBirthdayDay] = useState<string>('');
  const [birthdayYear, setBirthdayYear] = useState<string>('');
  const date = new Date();
  const [birthday, setBirthday] = useState<string>('');
  const [birtdayDayList, setBirthdayDayList] = useState<any>([]);
  const schoolPopover = useRef<HTMLIonPopoverElement>(null);

  const transcriptsVals = useRef<InternalValues>({
    file: false,
  });

  const videoVals = useRef<InternalValues>({
    file: false,
  });

  const [toggleCropper, setToggleCropper] = useState(false);
  const [toggleCropperBanner, setToggleCropperBanner] = useState(false);

  const formData = new FormData();

  //const [userID, setUserID] = useState<number>(0); // + EDIT ADDITION //
  const userService = new UserService();

  const authService = new AuthService();
  const allSchools: string[] = getSchools();
  const allCountries: string[] = getCountries();
  const allStates: string[] = getStates();

  // Basic Information
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profilePicData, setProfilePicData] = useState(Object);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [bannerPicData, setBannerPicData] = useState(Object);
  const [bannerPicPreview, setBannerPicPreview] = useState('');
  const [primarySport, setPrimarySport] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  const [schoolPopoverOpen, setSchoolPopoverOpen] = useState<boolean>(false);
  const [filteredSchools, setFilteredSchools] = useState<string[]>([]);
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

  const [previousTeams, setPreviousTeams] = useState<any>([
    {
      team: '',
      startYear: null,
      endYear: null,
      position: [],
      school: '',
      city: '',
      state: '',
    },
  ]);

  const [previousTeamsTrained, setPreviousTeamsTrained] = useState<any>([
    {
      team: '',
      startYear: null,
      endYear: null,
      position: '',
      school: '',
      city: '',
      state: '',
    },
  ]);

  // Stats

  const [invalidStartYearIds, setInvalidStartYearIds] = useState<number[]>([]);
  const [invalidEndYearIds, setInvalidEndYearIds] = useState<number[]>([]);

  const [invalidStartYearIdsTrained, setInvalidStartYearIdsTrained] = useState<
    number[]
  >([]);
  const [invalidEndYearIdsTrained, setInvalidEndYearIdsTrained] = useState<
    number[]
  >([]);

  // Offers

  const [states, setStates] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // EDIT MODE ADDED //
  const [profile, setProfile] = useState<UpdateTrainerProfileRequest>({
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
    trainer_user_profile: {
      city: {
        String: '',
        Valid: false,
      },
      school: {
        String: '',
        Valid: false,
      },
      social_links: {
        String: '',
        Valid: false,
      },
      position: {
        String: '',
        Valid: false,
      },
      training_experience: [],
      playing_experience: [],
    },
  });

  let retry = 0;

  useIonViewWillEnter(() => {
    // some initialization code
    setCountries(allCountries);
    setStates(allStates);

    // EDIT MODE ADDITION //
    if (props.editMode) {
      getProfile();
      //let storage: any = window.localStorage.getItem('persistedState');
      //let user = JSON.parse(storage);
      //setUserID(user.user['user_id']);
    }
  });

  const history = useHistory();
  const location = useLocation();

  // EDIT MODE ADDITION //
  function getUserId() {
    let pathUserID = history.location.pathname.substring(
      history.location.pathname.lastIndexOf('/') + 1
    );
    return parseInt(pathUserID);
  }

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

  // EDIT MODE ADDITION //
  async function getProfile() {
    console.log('get profile');
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    // setUserId(user.user["user_id"]);

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
          trainer_user_profile: {
            school: data.trainer_user_profile.school,
            social_links: data.trainer_user_profile.social_links,
            city: data.basic_user_profile.city,
            training_experience: data.trainer_user_profile.training_experience,
            playing_experience: data.coach_user_profile.playing_experience,
            position: data.coach_user_profile.position,
          },
          athlete_user_profile: {
            social_links: data.athlete_user_profile.social_links,
            primary_sport: data.athlete_user_profile.primary_sport,
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
        setPosition(basicInfo?.trainer_user_profile?.position?.String);
        setCountry(
          basicInfo?.basic_user_profile?.country?.String.replaceAll(`"`, '')
        );
        setState(
          basicInfo?.basic_user_profile?.state?.String.replaceAll(`"`, '')
        );
        setSchool(basicInfo?.basic_user_profile?.school?.String);
        setProfilePicData(basicInfo?.basic_user_profile?.profile_image);
        setPrimarySport(basicInfo?.athlete_user_profile?.primary_sport?.String);
        setBio(basicInfo?.basic_user_profile?.bio?.String);

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

        if (
          basicInfo?.trainer_user_profile?.training_experience === undefined
        ) {
          setPreviousTeamsTrained([
            {
              team: '',
              startYear: null,
              endYear: null,
              position: '',
              school: '',
              city: '',
              state: '',
            },
          ]);
        } else {
          let trainingExperiences =
            basicInfo?.trainer_user_profile?.training_experience.map(
              (e: string) => {
                return JSON.parse(e);
              }
            );
          setPreviousTeamsTrained(trainingExperiences);
        }

        if (basicInfo?.trainer_user_profile?.playing_experience === undefined) {
          setPreviousTeams([
            {
              team: '',
              startYear: null,
              endYear: null,
              position: [],
              school: '',
              city: '',
              state: '',
            },
          ]);
        } else {
          let playingExperience =
            basicInfo?.trainer_user_profile?.playing_experience.map(
              (e: string) => {
                return JSON.parse(e);
              }
            );
          setPreviousTeams(playingExperience);
        }
        return data;
      });
  }

  const [totalProgressItemCount /*, setTotalProgressItemCount*/] = useState(3);
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
      setProgressStep({ step: 3, section: 'Complete' });
      setProgressPercentage('100%');
      if (
        previousTeamsTrained &&
        previousTeamsTrained[0].team === '' &&
        bio === ''
      ) {
        setProgressStep({ step: 2, section: 'Training Experience' });
        setProgressPercentage('55%');
      }

      if (
        firstName === '' ||
        lastName === '' ||
        !profilePicData?.base64String ||
        !bannerPicData?.base64String ||
        position === '' ||
        school === '' ||
        city === ''
      ) {
        setProgressStep({ step: 1, section: 'Basic Info' });
        setProgressPercentage('33%');
      }
      // let perc =
      //   Math.round((progressStep.step / totalProgressItemCount) * 100) + '%';

      // if (progressStep.step === totalProgressItemCount) {
      //   perc = '100%';
      // }
      // setProgressPercentage(perc);
    }
  }, [firstName, lastName, profilePicData, bannerPicData, bio]);

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
      /*let canvas =*/ cropper.getCroppedCanvas();
    }
    //console.log(cropper.getCroppedCanvas().toDataURL);
  };

  const cropperRefBanner = useRef<HTMLImageElement>(null);
  const onBannerPhotoCrop = async () => {
    const imageElement: any = cropperRefBanner?.current;
    const cropperBanner: any = imageElement?.cropper;
    if (cropperBanner) {
      /*let canvas =*/ cropperBanner.getCroppedCanvas();
    }
    //console.log(cropper.getCroppedCanvas().toDataURL);
  };

  async function uploadBannerPic() {
    let bpData = await takePicture({ quality: 90, active: true });
    setBannerPicData(bpData);
    setToggleCropperBanner(true);
  }

  interface InternalValues {
    file: any;
  }

  //function isSectionActive(section: string) {
  //  if (section === location.state || section === primarySport) {
  //    return true;
  //  }
  //  return false;
  //}

  //function capitalizeFirstLetter(input: any) {
  //  return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
  //}

  //function normalizeSportGender(sport: any) {
  //  let normSport = sport;
  //  if (normSport) {
  //    normSport = normSport
  //      .replace('wbasketball', 'basketball')
  //      .replace('mbasketball', 'basketball')
  //      .replace('wvolleyball', 'volleyball')
  //      .replace('mvolleyball', 'volleyball')
  //      .replace('wsoccer', 'soccer')
  //      .replace('msoccer', 'soccer');
  //  }
  //  return normSport;
  //}

  const validityChecks = [
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

    if (!request?.profile_picture?.base64String && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Profile Picture: Please upload a profile picture.   <br/><br/>'
      );
    }

    if ((request?.position || '').length === 0 && !props.editMode) {
      valid = false;
      fixTheFollowing.push(
        '• Missing Trainer Position: Please enter a position.  <br/><br/>'
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

  async function editTrainer() {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    console.log('UserId: ', user.user['user_id']);

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
      position: position,
      primary_sport: primarySport,
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
      bio: bio ? bio : profile.basic_user_profile?.bio?.String,
      playing_experience:
        JSON.stringify(previousTeams) ===
        JSON.stringify([
          {
            team: '',
            startYear: null,
            endYear: null,
            position: [],
            school: '',
            city: '',
            state: '',
          },
        ])
          ? []
          : previousTeams,
      training_experience:
        JSON.stringify(previousTeamsTrained) ===
        JSON.stringify([
          {
            team: '',
            startYear: null,
            endYear: null,
            position: '',
            school: '',
            city: '',
            state: '',
          },
        ])
          ? []
          : previousTeamsTrained,
    };

    console.log('EditProfile Req: ', req);
    let validationResults = validateSignup(req);
    if (validationResults.valid) {
      console.log('Validation Valid: ', validationResults);
      let spinner = document.querySelectorAll('.urp-spinner-container');
      spinner[0].classList.add('active');

      userService
        .updateProfile(req, user.user['user_id'])
        .then((res) => res.json())
        .then((data) => {
          console.log('updateProfile: ', data);
          //   authService.setUserData(data);

          setTimeout(() => {
            spinner[0].classList.remove('active');
            history.push('/home/my-trainer-profile');
          }, 1000);
        })
        .catch((err) => {
          console.error('Error:', err);
          if (retry < 3) {
            retry += 1;
            setTimeout(() => {
              console.log('Trying sign up again');
              editTrainer();
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

  async function signUpTrainer() {
    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);
    console.log('UserId: ', user.user['user_id']);

    let req = {
      user_id: user.user['user_id'],
      account_type: 'trainer',
      first_name: firstName,
      last_name: lastName,
      profile_picture: profilePicData, //{ base64string: profilePicData.base64String, format: profilePicData.format },
      banner_picture: bannerPicData,
      primary_sport: location.state,
      position: position,
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
      playing_experience:
        JSON.stringify(previousTeams) ===
        JSON.stringify([
          {
            team: '',
            startYear: null,
            endYear: null,
            position: [],
            school: '',
            city: '',
            state: '',
          },
        ])
          ? []
          : previousTeams,
      training_experience:
        JSON.stringify(previousTeamsTrained) ===
        JSON.stringify([
          {
            team: '',
            startYear: null,
            endYear: null,
            position: '',
            school: '',
            city: '',
            state: '',
          },
        ])
          ? []
          : previousTeamsTrained,
    };

    console.log('SignUpTrainer Req: ', req);
    let validationResults = validateSignup(req);
    if (validationResults.valid) {
      console.log('Validation Valid: ', validationResults);
      let spinner = document.querySelectorAll('.urp-spinner-container');
      spinner[0].classList.add('active');

      authService
        .signUpTrainer(req, user.user['user_id'])
        .then((res) => res.json())
        .then((data) => {
          console.log('signUpTrainer: ', data);
          authService.setUserData(data);

          setTimeout(() => {
            spinner[0].classList.remove('active');
            history.push('/home/my-trainer-profile');
          }, 1000);
        })
        .catch((err) => {
          console.error('Error:', err);
          if (retry < 3) {
            retry += 1;
            setTimeout(() => {
              console.log('Trying sign up again');
              signUpTrainer();
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

  let weightList = [];
  for (let i = 50; i <= 410; i += 1) {
    weightList.push({ value: `${i}`, label: `${i} lbs` });
  }

  let verticalList = [];
  for (let i = 20.0; i <= 50; i += 0.5) {
    verticalList.push({ value: `${i.toFixed(1)}"`, label: `${i.toFixed(1)}"` });
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

  return (
    <IonPage
      id="sign-up-athlete-page"
      className="urp-page sign-up-athlete-page"
    >
      <div className="square-logo-desktop">
        <img src="assets/images/urp-box-logo.png" alt="logo" />
      </div>
      <div className="header-desktop">
        <div></div>
      </div>
      {toggleCropper && (
        <div className="urp-image-cropper">
          <span
            onClick={(e) => {
              e.preventDefault();
              closeProfilePicCropper();
            }}
          >
            X
          </span>
          <span className="urp-crop-header-text" style={{ color: 'FFFFFF' }}>
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
            className="urp-profile-pic-cropper"
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
        <div className="urp-image-cropper">
          <span
            onClick={(e) => {
              e.preventDefault();
              closeBannerPicCropper();
            }}
          >
            X
          </span>
          <span className="urp-crop-header-text" style={{ color: '#FFFFFF' }}>
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
            className="urp-banner-pic-cropper"
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
            <div className="urp-custom-progress-bar">
              <div className="urp-progress-label">{progressStep.section}</div>
              <div className="urp-progress-graphic">
                <div style={{ width: progressPercentage }}></div>
              </div>
              <div className="urp-progress-count">
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
                className="urp-nav-text"
              ></IonBackButton>
            )}
            {props.editMode && (
              <IonBackButton
                text="&nbsp;  Edit Trainer Profile"
                className="urp-nav-text"
              ></IonBackButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id="signup-sections" className="urp-content-area">
        <div className="urp-spinner-container">
          <IonSpinner className="urp-spinner" name="bubbles" />
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
          <IonAccordionGroup className="urp-section-group">
            <div className="urp-section">
              <IonAccordion id="basic-info" value="basic-info">
                <IonItem
                  lines="none"
                  slot="header"
                  style={{ class: 'item-inner' }}
                  className="urp-section-head"
                  onClick={(e) => scollToSection('basic-info')}
                >
                  <span className="urp-step-num">1</span>
                  <h5 className="urp-section-title required">
                    Basic Information
                  </h5>
                </IonItem>

                <IonList className="urp-list-input" slot="content">
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
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
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
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
                  <IonItem className="urp-input" lines="none">
                    <IonRow>
                      <IonCol>
                        <IonLabel
                          className="urp-signup-label"
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
                              className="urp-preview-profile-pic"
                              style={{
                                background: `url(${profilePicPreview})`,
                                backgroundSize: 'contain',
                              }}
                            ></div>
                          )}
                        </IonFabButton>
                        <a
                          href="#"
                          className="urp-upload-photo"
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
                  <IonItem className="urp-input" lines="none">
                    <IonLabel className="urp-signup-label" position="stacked">
                      Banner Picture
                    </IonLabel>
                    {bannerPicPreview === '' && (
                      <IonButton
                        onClick={(e) => {
                          e.preventDefault();
                          uploadBannerPic();
                        }}
                        color={btnColor}
                        className="urp-upload-btn"
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
                        className="urp-banner-pic-previewer"
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
                      className="urp-optional"
                      style={{ paddingTop: 6, paddingLeft: '2px !important' }}
                    >
                      Banner picture must be in standard format .png, .jpeg
                    </span>
                  </IonItem>
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
                      Position
                    </IonLabel>
                    <IonInput
                      value={position}
                      onIonChange={(e) => setPosition(e.detail.value!)}
                      placeholder="Training Position"
                      autocapitalize="on word"
                      autocorrect="on"
                      type="text"
                      required
                    ></IonInput>
                  </IonItem>

                  <IonItem lines="none">
                    <IonGrid style={{ paddingLeft: '0px' }}>
                      {/* <IonRow>
                        <IonCol size="5" style={{ paddingLeft: "0px" }}>
                          <IonItem className="urp-input" lines="none">
                            <IonLabel
                              className="urp-signup-label"
                              position="stacked"
                            >
                              Class Year
                            </IonLabel>
                            <UrpSelect
                              value={classYear}
                              onChange={(e) => {
                                setClassYear(e?.length ? e[0] : "");
                              }}
                              placeholder="Class"
                              border={true}
                              className="urp-select-short"
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
                                { value: "FR", label: "Freshman" },
                                { value: "SO", label: "Sophmore" },
                                { value: "JR", label: "Junior" },
                                { value: "SR", label: "Senior" },
                                { value: "JC", label: "JUCO" },
                                { value: "PRO", label: "PRO" },
                                { value: "Former", label: "Former" },
                                { value: "FA", label: "Free Agent" },
                                { value: "Retired", label: "Retired" },
                                { value: "GRAD", label: "GRAD" },
                              ]}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="4" style={{ paddingLeft: "0px" }}>
                          <IonItem className="urp-input" lines="none">
                            <IonLabel
                              className="urp-signup-label"
                              position="stacked"
                            >
                              Weight
                            </IonLabel>
                            <UrpSelect
                              value={weight}
                              onChange={(e) => {
                                setWeight(e.length ? e[0] : "");
                              }}
                              placeholder="lbs"
                              border={true}
                              className="urp-select-short"
                              options={weightList}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="3">
                          <IonItem className="urp-input" lines="none">
                            <IonLabel
                              className="urp-signup-label"
                              position="stacked"
                            >
                              Height
                            </IonLabel>
                            <UrpSelect
                              value={height}
                              onChange={(e) => {
                                setHeight(e?.length ? e[0] : "");
                              }}
                              placeholder={`0‘0"`}
                              border={true}
                              options={heightList}
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow> */}
                      <IonRow>
                        <IonCol style={{ paddingLeft: '0px' }}>
                          <IonLabel
                            className="urp-signup-label"
                            position="stacked"
                          >
                            Birthday{' '}
                            <span className="disclaimer-text">
                              {' '}
                              Used for informational purposes only
                            </span>
                          </IonLabel>
                        </IonCol>
                        <IonCol size="5" style={{ paddingLeft: '0px' }}>
                          <IonItem
                            style={{ marginTop: 0 }}
                            className="urp-input"
                            lines="none"
                          >
                            <IonLabel
                              className="urp-signup-label"
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
                              className="urp-select-short"
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
                            className="urp-input"
                            lines="none"
                          >
                            <IonLabel
                              className="urp-signup-label"
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
                              className="urp-select-short"
                              options={birtdayDayList}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="3">
                          <IonItem
                            style={{ marginTop: 0 }}
                            className="urp-input"
                            lines="none"
                          >
                            <IonLabel
                              className="urp-signup-label"
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

                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
                      School / Organization
                    </IonLabel>
                    <IonInput
                      autofocus
                      autocapitalize="on word"
                      autocorrect="on"
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
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
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
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
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
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
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
                  <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
                      Bio
                    </IonLabel>
                    <IonTextarea
                      value={bio}
                      autoGrow={true}
                      onIonChange={(e) => setBio(e.detail.value!)}
                      autocapitalize="on sentence"
                      spellcheck={true}
                      placeholder="Your Bio..."
                      maxlength={600}
                      inputmode="text"
                    ></IonTextarea>
                  </IonItem>
                  <IonItem
                    className={
                      'urp-input' + (socialLinkInstagramValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      Instagram<span className="urp-optional">Optional</span>
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
                      'urp-input' + (socialLinkTwitterValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      Twitter<span className="urp-optional">Optional</span>
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
                      'urp-input' + (socialLinkTikTokValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      TikTok<span className="urp-optional">Optional</span>
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
                      'urp-input' + (socialLinkHudlValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      Hudl<span className="urp-optional">Optional</span>
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
                      'urp-input' + (socialLink247SportsValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      247Sports<span className="urp-optional">Optional</span>
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
                      'urp-input' + (socialLinkRivalsValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      Rivals<span className="urp-optional">Optional</span>
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
                      'urp-input' + (socialLinkMaxPrepsValid ? '' : ' invalid')
                    }
                    lines="full"
                  >
                    <IonLabel className="urp-signup-label" position="stacked">
                      MaxPreps<span className="urp-optional">Optional</span>
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
            <div className="urp-section">
              <IonAccordion
                id="training-experience"
                value="training-experience"
              >
                <IonItem
                  lines="none"
                  slot="header"
                  className="urp-section-head"
                  onClick={(e) => scollToSection('training-experience')}
                >
                  <span className="urp-step-num">2</span>
                  <h5 className="urp-section-title">Training Experience</h5>
                </IonItem>
                <IonList className="urp-list-input" slot="content">
                  {previousTeamsTrained.map((element: any, index: any) => {
                    return (
                      <div key={index}>
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
                            position="stacked"
                          >
                            Team Trained
                          </IonLabel>
                          <IonInput
                            placeholder="Team"
                            value={previousTeamsTrained[index].team}
                            autocapitalize="on word"
                            autocorrect="on"
                            type="text"
                            onIonChange={(e) => {
                              const newPreviousTeamsTrained = [
                                ...previousTeamsTrained,
                              ];
                              newPreviousTeamsTrained[index] = {
                                ...newPreviousTeamsTrained[index],
                                team: e.detail.value,
                              };
                              setPreviousTeamsTrained(newPreviousTeamsTrained);
                            }}
                            // required
                          ></IonInput>
                        </IonItem>
                        <IonItem className="urp-input" lines="none">
                          <IonGrid style={{ paddingLeft: '0px' }}>
                            <IonRow>
                              <IonCol style={{ paddingLeft: '0px' }}>
                                <IonItem
                                  className={
                                    invalidStartYearIdsTrained.includes(index)
                                      ? 'invalid'
                                      : ''
                                  }
                                  lines="full"
                                >
                                  <IonLabel
                                    className="urp-signup-label"
                                    position="stacked"
                                  >
                                    Start Year
                                  </IonLabel>
                                  <IonInput
                                    inputmode="numeric"
                                    placeholder="YYYY"
                                    type="number"
                                    value={
                                      previousTeamsTrained[index].startYear
                                    }
                                    onIonChange={(e) => {
                                      const value = e.detail.value!;
                                      let lastPreviousTeamEndYearTrained =
                                        previousTeamsTrained[index - 1]
                                          ?.endYear;
                                      if (
                                        value !== null &&
                                        value !== undefined &&
                                        value !== ''
                                      ) {
                                        if (!/^[0-9]{4}$/.test(value)) {
                                          setInvalidStartYearIdsTrained([
                                            ...invalidStartYearIdsTrained,
                                            index,
                                          ]);
                                        } else if (
                                          value <
                                            lastPreviousTeamEndYearTrained &&
                                          lastPreviousTeamEndYearTrained !==
                                            undefined
                                        ) {
                                          setInvalidStartYearIdsTrained([
                                            ...invalidStartYearIdsTrained,
                                            index,
                                          ]);
                                        } else if (
                                          value >
                                            previousTeamsTrained[index]
                                              .endYear &&
                                          previousTeamsTrained[index]
                                            .endYear !== undefined &&
                                          previousTeamsTrained[index]
                                            .endYear !== '' &&
                                          previousTeamsTrained[index]
                                            .endYear !== null
                                        ) {
                                          setInvalidStartYearIdsTrained([
                                            ...invalidStartYearIdsTrained,
                                            index,
                                          ]);
                                        } else {
                                          const v = +value;
                                          setInvalidStartYearIdsTrained(
                                            invalidStartYearIdsTrained.filter(
                                              (id) => id !== index
                                            )
                                          );
                                          if (
                                            v < 1970 ||
                                            v > new Date().getFullYear() + 1
                                          ) {
                                            invalidStartYearIdsTrained.push(
                                              index
                                            );
                                          }
                                        }
                                      }
                                      const newPreviousTeamsTrained = [
                                        ...previousTeamsTrained,
                                      ];
                                      newPreviousTeamsTrained[index] = {
                                        ...newPreviousTeamsTrained[index],
                                        startYear: parseInt(value),
                                      };
                                      setPreviousTeamsTrained(
                                        newPreviousTeamsTrained
                                      );
                                    }}
                                    // required
                                  ></IonInput>
                                </IonItem>
                              </IonCol>
                              <IonCol>
                                <IonItem
                                  className={
                                    invalidEndYearIdsTrained.includes(index)
                                      ? 'invalid'
                                      : ''
                                  }
                                  lines="full"
                                >
                                  <IonLabel
                                    className="urp-signup-label"
                                    position="stacked"
                                  >
                                    End Year
                                  </IonLabel>
                                  <IonInput
                                    inputmode="numeric"
                                    placeholder="YYYY"
                                    type="number"
                                    value={previousTeamsTrained[index].endYear}
                                    onIonChange={(e) => {
                                      const value = e.detail.value!;
                                      if (
                                        value !== null &&
                                        value !== undefined &&
                                        value !== ''
                                      ) {
                                        if (!/^[0-9]{4}$/.test(value)) {
                                          // isValid = false;
                                          setInvalidEndYearIdsTrained([
                                            ...invalidEndYearIdsTrained,
                                            index,
                                          ]);
                                        } else {
                                          const v = +value;
                                          setInvalidEndYearIdsTrained(
                                            invalidEndYearIdsTrained.filter(
                                              (id) => id !== index
                                            )
                                          );
                                          if (
                                            v < 1970 ||
                                            v > new Date().getFullYear() + 1
                                          ) {
                                            setInvalidEndYearIdsTrained([
                                              ...invalidEndYearIdsTrained,
                                              index,
                                            ]);
                                          } else if (
                                            v <
                                            previousTeamsTrained[index]
                                              .startYear
                                          ) {
                                            setInvalidEndYearIdsTrained([
                                              ...invalidEndYearIdsTrained,
                                              index,
                                            ]);
                                          }
                                        }
                                      }

                                      // setSinglePreviousTeam({
                                      //   ...singlePreviousTeam,
                                      //   endYear: e.detail.value,
                                      //   endYearInvalid: !isValid,
                                      // });
                                      const newPreviousTeamsTrained = [
                                        ...previousTeamsTrained,
                                      ];
                                      newPreviousTeamsTrained[index] = {
                                        ...newPreviousTeamsTrained[index],
                                        endYear: parseInt(value),
                                      };
                                      setPreviousTeamsTrained(
                                        newPreviousTeamsTrained
                                      );
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
                                    className="urp-signup-label"
                                    position="stacked"
                                  >
                                    Position Trained
                                  </IonLabel>
                                  <IonInput
                                    value={previousTeamsTrained[index].position}
                                    placeholder="Training Position"
                                    autocapitalize="on word"
                                    autocorrect="on"
                                    type="text"
                                    onIonChange={(e) => {
                                      const newPreviousTeamsTrained = [
                                        ...previousTeamsTrained,
                                      ];
                                      newPreviousTeamsTrained[index] = {
                                        ...newPreviousTeamsTrained[index],
                                        position: e.detail.value,
                                      };
                                      setPreviousTeamsTrained(
                                        newPreviousTeamsTrained
                                      );
                                    }}
                                  ></IonInput>
                                </IonItem>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonItem>
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
                            position="stacked"
                          >
                            School
                          </IonLabel>
                          <IonInput
                            value={previousTeamsTrained[index].school}
                            placeholder="School / Organization"
                            autocapitalize="on word"
                            autocorrect="on"
                            type="text"
                            onIonChange={(e) => {
                              const newPreviousTeamsTrained = [
                                ...previousTeamsTrained,
                              ];
                              newPreviousTeamsTrained[index] = {
                                ...newPreviousTeamsTrained[index],
                                school: e.detail.value,
                              };
                              setPreviousTeamsTrained(newPreviousTeamsTrained);
                            }}
                          ></IonInput>
                        </IonItem>
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
                            position="stacked"
                          >
                            State
                          </IonLabel>
                          <UrpSelect
                            value={previousTeamsTrained[index].state}
                            onChange={(e) => {
                              const newPreviousTeamsTrained = [
                                ...previousTeamsTrained,
                              ];
                              newPreviousTeamsTrained[index] = {
                                ...newPreviousTeamsTrained[index],
                                state: e?.length ? e[0] : '',
                              };
                              setPreviousTeamsTrained(newPreviousTeamsTrained);
                            }}
                            placeholder="Select State"
                            options={states.map((c) => {
                              return { value: c, label: c };
                            })}
                          />
                        </IonItem>
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
                            position="stacked"
                          >
                            City
                          </IonLabel>
                          <IonInput
                            value={previousTeamsTrained[index].city}
                            placeholder="City"
                            autocapitalize="on word"
                            autocorrect="on"
                            type="text"
                            onIonChange={(e) => {
                              const newPreviousTeamsTrained = [
                                ...previousTeamsTrained,
                              ];
                              newPreviousTeamsTrained[index] = {
                                ...newPreviousTeamsTrained[index],
                                city: e.detail.value,
                              };
                              setPreviousTeamsTrained(newPreviousTeamsTrained);
                            }}
                          ></IonInput>
                        </IonItem>
                      </div>
                    );
                  })}
                  <IonRow>
                    <IonCol size="4">
                      {previousTeamsTrained.length > 1 ? (
                        <IonLabel
                          style={{ color: '#2F736F', fontWeight: 'bold' }}
                          onClick={(e) => {
                            // setSinglePrevTeamStateDropdownField([
                            //   ...singlePrevTeamStateDropdownField.slice(0, -1),
                            // ]);
                            // setSinglePrevTeamPositionDropdownField([
                            //   ...singlePrevTeamPositionDropdownField.slice(
                            //     0,
                            //     -1
                            //   ),
                            // ]);
                            setPreviousTeamsTrained([
                              ...previousTeamsTrained.slice(
                                0,
                                previousTeamsTrained.length - 1
                              ),
                            ]);
                            setInvalidEndYearIdsTrained(
                              invalidEndYearIdsTrained.filter(
                                (id) => id !== previousTeamsTrained.length - 1
                              )
                            );
                            setInvalidStartYearIds(
                              invalidEndYearIdsTrained.filter(
                                (id) => id !== previousTeamsTrained.length - 1
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
                          // setSinglePrevTeamStateDropdownField([
                          //   ...singlePrevTeamStateDropdownField,
                          //   "",
                          // ]);
                          // setSinglePrevTeamPositionDropdownField([
                          //   ...singlePrevTeamPositionDropdownField,
                          //   "",
                          // ]);
                          const newPreviousTeamsTrained = [
                            ...previousTeamsTrained,
                          ];
                          newPreviousTeamsTrained.push({
                            team: '',
                            startYear: null,
                            endYear: null,
                            position: '',
                            school: '',
                            state: '',
                          });
                          setPreviousTeamsTrained(newPreviousTeamsTrained);
                          const elem: any = e.target;
                          setTimeout(() => {
                            elem.scrollIntoView({
                              block: 'end',
                              inline: 'nearest',
                            });
                          }, 100);
                          // setNumberOfTeamsPlayedFor(numberOfTeamsPlayedFor + 1);
                        }}
                      >
                        + Add Team
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonList>
              </IonAccordion>
            </div>
            <div className="urp-section">
              <IonAccordion id="playing-experience" value="playing-experience">
                <IonItem
                  lines="none"
                  slot="header"
                  className="urp-section-head"
                  onClick={(e) => scollToSection('playing-experience')}
                >
                  <span className="urp-step-num">3</span>
                  <h5 className="urp-section-title">Playing Experience</h5>
                </IonItem>

                <IonList className="urp-list-input" slot="content">
                  {/* <IonItem className="urp-input" lines="full">
                    <IonLabel className="urp-signup-label" position="stacked">
                      Bio
                    </IonLabel>
                    <IonTextarea
                      value={bio}
                      autoGrow={true}
                      onIonChange={(e) => setBio(e.detail.value!)}
                      autocapitalize="on sentence"
                      spellcheck={true}
                      placeholder="Your Bio..."
                      maxlength={600}
                      inputmode="text"
                    ></IonTextarea>
                  </IonItem> */}
                  {previousTeams.map((element: any, index: any) => {
                    return (
                      <div key={index}>
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
                            position="stacked"
                          >
                            Last Team
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
                            }}
                            // required
                          ></IonInput>
                        </IonItem>
                        <IonItem className="urp-input" lines="none">
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
                                    className="urp-signup-label"
                                    position="stacked"
                                  >
                                    Start Year
                                  </IonLabel>
                                  <IonInput
                                    inputmode="numeric"
                                    placeholder="YYYY"
                                    type="number"
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
                                        startYear: parseInt(value),
                                      };
                                      setPreviousTeams(newPreviousTeams);
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
                                    className="urp-signup-label"
                                    position="stacked"
                                  >
                                    End Year
                                  </IonLabel>
                                  <IonInput
                                    inputmode="numeric"
                                    placeholder="YYYY"
                                    type="number"
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
                                        endYear: parseInt(value),
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
                                    className="urp-signup-label"
                                    position="stacked"
                                  >
                                    Position(s)
                                    <span className="urp-optional">
                                      Seperate with comma
                                    </span>
                                  </IonLabel>
                                  <IonInput
                                    value={previousTeams[index].position.join(
                                      ','
                                    )}
                                    placeholder="Position"
                                    autocapitalize="on word"
                                    autocorrect="on"
                                    type="text"
                                    onIonChange={(e) => {
                                      const newPreviousTeams = [
                                        ...previousTeams,
                                      ];
                                      newPreviousTeams[index] = {
                                        ...newPreviousTeams[index],
                                        position: e.detail.value!.split(','),
                                      };
                                      setPreviousTeams(newPreviousTeams);
                                    }}
                                  ></IonInput>
                                </IonItem>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonItem>
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
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
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
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
                        <IonItem className="urp-input" lines="full">
                          <IonLabel
                            className="urp-signup-label"
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
                          style={{ color: '#2F736F', fontWeight: 'bold' }}
                          onClick={(e) => {
                            // setSinglePrevTeamStateDropdownField([
                            //   ...singlePrevTeamStateDropdownField.slice(0, -1),
                            // ]);
                            // setSinglePrevTeamPositionDropdownField([
                            //   ...singlePrevTeamPositionDropdownField.slice(
                            //     0,
                            //     -1
                            //   ),
                            // ]);
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
                          // setSinglePrevTeamStateDropdownField([
                          //   ...singlePrevTeamStateDropdownField,
                          //   "",
                          // ]);
                          // setSinglePrevTeamPositionDropdownField([
                          //   ...singlePrevTeamPositionDropdownField,
                          //   "",
                          // ]);
                          const newPreviousTeams = [...previousTeams];
                          newPreviousTeams.push({
                            startYear: '',
                            endYear: '',
                            position: [],
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
                          // setNumberOfTeamsPlayedFor(numberOfTeamsPlayedFor + 1);
                        }}
                      >
                        + Add Team
                      </IonLabel>
                    </IonCol>
                  </IonRow>
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
                    signUpTrainer();
                  }}
                  color={btnColor}
                  className="urp-green-btn"
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
                    editTrainer();
                  }}
                  color={btnColor}
                  className="urp-green-btn"
                >
                  Save
                </IonButton>
              </div>
            )}
          </IonAccordionGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SignUpTrainer;
