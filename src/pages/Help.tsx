import { IonButton, IonCol, IonContent, IonPage, IonRow, IonTextarea } from '@ionic/react'
import React, { useState } from 'react'
import './Help.scss'
import { useHistory } from 'react-router'
import Input from '../components/Input'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { UserService } from '../services/UserService'

const Help = () => {
  const history = useHistory()
  const userService = new UserService()
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
    // userService
    //   .uploadProfileImg(img)
    //   .then(res => {
    //     if (res) {
    //       // history.push('/follow-people');
    //     } else {
    //       console.log('something went wrong');
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log(' ProfilePicture error', err);
    //   });
  };


console.log(imageData)
  return (
    <IonPage className='help-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='help-back-btn'
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

          <IonCol className='help-title-text-container'>HELP</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='help-ion-content'>
        <IonRow className='help-input-container'>
          <IonCol size='12' className='help-input-box'>
            <div className='list'>LIST URL</div>
            <Input

              onChange={() => { }}
              // value={email}
              className='help-text-input'
              placeholder='www.thenobo.com/mylisting'
            />
          </IonCol>
        </IonRow>
        <IonRow className='help-input-container2'>
          <IonCol size='12' className='help-input-box2'>
            {/* <div className='list'>LIST URL</div> */}
            <Input

              onChange={() => { }}
              // value={email}
              className='help-text-input2'
              placeholder='I NEED HELP WITH'
            />
            <div id='open-modal' onClick={() => { }} className='img-container'>
              <img src="assets/images/down-arrow.svg" alt="" />
            </div>
          </IonCol>
        </IonRow>
        <IonRow className='help-textarea-container'>
          <IonCol size='12' className='help-textarea-box'>
            <div className='help-info-box'>
              <p>DESCRIBE ISSUE</p>
              <p>THIS PAGE HAS LINK</p>
            </div>
            <IonTextarea
              className='help-textarea'
              placeholder=' IF THIS IS ABOUT AN ITEM YOU BOUGHT SOLD OR TRADED
              , PLEASE INCLUDE A LINK OR SCREENSHOT FROM LISTING.'
              spellcheck={true}
              title='post'
              autocapitalize='on sentence'
              maxlength={350}
              autoGrow={true}
              rows={5}
              // value={textValue}
              onIonChange={e => {
                // setTextValue(e.target.value);
              }}
            ></IonTextarea>
          </IonCol>
        </IonRow>

        <IonRow className='img-upload-container'>
          <IonCol size='12' className='img-upload-box'>
            <div className='img-text-box'>UPLOAD SCREENSHOT</div>
            <div className='img-container2'
            onClick={(e)=>{
              console.log('taking picture...')
              e.preventDefault();
              takePicture();
            }}
            >
              <img className='rectangle' src="assets/images/image-rectangle.svg" alt="" />
              <img className='plus' src="assets/images/nobo-profile-upload-plus.png" alt="" />

            </div>
          </IonCol>
        </IonRow>

        <div className="help-s-btn-below">
          <IonButton  className='btn'
          onClick={(e) => {
            e.preventDefault();
            compressBase64Image()
          }} >SEND</IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Help
