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
	const [selectedExperienceArray, setBrandSelectArray] = useState<string[]>([]);
	const [expOptionSelected, setExpOptionSelected] = useState('');
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [displayName, setdisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [phoneNumber, setCurrentPassword] = useState('')
	const [currentPassword, setPassword] = useState('')
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
		experiencePreferences: expOptionSelected,
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

				if (!selectedExperienceArray.includes(user.experiencePreferences, 0)) {
					selectedExperienceArray.push(user.experiencePreferences);
				} else {
					const experienceItem = selectedExperienceArray.filter(brand => brand === user.experiencePreferences);
					setExpOptionSelected(experienceItem[0]);
				}


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

	useIonViewDidEnter(() => {
		userService.getMe()
			.then((user: User) => {
				handleTicker(user.experiencePreferences)
				if (!selectedExperienceArray.includes(user.experiencePreferences, 0)) {
					selectedExperienceArray.push(user.experiencePreferences);
				} else {
					const experienceItem = selectedExperienceArray.filter(brand => brand === user.experiencePreferences);
					setExpOptionSelected(experienceItem[0]);
				}
			})
	})

	const handleSubmit = async (data: UserAccData) => {
		userService
			.updateUserAccount(data)
			.then((user: ExperienceResponse) => {
				if (user.passwordError) {
					seTwrongPassword(true)
					console.log("password incorrect");
				} else {
					console.log(user.currentUser)
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
			&& expOptionSelected === ''
			&& currentPassword === ''
			&& newPassword === ''
		) {
			return true
		} else {
			return false
		}
	}

	return (
		<IonPage className="account-settings-container">
			<IonContent className="account-settings-content">
				{/* --------------------HEADER----------------------- */}
				<IonRow >
					<IonCol style={{ height: '118px' }} size='12'>
						<div
						className="account-settings-back-btn"
							onClick={() => {
								console.log('click')
								history.goBack()
							}}
						>
							<img
								height={23}
								src="assets/images/arrow-left.svg"
								alt="logo"
							/>
						</div>

						<IonCol className='account-settings-title-text-container'>ACCOUNT SETTINGS</IonCol>
					</IonCol>
				</IonRow>


					<div style={{marginLeft:'10px', marginRight:'10px'}}>
				<IonRow className="acc-settings-input-box" >
					<IonCol sizeXs='12' sizeLg='6' className="acc-text-input-box">
						<p className="acc-text-input-title">FIRST NAME</p>
						<Input
							type="text"
							value={firstName}
							className={`nobo-input `}
							placeholder="FIRST NAME"
							onChange={(e) => setFirstName(e)}
						/>
					</IonCol>

					<IonCol sizeLg='6' sizeXs='12' className="acc-text-input-box">
						<p className="acc-text-input-title">LAST NAME</p>
						<Input
							type="text"
							value={lastName}
							className={`nobo-input `}
							placeholder="LAST NAME"
							onChange={(e) => setLastName(e)}
						/>
					</IonCol>

					<IonCol sizeLg='6' sizeXs='12' className="acc-text-input-box">
						<p className="acc-text-input-title">USERNAME</p>
						<Input
							type="text"
							value={displayName}
							className={`nobo-input `}
							placeholder="USERNAME"
							onChange={e => setdisplayName(e)}
						/>
					</IonCol>
					<IonCol sizeLg='6' sizeXs='12' className="acc-text-input-box">
						<p className="acc-text-input-title">EMAIL</p>
						<Input
							type="email"
							value={email}
							className={`nobo-input `}
							placeholder="EMAIL"
							onChange={e => setEmail(e)}
						/>
					</IonCol>
					<IonCol sizeLg='6' sizeXs='12' className="acc-text-input-box">
						<p className="acc-text-input-title">PHONE NUMBER</p>
						<Input
							type="number"
							value={phoneNumber}
							className={`nobo-input `}
							placeholder="PHONE NUMBER"
							onChange={e => setCurrentPassword(e)}
						/>
					</IonCol>
					<IonCol size='12' className="acc-change-password-box">
						<p className="acc-change-password-text" id="open-modal">CHANGE PASSWORD</p>
						<img height={15} src="assets/images/account-change-password.png" alt="" />
					</IonCol>
				</IonRow>
					</div>
				<IonRow style={{ width: '350px', margin: 'auto' }}>
					<IonCol size='12' className="acc-experience-title">EXPERIENCE</IonCol>
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
							handleSubmit(data);
						}}
						disabled={validate()}
					/>
				</div>
			</IonContent>
			<IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.8} breakpoints={[0, 1]}>
				<div className="acc-password-change-box" >
					<p style={{ fontWeight: 700, fontSize: '22px' }} className='acc-password-change-title' >NEW PASSWORD</p>
					<div className="acc-password-change-input">
						<Input
							errorMessage={wrongPassword == true ? 'Incorrect password' : ''}
							type="password"
							value={currentPassword}
							className={`nobo-input `}
							placeholder="CURRENT PASSWORD"
							onChange={e => { setPassword(e) }}
						/>
					</div>
					<div className="acc-password-change-input">
						<Input
							type="password"
							value={newPassword}
							className={`nobo-input `}
							placeholder="NEW PASSWORD"
							onChange={e => { setNewPassword(e) }}
						/>
					</div>

					<div className="acc-password-change-input" >
						<Input
							errorMessage={newPassword !== comfirmPassword ? 'password mismatch' : ''}
							type="password"
							value={comfirmPassword}
							className={`nobo-input `}
							placeholder="COMFIRM PASSWORD"
							onChange={e => { setComfirmPassword(e) }}
						/>
					</div>
					<div className="acc-password-btn-box" >
						<Button

							className="acc-settings-btn"
							label="SAVE"
							large={true}
							onClick={e => {
								e.preventDefault();
								handleSubmit(data);
								// dismiss()
							}}
							disabled={validate() || newPassword !== comfirmPassword}
						/>
					</div>
				</div>
			</IonModal>
		</IonPage>
	);
};

export default AccountSettings;
