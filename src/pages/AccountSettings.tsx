import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, useIonViewWillEnter, IonCol, IonRow, IonModal, IonGrid, IonHeader, useIonViewDidEnter } from '@ionic/react';
import './AccountSettings.scss';
import './AccountSetings.css';
import { UserService } from '../services/UserService';
import { ExperienceResponse, User, UserAccData } from '../models';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';




const AccountSettings: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [selectedExperienceArray, setSelectedExpArray] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [displayName, setdisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNum] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [comfirmPassword, setComfirmPassword] = useState('')
  const [wrongPassword, seTwrongPassword] = useState(false)



  const modal = useRef<HTMLIonModalElement>(null)
  const dismiss = () => {
    modal.current?.dismiss()
  }


  const data: UserAccData = {
    firstName,
    lastName,
    displayName,
    email,
    phoneNumber,
    saleSchedule: [],
    experiencePreferences: selectedExperienceArray[0],
    currentPassword,
    newPassword
  }



  useIonViewWillEnter(() => {
    userService.getMe()
      .then((user: User) => {
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setEmail(user.email)
        setdisplayName(user.displayName)
        setPhoneNum(user.phoneNumber)
      })
      .catch((error) => {
        console.log(error)
      })
  });


  const handleTicker:any = (expId: string) => {
    if (!selectedExperienceArray.includes(expId, 0)) {
      setSelectedExpArray([expId])
    } else if (selectedExperienceArray.includes(expId, 0)) {
      const updatedRemove = selectedExperienceArray.filter((expOption) => expOption !== expId)
      setSelectedExpArray(updatedRemove)
    }
  };

  useIonViewDidEnter(() => {
    userService.getMe()
      .then((user: User) => {
        if (!selectedExperienceArray.includes(user.experiencePreferences, 0)) {
          setSelectedExpArray([user.experiencePreferences])
        } else if (selectedExperienceArray.includes(user.experiencePreferences, 0)) {
          const updatedRemove = selectedExperienceArray.filter((expOption) => expOption !== user.experiencePreferences)
          setSelectedExpArray(updatedRemove)
        }
      })
  })

  const handleSubmit = async (data: UserAccData) => {
    userService
      .updateUserAccount(data)
      .then((user: ExperienceResponse) => {
        if (user.passwordError) {
          seTwrongPassword(true)
          // console.log('password incorrect');
        } else {
          // console.log('success',user.currentUser)
          dismiss()
          setComfirmPassword('')
          setNewPassword('')
          setCurrentPassword('')
        }
      })
      .catch((err: any) => {
        console.log('experience error', err);
      });
  };


  const validate = () => {
    if (
      firstName === ''
      && lastName === ''
      && displayName === ''
      && email === ''
      && phoneNumber === ''
      && selectedExperienceArray[0] === ''
      && currentPassword === ''
      && newPassword === ''
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <IonPage className='account-settings-container'>
      <IonContent className='account-settings-content'>
        {/* --------------------HEADER----------------------- */}
        <IonRow >
          <IonCol style={{ height: '118px' }} size='12'>
            <div
              className='account-settings-back-btn'
              onClick={() => {
                history.goBack()
              }}
            >
              <img
                height={23}
                src='assets/images/arrow-left.svg'
                alt='logo'
              />
            </div>

            <IonCol className='account-settings-title-text-container'>ACCOUNT SETTINGS</IonCol>
          </IonCol>
        </IonRow>


        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
          <IonRow className='acc-settings-input-box' >
            <IonCol sizeXs='12' sizeLg='6' className='acc-text-input-box'>
              <p className='acc-text-input-title'>FIRST NAME</p>
              <Input
                type='text'
                value={firstName}
                className={`custom-input-name nobo-input`}
                placeholder='FIRST NAME'
                onChange={(e) => setFirstName(e)}
              />
            </IonCol>

            <IonCol sizeLg='6' sizeXs='12' className='acc-text-input-box'>
              <p className='acc-text-input-title'>LAST NAME</p>
              <Input
                type='text'
                value={lastName}
                className={`custom-input-name nobo-input`}
                placeholder='LAST NAME'
                onChange={(e) => setLastName(e)}
              />
            </IonCol>

            <IonCol sizeLg='6' sizeXs='12' className='acc-text-input-box'>
              <p className='acc-text-input-title'>USERNAME</p>
              <Input
                type='text'
                value={displayName}
                className={`custom-input-name nobo-input`}
                placeholder='USERNAME'
                onChange={e => setdisplayName(e)}
              />
            </IonCol>
            <IonCol sizeLg='6' sizeXs='12' className='acc-text-input-box'>
              <p className='acc-text-input-title'>EMAIL</p>
              <Input
                type='email'
                value={email}
                className={`custom-input-name nobo-input`}
                placeholder='EMAIL'
                onChange={e => setEmail(e)}
              />
            </IonCol>
            <IonCol sizeLg='6' sizeXs='12' className='acc-text-input-box'>
              <p className='acc-text-input-title'>PHONE NUMBER</p>
              <Input
                type='number'
                value={phoneNumber}
                className={`custom-input-name nobo-input`}
                placeholder='PHONE NUMBER'
                onChange={e => setPhoneNum(e)}
              />
            </IonCol>
            <IonCol size='12' className='acc-change-password-box'>
              <p className='acc-change-password-text'
               onClick={()=>{
                modal.current?.present()
              }}
              >CHANGE PASSWORD</p>
              <img height={15} src='assets/images/account-change-password.png' alt='' />
            </IonCol>
          </IonRow>
        </div>
        <IonRow style={{ width: '350px', margin: 'auto' }}>
          <IonCol size='12' className='acc-experience-title'>EXPERIENCE</IonCol>
        </IonRow>

        <div className='acc-experience-option-box'>
          <div
            className='acc-experience-optons'
            onClick={() => {
              handleTicker('women');
            }}
          >
            <img className='acc-experience-optons-img' src='assets/images/women2.png' alt='women' />

            <div className='acc-experience-option-ticker'>
              <Checkbox value={selectedExperienceArray.includes('women')} onChange={() => { }} />
            </div>
          </div>
          <div
            className='acc-experience-optons'
            onClick={() => {
              handleTicker('men');
            }}
          >
            <img
              className='acc-experience-optons-img'
              src='assets/images/men2.png'
              alt='sneakers'
            />

            <div className='acc-experience-option-ticker'>
              <Checkbox value={selectedExperienceArray.includes('men')} onChange={e => { }} />

            </div>
          </div>
          <div
            className='acc-experience-optons'
            onClick={() => {
              handleTicker('sneakers');
            }}
          >
            <img
              className='acc-experience-optons-img'
              src='assets/images/sneakers2.png'
              alt='sneakers'
            />

            <div className='acc-experience-option-ticker'>
              <Checkbox value={selectedExperienceArray.includes('sneakers')} onChange={e => { }} />
            </div>
          </div>
        </div>
        <IonRow>
          <IonCol size='12' className='acc-settings-btn-container'>
          <Button
            className='acc-settings-btn_'
            label='SAVE'
            large
            onClick={e => {
              e.preventDefault();
              handleSubmit(data);
            }}
            disabled={validate()}
          />
          </IonCol>
        </IonRow>

      </IonContent>
      <IonModal style={{borderRadius:'28px'}} className='acc-settings-main-modal' ref={modal}  initialBreakpoint={1} breakpoints={[1, 5]}>
        {/* <IonContent className='acc-password-change-box' > */}
          <IonRow style={{ paddingLeft: '20px', paddingRight: '20px', height: '500px' }}>

            <IonCol size='12'
              style={{ fontWeight: 700, fontSize: '22px', backgroundCollor: 'yellow' }}
              className='acc-password-change-title' >
              NEW PASSWORD
            </IonCol>

            <IonCol class='input-container' size='12'>
              <Input
                errorMessage={wrongPassword == true ? 'Incorrect password' : ''}
                type='password'
                value={currentPassword}
                className={`nobo-input `}
                placeholder='CURRENT PASSWORD'
                onChange={e => { setCurrentPassword(e) }}
              />
            </IonCol>

            <IonCol class='input-container' size='12'>
              <Input
                type='password'
                value={newPassword}
                className={`nobo-input `}
                placeholder='NEW PASSWORD'
                onChange={e => { setNewPassword(e) }}
              />
            </IonCol>

            <IonCol class='input-container' size='12'>
              <Input
                errorMessage={newPassword !== comfirmPassword ? 'password mismatch' : ''}
                type='password'
                value={comfirmPassword}
                className={`nobo-input `}
                placeholder='COMFIRM PASSWORD'
                onChange={e => { setComfirmPassword(e) }}
              />
            </IonCol>

            <IonCol class='input-container' size='12'>
              <Button
                className='acc-settings-btn'
                label='SAVE'
                large={true}
                onClick={e => {
                  e.preventDefault();
                  handleSubmit(data);
                  // dismiss()
                }}
                disabled={validate() || newPassword !== comfirmPassword}
              />
            </IonCol>

          </IonRow>
        {/* </IonContent> */}
      </IonModal>
    </IonPage>
  );
};

export default AccountSettings;
