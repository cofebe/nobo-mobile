import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, useIonViewWillEnter, IonCol, IonRow, IonModal } from '@ionic/react';
import './AccountSettings.scss';
import './AccountSetings.css';
import { UserService } from '../services/UserService';
import { User } from '../models';
import Header from '../components/Header';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';

const AccountSettings: React.FC = () => {
	const history = useHistory();
	const userService = new UserService();
	const [selectedExperienceArray, setBrandSelectArray] = useState<string[]>([]);
	const [expOptionSelected, setExpOptionSelected] = useState('');
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [userName, setUserName] = useState('')
	const [email, setEmail] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [password, setPassword] = useState('')
	const [comfirmPassword, setComfirmPassword] = useState('')




	useIonViewWillEnter(() => {
		userService.getMe()
			.then((user: User) => {
				setFirstName(user.firstName)
				setLastName(user.lastName)
				setEmail(user.email)
				setUserName(user.displayName)

			})
			.then(() => {

			})
	});






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
		userService
			.experience(expOptionSelected)
			.then((user: User) => {
				if (user) {
					console.log(user);
				}
			})
			.catch((err: any) => {
				console.log('experience error', err);
			});
	};





	return (
		<IonPage className="account-settings-container">
			<Header title="ACCOUNT SETTINGS" />
			<IonContent className="account-settings-content">
				<div className="acc-settings-input-box" style={{ marginTop: '50px' }}>
					<div className="acc-text-input-box">
						<p className="acc-text-input-title">FIRST NAME</p>
						<Input
							type="text"
							value={firstName}
							className={`nobo-input `}
							placeholder="FIRST NAME"
							onChange={(e) => setFirstName(e)}
						/>
					</div>

					<div className="acc-text-input-box">
						<p className="acc-text-input-title">LAST NAME</p>
						<Input
							type="text"
							value={lastName}
							className={`nobo-input `}
							placeholder="LAST NAME"
							onChange={e => { }}
						/>
					</div>

					<div className="acc-text-input-box">
						<p className="acc-text-input-title">USERNAME</p>
						<Input
							type="text"
							value={userName}
							className={`nobo-input `}
							placeholder="USERNAME"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-text-input-box">
						<p className="acc-text-input-title">EMAIL</p>
						<Input
							type="email"
							value={email}
							className={`nobo-input `}
							placeholder="EMAIL"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-text-input-box">
						<p className="acc-text-input-title">PHONE NUMBER</p>
						<Input
							type="tel"
							value={phoneNumber}
							className={`nobo-input `}
							placeholder="PHONE NUMBER"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-change-password-box">
						<p className="acc-change-password-text" id="open-modal">CHANGE PASSWORD</p>
						<img height={15} src="assets/images/account-change-password.png" alt="" />
					</div>
				</div>
				<IonRow style={{ width: '350px', margin: 'auto' }}>
					<div className="acc-experience-title">EXPERIENCE</div>
				</IonRow>

				<div className="acc-experience-option-box">
					<div
						className="acc-experience-optons"
						onClick={() => {
							handleTicker('women');
						}}
					>
						<img className="acc-experience-optons-img" src="assets/images/women2.png" alt="women" />

						<div className="acc-experience-option-ticker">
							<Checkbox value={expOptionSelected === 'women'} onChange={e => { }} />
						</div>
					</div>
					<div
						className="acc-experience-optons"
						onClick={() => {
							handleTicker('men');
						}}
					>
						<img
							className="acc-experience-optons-img"
							src="assets/images/men2.png"
							alt="sneakers"
						/>

						<div className="acc-experience-option-ticker">
							<Checkbox value={expOptionSelected === 'men'} onChange={e => { }} />
						</div>
					</div>
					<div
						className="acc-experience-optons"
						onClick={() => {
							handleTicker('sneakers');
						}}
					>
						<img
							className="acc-experience-optons-img"
							src="assets/images/sneakers2.png"
							alt="sneakers"
						/>

						<div className="acc-experience-option-ticker">
							<Checkbox value={expOptionSelected === 'sneakers'} onChange={e => { }} />
						</div>
					</div>
				</div>
				<div style={{ width: '300px', margin: 'auto' }}>
					<Button
						className="acc-settings-btn"
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
			<IonModal trigger="open-modal" initialBreakpoint={0.8} breakpoints={[0, 1]}>
				<div className="acc-password-change-box" >
					<p style={{ fontWeight: 700, fontSize: '22px' }} className='acc-password-change-title' >NEW PASSWORD</p>
					<div className="acc-password-change-input">
						<Input
							type="text"
							value={password}
							className={`nobo-input `}
							placeholder="PASSWORD"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-password-change-input">
						<Input
							type="text"
							value={password}
							className={`nobo-input `}
							placeholder="NEW PASSWORD"
							onChange={e => { }}
						/>
					</div>

					<div className="acc-password-change-input" >
						<Input
							type="text"
							value={comfirmPassword}
							className={`nobo-input `}
							placeholder="COMFIRM PASSWORD"
							onChange={e => { }}
						/>
					</div>
					<div className="acc-password-btn-box" >
						<Button

							className="acc-settings-btn"
							label="SAVE"
							large={true}
							onClick={e => {
								e.preventDefault();
								// handleSubmit();
							}}
						// disabled={expOptionSelected === ''}
						/>
					</div>
				</div>
			</IonModal>
		</IonPage>
	);
};

export default AccountSettings;
