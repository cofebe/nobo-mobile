import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonRow, IonCol, IonGrid } from '@ionic/react';
import './Experience.scss';
import { UserService } from '../services/UserService';
import { User } from '../models';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import HeaderComponent from '../components/HeaderComponent';

const Experience: React.FC = () => {
	const userService = new UserService();
	const history = useHistory();
	const [selectedExperienceArray, setSelectedExpArray] = useState<string[]>([]);


	const handleTicker = (expId: string) => {
		if (!selectedExperienceArray.includes(expId, 0)) {
			setSelectedExpArray([expId])
		} else if (selectedExperienceArray.includes(expId, 0)) {
			const updatedRemove = selectedExperienceArray.filter((expOption) => expOption !== expId)
			setSelectedExpArray(updatedRemove)
		}
	};

	const handleSubmit = async () => {
		userService
			.experience(selectedExperienceArray[0])
			.then((user: User) => {
				if (user) {
					console.log(user);
					history.push('/profile-picture');
				} else {
					console.log('something went wrong');
				}
			})
			.catch((err: any) => {
				console.log('experience error', err);
			});
	};


	return (
		<IonPage className="experience-main-container">
			<IonContent className="experience-ion-content">
			<HeaderComponent/>
				<IonRow style={{ marginTop: '50px' }}>
					<IonCol className="experience-title">CHOOSE YOUR EXPERIENCE</IonCol>
				</IonRow>
				<IonRow className="experience-desc-container">
					<IonCol className="experience-desc">
						Select the category of clothing you prefer to shop. Don't worry, you can stil view other
						experiences later.
					</IonCol>
				</IonRow>

				<IonGrid className="experience-form-container">


					{/* WOMEN */}
					<IonRow>
						<IonCol
							size='12'
							className="experience-img-container"
							onClick={() => {
								handleTicker('women');
							}}
						>
							<img
								className={
									selectedExperienceArray.includes('women')
										? 'experience-img-container-selected'
										: 'experience-img-container'
								}
								src="assets/images/experience-women.png"
								alt="women"
							/>
							<h3
								style={{
									position: 'absolute',
									color: 'white',
									fontWeight: 'bold',
								}}
							>
								WOMEN
							</h3>
							<div className="experience-checkbox">
								<Checkbox value={selectedExperienceArray.includes('women')} onChange={() => { }} />
								{/* <Checkbox value={expOptionSelected === 'women'} onChange={() => { }} /> */}
							</div>
						</IonCol>
					</IonRow>


					{/* MEN */}

					<div
						className="experience-img-container"
						onClick={() => {
							handleTicker('men');
						}}
					>
						<img
							className={
								selectedExperienceArray.includes('men')
									? 'experience-img-container-selected'
									: 'experience-img-container'
							}
							src="assets/images/experience-men.png"
							alt="sneakers"
						/>
						<h3
							style={{
								position: 'absolute',
								color: 'white',
								fontWeight: 'bold',
							}}
						>
							MEN
						</h3>
						<div className="experience-checkbox">
							<Checkbox value={selectedExperienceArray.includes('men')} onChange={e => { }} />
						</div>
					</div>

					{/* SNEAKERS */}
					<div
						className="experience-img-container"
						onClick={() => {
							handleTicker('sneakers');
						}}
					>
						<img
							className={
								selectedExperienceArray.includes('sneakers')
									? 'experience-img-container-selected'
									: 'experience-img-container'
							}
							src="assets/images/experience-sneaker.png"
							alt="sneakers"
						/>
						<h3
							style={{
								position: 'absolute',
								color: 'white',
								fontWeight: 'bold',
							}}
						>
							SNEAKERS
						</h3>
						<div className="experience-checkbox">
							<Checkbox value={selectedExperienceArray.includes('sneakers')} onChange={e => { }} />
						</div>
					</div>
				</IonGrid>
				<IonRow >
					<IonCol size='12'>
						<div className="experience-btn-container">
							<Button
								className="experience-btn"
								label="NEXT"
								large
								onClick={e => {
									e.preventDefault();
									handleSubmit();
								}}
								disabled={selectedExperienceArray.length < 1}
							/>
						</div>
					</IonCol>
				</IonRow>

			</IonContent>
		</IonPage>
	);
};

export default Experience;
