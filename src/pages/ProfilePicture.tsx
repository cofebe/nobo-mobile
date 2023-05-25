import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonRow, IonCol, IonGrid, IonButton } from '@ionic/react';
import 'cropperjs/dist/cropper.css';
import './ProfilePicture.scss';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Button from '../components/Button';
import 'cropperjs/dist/cropper.css';
import { UserService } from '../services/UserService';
import { Cropper } from 'react-cropper';
import HeaderComponent from '../components/HeaderComponent';

const ProfilePicture: React.FC = () => {
	const userService = new UserService();
	const history = useHistory();
	const [photoData, setPhotoData] = useState(Object);
	const [cropperToggler, setCropperToggler] = useState(false);

	const takePhoto = async () => {
		const photo = await Camera.getPhoto({
			resultType: CameraResultType.Base64,
			source: CameraSource.Camera,
			quality: 100,
		});
		setCropperToggler(true);
		setPhotoData(photo);
	};

	const handleSubmit = async (imgData: any) => {
		userService
			.uploadProfileImg(imgData)
			.then(res => {
				if (res) {
					console.log(res);
					history.push('/follow-people');
				} else {
					console.log('something went wrong');
				}
			})
			.catch((err: any) => {
				console.log(' ProfilePicture error', err);
			});
	};

	// clear the photo to take another
	const clearCameraPhoto = () => {
		setCropperToggler(false);
	};

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

						let base64data = c.toDataURL('image/jpeg');
						// let base64data = b64str; //(reader.result || "").toString();

						setPhotoData({
							...photoData,
							format: 'png',
							base64String: base64data.split(',')[1],
						});
						// setPreviewImgFile(base64data);
						handleSubmit(base64data);
					}, 500);
				};
			});
		}
		// setToggleCropper(false);
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

	return (
		<IonPage id="profile-picture-page" className="profile-picture-main-container">
			<IonContent className="profile-picture-ion-content">

				<HeaderComponent />
				<IonRow style={{ marginTop: '50px' }}>
					<IonCol className="profile-picture-title">PROFILE PICTURE</IonCol>
				</IonRow>
				<IonRow className="profile-picture-desc-container">
					<IonCol className="profile-picture-desc">
						To move foward, choose a profile photo for your style feed!
					</IonCol>
				</IonRow>

				<IonRow
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
				>
					<div className="profile-picture-image-container">
						{!cropperToggler && (
							<div style={{ position: 'relative' }}>
								<IonRow >
									<IonCol>
										<img className="" src="assets/images/nobo-profile-upload-circle.png" alt="" />
									</IonCol>

									<IonCol style={{ position: 'absolute', top: '35%', left: '35%' }}>
										<img
											onClick={e => {
												e.preventDefault();
												// uploadProfilePic();
												takePhoto();
												console.log('starting... camera');
											}}
											src="assets/images/nobo-profile-upload-plus.png"
											alt=""
										/>
									</IonCol>
								</IonRow>
							</div>
						)}

						{/* CLEAR PHOTO */}
						{cropperToggler && (
							<div
								className="profile-picture-clear-photo"
								onClick={e => {
									e.preventDefault();
									clearCameraPhoto();
								}}
							>
								<img src="assets/images/close-black.svg" alt="close" />
							</div>
						)}

						{cropperToggler && (
							<div className="profile-picture-image-cropper">
								<Cropper
									className="profile-picture-cropper"
									src={`data:image/png;base64,${photoData?.base64String}`}
									// CropperJS options
									style={{ height: '200px', borderRadius: '50%' }}
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
					</div>
				</IonRow>
				<IonGrid></IonGrid>

				<IonRow	className={'profile-picture-skip-container'}	>
					{ !cropperToggler &&(<IonButton
						fill="clear"
						className="profile-picture-skip-text"
						onClick={() => {
							history.push('/follow-people');
						}}
					>
						SKIP FOR NOW
					</IonButton>)}
				</IonRow>

				<div className={cropperToggler ? 'profile-picture-btn-container' : 'profile-picture-btn-container2'}>
					<Button
						label="NEXT"
						large
						onClick={e => {
							e.preventDefault();
							executeProfilePicCrop();
						}}
						disabled={!cropperToggler}
					/>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default ProfilePicture;
