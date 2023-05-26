import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonRow, IonCol, useIonViewWillEnter, IonButton } from '@ionic/react';
import 'cropperjs/dist/cropper.css';
import './SelectBrands.scss';
import Button from '../components/Button';
import 'cropperjs/dist/cropper.css';
import { UserService } from '../services/UserService';
import Search from '../components/Search';
import Checkbox from '../components/Checkbox';
import { Brand } from '../models';
import HeaderComponent from '../components/HeaderComponent';

const SelectBrands: React.FC = () => {
	const userService = new UserService();
	const history = useHistory();
	const [brandsItems, setBrandItems] = useState<Brand[]>([]);
	const [brandsSelectArr, setBrandSelectArray] = useState<string[]>([]);
	const [tickedBrand, setTickedBrand] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	// fetching all brands
	useIonViewWillEnter(() => {
		userService
			.getBrands()
			.then(brands => {
				setBrandItems(brands);
			})
			.catch(error => {
				console.log('err, ', error);
			});
	});


	// Handling the ticker
	const handleTicker = (brandId: string) => {
		console.log("in the ticker container ", brandId)
		if (!brandsSelectArr.includes(brandId, 0)) {
			setBrandSelectArray([...brandsSelectArr, brandId])
			console.log(brandsSelectArr)
		} else if (brandsSelectArr.includes(brandId, 0)) {
			const updatedRemove = brandsSelectArr.filter((brand) => brand !== brandId)
			setBrandSelectArray(updatedRemove)
			console.log('after removed brand ', brandsSelectArr)
		}
	};

	const handleSubmit = async () => {
		userService
			.selectBrand(brandsSelectArr)
			.then(res => {
				if (res) {
					console.log("the res ", res);
					history.push('/onboarding-post');
				} else {
					console.log("something went wrong ", res);
				}
			})
			.catch((err: any) => {
				console.log('SelectBrand error', err);
			});
	};

	const mapFilter = brandsItems?.filter(brand =>
		brand.name.toLowerCase().includes(searchQuery.toLowerCase(), 0)
	);

	// Sorting the array alphabetically
	mapFilter.sort(function (a, b) {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 0;
		}
		return 1;
	});
	console.log('updated arr ', brandsSelectArr)

	return (
		<IonPage className="select-brands-main-container">
			<IonContent className="select-brands-ion-content">
				<HeaderComponent />

				<IonRow style={{ marginTop: '50px' }}>
					<IonCol className="select-brands-title">SELECT BRANDS</IonCol>
				</IonRow>
				<IonRow className="select-brands-desc-container">
					<IonCol className="select-brands-desc">
						Let other people know your favourite brands to trade, buy, or sell
					</IonCol>
				</IonRow>
				<div className="select-brands-search-container">
					<Search
						className="select-brands-search"
						value={searchQuery}
						onChange={e => setSearchQuery(e)}
					/>
				</div>

				<div className="select-brands-body-container">
					<IonRow className="select-brand-img-container">
						{mapFilter.sort().map(brand => (
							<IonCol
								onClick={() => {
									console.log(brand.name)
									handleTicker(brand._id)
								}}
								className="select-brand-img-col" key={brand._id} size="5"
							>
								<img src={brand.url} alt="" />
								<div className="select-brand-checkbox">
									{/* <Checkbox value={tickedBrand === brand._id} onChange={e => { }} /> */}
									<Checkbox value={brandsSelectArr.includes(brand._id)} onChange={e => { }} />
								</div>
							</IonCol>
						))}
					</IonRow>
				</div>

				{brandsSelectArr.length < 1 && (
					<IonRow className={'select-brands-skip-container'}>
						<IonButton
							fill="clear"
							className="select-brands-skip-text"
							onClick={() => {
								history.push('/onboarding-post');
							}}
						>
							SKIP FOR NOW
						</IonButton>
					</IonRow>
				)}

				<div
					className={brandsSelectArr.length < 1 ? 'select-brands-btn-container' : 'select-brands-btn-container2'}
				>
					<Button
						label="NEXT" large onClick={handleSubmit}
						disabled={brandsSelectArr.length < 1} />
				</div>
			</IonContent>
		</IonPage>
	);
};

export default SelectBrands;
