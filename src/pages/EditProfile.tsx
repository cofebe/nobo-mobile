import ProfileSummary from '../components/ProfileSections/ProfileSummary';
import { useState, useRef } from 'react';
import { IonTitle, isPlatform } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { NoboProfile, emptyProfile } from '../data/nobo-profile';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  useIonActionSheet,
  useIonViewDidEnter,
  useIonViewDidLeave,
  IonIcon,
  IonButtons,
  IonModal,
  IonRow,
} from '@ionic/react';
import { AuthService } from '../services/AuthService';
import { FeedService } from '../services/FeedService';
import { UserService } from '../services/UserService';
import { ExperienceResponse, User, UserAccData } from '../models';
import './EditProfile.scss';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Toggle from '../components/Toggle';

import Select, { SelectOption } from '../components/Select';

type TopLevelCategory = 'men' | 'women' | 'sneakers' | '';

const EditProfilePage: React.FC = profile => {
  const history = useHistory();
  const authService = new AuthService();
  const feedService = new FeedService();
  const userService = new UserService();

  let [userId, setUserId] = useState<string>('');
  const [profileURL, setProfileURL] = useState('');
  let [noboProfile, setNoboProfile] = useState<NoboProfile>(emptyProfile);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNum] = useState('');
  const [selectedExperienceArray, setSelectedExpArray] = useState<string[]>([]);
  const [currentPassword, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [displayName, setDisplayName] = useState<string>('');
  const [blurbText, setBlurbText] = useState<string>('');
  const [profileBg, setProfileBg] = useState<string>('');
  const [avatar, setAvatarImage] = useState<string>('');

  const [error, setError] = useState<boolean>(false);
  const [isToggled, setIsToggled] = useState(false);

  const [itemCategory, setItemCategory] = useState<TopLevelCategory>('');

  const updatedUser: UserAccData = {
    firstName,
    lastName,
    displayName,
    email,
    phoneNumber,
    saleSchedule: [],
    experiencePreferences: selectedExperienceArray[0],
    currentPassword,
    newPassword,
    profileBg,
    avatar,
    blurbText
  }

  const fileInputProfileBg = useRef(null);
  const fileInputProfileAvatar = useRef(null);

  const onSvgClick = (inputRef: any) => {
      inputRef.current.click();
  };

  useIonViewDidEnter(() => {
    reset();
    const onPageLoad = () => {
      loadProfile();
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      return () => window.removeEventListener('load', onPageLoad);
    }
  });

  useIonViewDidLeave(() => {
    reset();
    localStorage.removeItem('newUser');
  });

  async function reportUser(reportType: string) {
    window.location.href = `mailto:support@thenobo.com?subject=${reportType}&body=${userId}`;
  }

  function reset() {
    const nonExistentID = '';
    userId = nonExistentID;
    setUserId(nonExistentID);
    setProfileURL('');
    setNoboProfile(emptyProfile);
  }

  function loadProfile() {
    const addressBarPathName = history.location.pathname;
    let userIdStr: any = addressBarPathName.substring(addressBarPathName.lastIndexOf('/') + 1);

    if (isNaN(userIdStr) && userIdStr.length > 10) {
      userIdStr = userIdStr.substring(userIdStr.lastIndexOf('-') + 1);
    } else {
      const myUserId = authService.getUserId();
      userId = myUserId || '';
    }
    const myUserId = authService.getUserId();
    userId = myUserId || '';

    setUserId(userId);
    getProfile(userId);
    return userId;
  }

  function getProfile(id: any = '') {
    userService.getMe()
      .then((user: User) => {
        if (
          !user.profileBg ||
          user.profileBg === '/NOBO_defaultcoverimage.jpeg'
        ) {
          user.profileBg = 'https://thenobo.com/NOBO_defaultcoverimage.jpeg';
        }
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNum(user.phoneNumber)
        setDisplayName(user.displayName);
        setBlurbText(user.blurbText);
        setProfileBg(user.profileBg);
        setAvatarImage(user.avatar);
      })
      .catch((error) => {
        console.log(error)
      })

    userService
      .getProfile(id)
      .then(res => res.json())
      .then(data => {
        if (data === null) {
          setNoboProfile(emptyProfile);
        } else {
          if (
            !data['user'].profileBg ||
            data['user'].profileBg === '/NOBO_defaultcoverimage.jpeg'
          ) {
            data['user'].profileBg = 'https://thenobo.com/NOBO_defaultcoverimage.jpeg';
          }
          setNoboProfile(data['user']);
          setIsToggled(false);
        }
      })
      .catch(() => {});
  }

  const onBackgroundImageFileChange = async (fileChangeEvent: any, index: number) => {
    const file = fileChangeEvent.target.files;
    const obj = new FormData();
    obj.append('file', file[0]);
    const response = await feedService.uploadImage(obj);
    const returnValues = await response.json();

    try {
      const newPostImage: string = returnValues?.url;
      if (newPostImage) {
        setProfileBg(newPostImage);
        setIsToggled(true);
      }
    } catch (exPostImages) {
      console.log('There was an issue sending the image.');
    }
  };

  const onAvatarImageFileChange = async (fileChangeEvent: any, index: number) => {
    const file = fileChangeEvent.target.files;
    const obj = new FormData();
    obj.append('file', file[0]);
    const response = await feedService.uploadImage(obj);
    const returnValues = await response.json();

    try {
      const newPostImage: string = returnValues?.url;
      if (newPostImage) {
        setAvatarImage(newPostImage);
        setIsToggled(true);
      }
    } catch (exPostImages) {
      console.log('There was an issue sending the image.');
    }
  };

  function save() {
    userService
      .updateUserAccount(updatedUser)
      .then((user: ExperienceResponse) => {
        console.log("UpdateUserAccount Request: ", user)
      })
      .catch((err: any) => {
        console.log('experience error', err);
      });

    userService
      .updateProfileBackground({imgUrl: profileBg})
      .then((user: ExperienceResponse) => {
        console.log("updateProfileBackground Request: ", user)
      })
      .catch((err: any) => {
        console.log('experience error', err);
      });

    userService
      .updateAvatar({imgUrl: avatar})
      .then((user: ExperienceResponse) => {
        console.log("updateAvatar Request: ", user)
      })
      .catch((err: any) => {
        console.log('experience error', err);
      });

    userService
      .updateBlurb({textVal: blurbText})
      .then((user: ExperienceResponse) => {
        console.log("updateBlurb Request: ", user)
      })
      .catch((err: any) => {
        console.log('experience error', err);
      });
  }

  const handleClick = () => {
      setIsToggled(!isToggled);
  }

  return (
    <IonPage className="stylefeed-page" style={{background: "#fefcf7"}}>
      <div
        className="profile-banner-container"
        style={{ backgroundImage: `url(${profileBg})` }}
      >
        <div className="edit-profile-back" onClick={() => { history.goBack() }}>
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_3086_14171)">
                  <path stroke="gray" stroke-width="0.5" d="M1.11144e-06 18.2083L1.6979e-06 4.79167C0.00152345 3.5213 0.506846 2.30341 1.40513 1.40513C2.30341 0.506844 3.52131 0.00152085 4.79167 -7.95911e-07L18.2083 -2.0945e-07C19.4787 0.00152154 20.6966 0.506845 21.5949 1.40513C22.4932 2.30341 22.9985 3.52131 23 4.79167L23 18.2083C22.9985 19.4787 22.4932 20.6966 21.5949 21.5949C20.6966 22.4932 19.4787 22.9985 18.2083 23L4.79167 23C3.52131 22.9985 2.30341 22.4932 1.40513 21.5949C0.506845 20.6966 0.00152275 19.4787 1.11144e-06 18.2083V18.2083ZM21.0833 4.79167C21.0833 4.02917 20.7804 3.2979 20.2413 2.75873C19.7021 2.21957 18.9708 1.91667 18.2083 1.91667L4.79167 1.91667C4.02917 1.91667 3.2979 2.21957 2.75874 2.75873C2.21957 3.2979 1.91667 4.02917 1.91667 4.79167L1.91667 18.2083C1.91667 18.9708 2.21957 19.7021 2.75874 20.2413C3.2979 20.7804 4.02917 21.0833 4.79167 21.0833L18.2083 21.0833C18.9708 21.0833 19.7021 20.7804 20.2413 20.2413C20.7804 19.7021 21.0833 18.9708 21.0833 18.2083L21.0833 4.79167ZM7.66667 11.5C7.66595 10.7985 7.92234 10.121 8.38733 9.59579C8.66621 9.28242 8.93742 8.98533 9.13196 8.79079L11.8383 6.0375C12.0186 5.86806 12.2576 5.77495 12.505 5.77768C12.7525 5.7804 12.9893 5.87873 13.1659 6.0521C13.3424 6.22547 13.4451 6.46042 13.4524 6.70778C13.4597 6.95514 13.371 7.19572 13.2049 7.37917L10.4938 10.1392C10.3145 10.3193 10.0711 10.5877 9.82292 10.8665C9.66849 11.0416 9.58328 11.267 9.58328 11.5005C9.58328 11.7339 9.66849 11.9593 9.82292 12.1344C10.0702 12.4123 10.3136 12.6807 10.487 12.8551L13.2049 15.6208C13.299 15.7092 13.3742 15.8157 13.4261 15.934C13.4781 16.0522 13.5056 16.1796 13.507 16.3087C13.5084 16.4378 13.4837 16.5659 13.4344 16.6852C13.3851 16.8046 13.3122 16.9127 13.2201 17.0031C13.1279 17.0936 13.0185 17.1645 12.8983 17.2116C12.7781 17.2587 12.6496 17.281 12.5205 17.2772C12.3915 17.2734 12.2645 17.2436 12.1473 17.1895C12.03 17.1354 11.9249 17.0582 11.8383 16.9625L9.12717 14.2035C8.9355 14.0118 8.66717 13.7176 8.39021 13.4052C7.92372 12.8802 7.66624 12.2023 7.66667 11.5V11.5Z" fill="white"/>
              </g>
              <defs>
                  <clipPath id="clip0_3086_14171">
                      <rect width="23" height="23" fill="white" transform="translate(23) rotate(90)"/>
                  </clipPath>
              </defs>
          </svg>
        </div>
        <div className="profile-banner-container-edit">
          <svg onClick={() => onSvgClick(fileInputProfileBg)} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14.5" fill="#D6980E" stroke="white"/>
            <g clip-path="url(#clip0_280_10303)">
            <path d="M14.5 18.3594C12.8191 18.3594 11.4531 16.9934 11.4531 15.3125C11.4531 13.6316 12.8191 12.2656 14.5 12.2656C16.1809 12.2656 17.5469 13.6316 17.5469 15.3125C17.5469 16.9934 16.1809 18.3594 14.5 18.3594ZM14.5 13.0781C13.2686 13.0781 12.2656 14.0811 12.2656 15.3125C12.2656 16.5439 13.2686 17.5469 14.5 17.5469C15.7314 17.5469 16.7344 16.5439 16.7344 15.3125C16.7344 14.0811 15.7314 13.0781 14.5 13.0781ZM13.6875 15.3125C13.6875 14.8656 14.0531 14.5 14.5 14.5C14.7234 14.5 14.9062 14.3172 14.9062 14.0938C14.9062 13.8703 14.7234 13.6875 14.5 13.6875C13.6037 13.6875 12.875 14.4162 12.875 15.3125C12.875 15.5359 13.0578 15.7188 13.2812 15.7188C13.5047 15.7188 13.6875 15.5359 13.6875 15.3125ZM16.2342 9.625C16.318 9.625 16.3941 9.67832 16.4246 9.75703L16.9857 11.25H19.7812C20.0047 11.25 20.1875 11.4328 20.1875 11.6562V18.9688C20.1875 19.1922 20.0047 19.375 19.7812 19.375H9.21875C8.99531 19.375 8.8125 19.1922 8.8125 18.9688V11.6562C8.8125 11.4328 8.99531 11.25 9.21875 11.25H12.0168L12.5271 9.88906C12.5855 9.73164 12.7379 9.625 12.908 9.625H16.2342ZM16.2342 8.8125H12.908C12.4002 8.8125 11.9457 9.12734 11.768 9.60215L11.4531 10.4375H9.21875C8.5459 10.4375 8 10.9834 8 11.6562V18.9688C8 19.6416 8.5459 20.1875 9.21875 20.1875H19.7812C20.4541 20.1875 21 19.6416 21 18.9688V11.6562C21 10.9834 20.4541 10.4375 19.7812 10.4375H17.5469L17.1838 9.47266C17.0365 9.07402 16.6582 8.8125 16.2342 8.8125Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_280_10303">
            <rect width="13" height="13" fill="white" transform="translate(8 8)"/>
            </clipPath>
            </defs>
          </svg>
          <input
            className="upload-input nobo-file-upload post-image"
            id="upload-input"
            type="file"
            accept="image/*"
            ref={fileInputProfileBg}
            onChange={e => onBackgroundImageFileChange(e, 0)}
          />
        </div>
      </div>
      <div className="profile-bubble-container">
        <div className="profile-bubble-container-edit">
          <svg onClick={() => onSvgClick(fileInputProfileAvatar)} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14.5" fill="#D6980E" stroke="white"/>
            <g clip-path="url(#clip0_280_10303)">
            <path d="M14.5 18.3594C12.8191 18.3594 11.4531 16.9934 11.4531 15.3125C11.4531 13.6316 12.8191 12.2656 14.5 12.2656C16.1809 12.2656 17.5469 13.6316 17.5469 15.3125C17.5469 16.9934 16.1809 18.3594 14.5 18.3594ZM14.5 13.0781C13.2686 13.0781 12.2656 14.0811 12.2656 15.3125C12.2656 16.5439 13.2686 17.5469 14.5 17.5469C15.7314 17.5469 16.7344 16.5439 16.7344 15.3125C16.7344 14.0811 15.7314 13.0781 14.5 13.0781ZM13.6875 15.3125C13.6875 14.8656 14.0531 14.5 14.5 14.5C14.7234 14.5 14.9062 14.3172 14.9062 14.0938C14.9062 13.8703 14.7234 13.6875 14.5 13.6875C13.6037 13.6875 12.875 14.4162 12.875 15.3125C12.875 15.5359 13.0578 15.7188 13.2812 15.7188C13.5047 15.7188 13.6875 15.5359 13.6875 15.3125ZM16.2342 9.625C16.318 9.625 16.3941 9.67832 16.4246 9.75703L16.9857 11.25H19.7812C20.0047 11.25 20.1875 11.4328 20.1875 11.6562V18.9688C20.1875 19.1922 20.0047 19.375 19.7812 19.375H9.21875C8.99531 19.375 8.8125 19.1922 8.8125 18.9688V11.6562C8.8125 11.4328 8.99531 11.25 9.21875 11.25H12.0168L12.5271 9.88906C12.5855 9.73164 12.7379 9.625 12.908 9.625H16.2342ZM16.2342 8.8125H12.908C12.4002 8.8125 11.9457 9.12734 11.768 9.60215L11.4531 10.4375H9.21875C8.5459 10.4375 8 10.9834 8 11.6562V18.9688C8 19.6416 8.5459 20.1875 9.21875 20.1875H19.7812C20.4541 20.1875 21 19.6416 21 18.9688V11.6562C21 10.9834 20.4541 10.4375 19.7812 10.4375H17.5469L17.1838 9.47266C17.0365 9.07402 16.6582 8.8125 16.2342 8.8125Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_280_10303">
            <rect width="13" height="13" fill="white" transform="translate(8 8)"/>
            </clipPath>
            </defs>
          </svg>
          <input
            className="upload-input nobo-file-upload post-image"
            id="upload-input"
            type="file"
            accept="image/*"
            ref={fileInputProfileAvatar}
            onChange={e => onAvatarImageFileChange(e, 0)}
          />
        </div>

        <img className="profile-bubble" src={avatar} alt="avatar" />
      </div>
      <div className="edit-profile-content">
        <Input
          value={firstName}
          className={`nobo-input nobo-input-padding ${error ? 'invalid-text-color' : 'nobo-input2'}`}
          placeholder="First Name"
          onChange={val => {
            setFirstName(val);
            if (val !== noboProfile.firstName)
              setIsToggled(true);
          }}
        />
        <Input
          value={lastName}
          className={`nobo-input nobo-input-padding ${error ? 'invalid-text-color' : 'nobo-input2'}`}
          placeholder="Last Name"
          onChange={val => {
            setLastName(val);
            if (val !== noboProfile.lastName)
              setIsToggled(true);
          }}
        />
        <Input
          value={displayName}
          className={`nobo-input nobo-input-padding ${error ? 'invalid-text-color' : 'nobo-input2'}`}
          placeholder="Username"
          onChange={val => {
            setDisplayName(val);
            if (val !== noboProfile.displayName) {
              setIsToggled(true);
            }
          }}
        />
        <Textarea
          value={blurbText}
          className={`nobo-input nobo-input-padding edit-profile-nobo-input ${error ? 'invalid-text-color' : 'nobo-input2'}`}
          placeholder="Bio"
          onChange={val => {
            setBlurbText(val);
            if (val !== noboProfile.blurbText)
              setIsToggled(true);
          }}
        />

{/*        <div className="row-container">
          <span>SHOES</span>
          <Toggle
              labelOne="SHOW"
              labelTwo="HIDE"
              className={`test-button-toggle ${isToggled ? 'checked' : ''}`}
              isToggled={isToggled}
              onClick={handleClick}>
          </Toggle>
        </div>
        <Select
          value={itemCategory}
          placeholder="Select Category"
          onChange={e => {
          }}
          options={[
            {
              label: 'Men',
              value: 'men',
            },
            {
              label: 'Women',
              value: 'women',
            },
            {
              label: 'Sneakers',
              value: 'sneakers',
            },
          ]}
        />

        <div className="row-container">
          <span>DRESSES</span>
          <Toggle
              labelOne="SHOW"
              labelTwo="HIDE"
              className={`test-button-toggle ${isToggled ? 'checked' : ''}`}
              isToggled={isToggled}
              onClick={handleClick}>
          </Toggle>
        </div>
        <Select
          value={itemCategory}
          placeholder="Select Category"
          onChange={e => {
          }}
          options={[
            {
              label: 'Men',
              value: 'men',
            },
            {
              label: 'Women',
              value: 'women',
            },
            {
              label: 'Sneakers',
              value: 'sneakers',
            },
          ]}
        />

        <div className="row-container">
          <span>TOPS</span>
          <Toggle
              labelOne="SHOW"
              labelTwo="HIDE"
              className={`test-button-toggle ${isToggled ? 'checked' : ''}`}
              isToggled={isToggled}
              onClick={handleClick}>
          </Toggle>
        </div>
        <Select
          value={itemCategory}
          placeholder="Select Category"
          onChange={e => {
          }}
          options={[
            {
              label: 'Men',
              value: 'men',
            },
            {
              label: 'Women',
              value: 'women',
            },
            {
              label: 'Sneakers',
              value: 'sneakers',
            },
          ]}
        />

        <div className="row-container">
          <span>Bottoms</span>
          <Toggle
              labelOne="SHOW"
              labelTwo="HIDE"
              className={`test-button-toggle ${isToggled ? 'checked' : ''}`}
              isToggled={isToggled}
              onClick={handleClick}>
          </Toggle>
        </div>
        <Select
          value={itemCategory}
          placeholder="Select Category"
          onChange={e => {
          }}
          options={[
            {
              label: 'Men',
              value: 'men',
            },
            {
              label: 'Women',
              value: 'women',
            },
            {
              label: 'Sneakers',
              value: 'sneakers',
            },
          ]}
        />*/}
        <IonButton className='btn edit-profile-btn' 
          disabled={!isToggled}
          onClick={() => {
            history.push('/home/my-profile')
            save();
        }}>SAVE</IonButton>
      </div>    
  </IonPage>
  );
};

export default EditProfilePage;
