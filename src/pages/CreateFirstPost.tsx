import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
 IonContent,
 IonPage,
 IonRow,
 IonCol,
 useIonViewWillEnter,
 IonTextarea,
 IonButton,
} from '@ionic/react';
import 'cropperjs/dist/cropper.css';
import './CreateFirstPost.scss';
import Button from '../components/Button';
import 'cropperjs/dist/cropper.css';
import { UserService } from '../services/UserService';
import { PostResponse, User } from '../models';

const CreateFirstPost: React.FC = () => {
 const userService = new UserService();
 const history = useHistory();
 const [currentUser, setCurrentUserData] = useState<any>([]);
 const [textValue, setTextValue] = useState<any>('');

 const loadUserProfile = () => {
  userService
   .getMe()
   .then((user: User) => {
    setCurrentUserData(user);
   })
   .catch(err => console.log('getting a user', err));
 };

 useIonViewWillEnter(() => {
  loadUserProfile();
 });

 // creating a post
 const createPost = () => {
  userService
   .createPost(textValue)
   .then((success: PostResponse) => {
    if (success) {
     localStorage.setItem('newUser', 'newUser');
     setTimeout(() => {
      history.push(`/home/my-profile`);
     }, 2000);
    }
   })
   .catch(err => console.log('getting a user', err));
 };
 // skip post
 const skipPost = () => {
  setTimeout(() => {
   history.push(`/home/my-profile`);
  }, 2000);
 };

 return (
  <IonPage className="create-post-main-container">
   <IonContent className="create-post-ion-content">
    <div className="create-post-header">
     <img
      onClick={() => {
       history.goBack();
      }}
      className="create-post-back-btn"
      style={{ color: 'black' }}
      height={23}
      src="assets/images/arrow-left.svg"
      alt="logo"
     />

     <img className="create-post-nobo-logo" src="assets/images/nobo_logo.png" alt="logo" />
    </div>

    <IonRow>
     <IonCol className="create-post-title">YOUR FIRST POST</IonCol>
    </IonRow>
    <IonRow className="create-post-desc-container">
     <IonCol className="create-post-desc">
      Write your first post here. Or, we can do it for you
     </IonCol>
    </IonRow>

    <div className="create-post-body-container">
     <IonRow className="create-post-img-container">
      <IonCol className="create-post-img-container">
       <img className="create-post-user-img" src={currentUser?.avatar} alt="logo" />
      </IonCol>
     </IonRow>
     <IonRow className="create-post-username-container">
      {currentUser?.displayName && (
       <h3 className="create-post-username-text">@{currentUser?.displayName.toUpperCase()}</h3>
      )}
     </IonRow>

     <IonTextarea
      className="create-post-testarea"
      placeholder="Write your post"
      spellcheck={true}
      title="post"
      autocapitalize="on sentence"
      maxlength={350}
      autoGrow={true}
      rows={5}
      value={textValue}
      onIonChange={e => {
       setTextValue(e.target.value);
      }}
     ></IonTextarea>
    </div>

    {
     <IonRow className={'create-post-skip-container'}>
      <IonButton fill="clear" className="create-post-skip-text" onClick={skipPost}>
       SKIP
      </IonButton>
     </IonRow>
    }

    <div className="create-post-btn-container">
     <Button label="NEXT" large onClick={createPost} disabled={textValue === ''} />
    </div>
   </IonContent>
  </IonPage>
 );
};

export default CreateFirstPost;
