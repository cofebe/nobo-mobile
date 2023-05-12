import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonContent, IonPage, useIonViewWillEnter, IonCol, IonRow } from '@ionic/react';
import './AccountSettings.scss';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { User } from '../models';
import Header from '../components/Header';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';

const AccountSettings: React.FC = () => {
	const history = useHistory();
	const userService = new UserService();
	const authService = new AuthService();
	const [user, setUser] = useState<User>();
	const [selectedExperienceArray, setBrandSelectArray] = useState<string[]>([]);
  const [expOptionSelected, setExpOptionSelected] = useState('');

	// Handling the ticker
  const handleTicker = (experienceOption: string) => {
    if (!selectedExperienceArray.includes(experienceOption, 0)) {
      selectedExperienceArray.push(experienceOption);
    } else {
      const experienceItem = selectedExperienceArray.filter(brand => brand === experienceOption);
      setExpOptionSelected(experienceItem[0]);
    }
  };

	const handleSubmit = async () => {
    // userService
    //   .experience(expOptionSelected)
    //   .then((user: User) => {
    //     if (user) {
    //       console.log(user);

    //       history.push('/profile-picture');
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log('experience error', err);
    //   });
  };


	useIonViewWillEnter(() => {
		userService.getMe().then(user => {
			setUser(user);
		});
	});
	return (
		<IonPage className="account-settings-container">
			<Header title="ACCOUNT SETTINGS" />
			<IonContent className="account-settings-content">
				<div className="acc-settings-input-box" style={{marginTop:'50px'}}>

					<div className="acc-text-input-box">
						<p className="acc-text-input-title">FIRST NAME</p>
						<Input
							type="number"
							// value={person.password}
							className={`nobo-input `}
							placeholder='FIRST NAME'
							onChange={e => { }}
						/>
					</div>

					<div className="acc-text-input-box">
						<p className="acc-text-input-title">LAST NAME</p>
						<Input
							type="number"
							// value={person.password}
							className={`nobo-input `}
							placeholder='LAST NAME'
							onChange={e => { }}
						/>
					</div>

					<div className="acc-text-input-box">
						<p className="acc-text-input-title">USERNAME</p>
						<Input
							type="number"
							// value={person.password}
							className={`nobo-input `}
							placeholder='USERNAME'
							onChange={e => { }}
						/>
					</div>
					<div className="acc-text-input-box">
						<p className="acc-text-input-title">EMAIL</p>
						<Input
							type="email"
							// value={person.password}
							className={`nobo-input `}
							placeholder="EMAIL"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-text-input-box">
						<p className="acc-text-input-title">PHONE NUMBER</p>
						<Input
							type="number"
							// value={person.password}
							className={`nobo-input `}
							placeholder="PHONE NUMBER"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-change-password-box">
						<p className='acc-change-password-text'>CHANGE PASSWORD</p>
						<img height={15} src="assets/images/account-change-password.png" alt="" />
					</div>
				</div>
				<IonRow style={{ width: '350px', margin: 'auto' }}>
					<div className="acc-experience-title">EXPERIENCE</div>
				</IonRow>

				<div className="acc-experience-option-box" >

					<div
						className='acc-experience-optons'
						onClick={() => {
							handleTicker('women');
						}}
					>
						<img
							className='acc-experience-optons-img'
							src="assets/images/women2.png"
							alt="women"
						/>

						<div className='acc-experience-option-ticker'>
							<Checkbox value={expOptionSelected === 'women'} onChange={e => {}} />
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
							src="assets/images/men2.png"
							alt="sneakers"
						/>

						<div className='acc-experience-option-ticker'>
							<Checkbox value={expOptionSelected === 'men'} onChange={e => {}} />
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
							src="assets/images/sneakers2.png"
							alt="sneakers"
						/>

						<div className='acc-experience-option-ticker'>
							<Checkbox value={expOptionSelected === 'sneakers'} onChange={e => {}} />
						</div>
					</div>

				</div>
				<div style={{width:'300px', margin:'auto'}}>
				<Button
            className="experience-btn"
            label="SAVE"
            large
            onClick={e => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={expOptionSelected === ''}
          />
				</div>
			</IonContent>
		</IonPage>
	);
};

export default AccountSettings;
