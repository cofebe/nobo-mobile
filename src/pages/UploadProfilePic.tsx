import React, { useState } from 'react'
import { IonContent, IonPage, IonRow, IonCol, IonGrid, IonButton } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import HeaderComponent from '../components/HeaderComponent';
import Button from '../components/Button';
import { UserService } from '../services/UserService';
import { useHistory } from 'react-router';
import './UploadProfilePic.scss'




const UploadProfilePic: React.FC = () => {
  const userService = new UserService()
  const history = useHistory()
  const [imageData, setImageData] = useState<string>('');

  const takePicture = async () => {

    try {
      const image:any = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      setImageData(image.dataUrl);
    } catch (error) {
      console.error('Failed to capture image', error);
    }
  }

  const compressBase64Image = (maxWidth = 800, maxHeight = 800, quality = 100): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image: any = new Image();
      image.src = imageData;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          let { width, height } = image;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);

          const compressedImage = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedImage);
          handleSubmit(compressedImage)
        } else {
          reject(new Error('Failed to get canvas context.'));
        }
      };

      image.onerror = (error: any) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (img:any) => {
    userService
      .uploadProfileImg(img)
      .then(res => {
        if (res) {
          history.push('/follow-people');
        } else {
          console.log('something went wrong');
        }
      })
      .catch((err: any) => {
        console.log(' ProfilePicture error', err);
      });
  };



  return (
    <IonPage id='profile-picture-page' className='profile-picture-main-container'>
      <IonContent className='profile-picture-ion-content'>

        <HeaderComponent />
        <IonRow>
          <IonCol className='profile-picture-title'>PROFILE PICTURE</IonCol>
        </IonRow>
        <IonRow className='profile-picture-desc-container'>
          <IonCol className='profile-picture-desc'>
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
          <IonRow  className='profile-picture-image-container'>
          {imageData === '' &&(
          <IonCol size='12'  className='profile-picture-circle'>
            <div  style={{ position:'relative'}}>

              <img className='' src='assets/images/nobo-profile-upload-circle.png' alt='' />
              <div style={{ position: 'absolute', top: '35%', left: '37%' }}>
                <img
                  onClick={e => {
                    e.preventDefault();
                    takePicture();
                  }}
                  src='assets/images/nobo-profile-upload-plus.png'
                  alt=''
                />
              </div>
            </div>
            </IonCol>)}
             {imageData !== '' && (<div

                className='profile-picture-clear-photo'
                onClick={(e) => {
                  setImageData('')
                }}
              >
                <img src='assets/images/close-black.svg' alt='close' />
              </div>)}

            {imageData !== '' && (
              <div className='profile-picture-container'  >
                <img className='profile-picture-img' src={imageData} alt="Profile Image" />
              </div>
            )}
          </IonRow>
        </IonRow>

        <div className={imageData !== '' ? 'profile-picture-btn-container' : 'profile-picture-btn-container2'}>
          <Button
            label='NEXT'
            large
            onClick={e => {
              e.preventDefault();
              compressBase64Image()
            }}
          disabled={imageData === ''}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UploadProfilePic;
