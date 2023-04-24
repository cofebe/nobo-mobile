import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    IonButton,
    IonContent,
    IonPage,
    useIonViewWillEnter,
    IonRow,
    IonCol,
    IonGrid,

} from '@ionic/react';
import './Experience.scss';
import { loadingStore } from '../loading-store';
import { UserService } from '../services/UserService';
import { ResData } from '../models';



const Experience: React.FC = () => {
    const userService = new UserService()
    const history = useHistory();
    const [experienceOption, setExperienceOption] = useState("");

    useIonViewWillEnter(() => {
        // some code here
    });


    const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExperienceOption(e.currentTarget.value)
    }


    const handleNext = async (experienceOption: string) => {

        const userToken = localStorage.getItem("userToken")
        if (userToken) {
            const token = JSON.parse(userToken)

            loadingStore.increment('Experience:timeout');
            userService.experience(experienceOption, token)
                .then((user: ResData) => {
                    console.log(user.currentUser)
                    window.localStorage.setItem("userExperienceData", JSON.stringify(user.currentUser))
                })
                .then(()=>{
                    loadingStore.decrement('SignUp:timeout');
                    history.push("/experience/select-size")
                })

                .catch((err: any) => {
                    loadingStore.decrement('SignUp:timeout');
                    console.log('signup error', err);

                });

        }
        else {
            return console.log("no token found")
        }

    }

    // push a fuction base on user prefrence
    function checkCase() {
        switch (experienceOption) {
            case 'women': handleNext(experienceOption)

                break;

            case 'men': handleNext(experienceOption)

                break;

            case 'sneaker': handleNext(experienceOption);

                break;

            default:
                break;
        }
    }



    return (
        <IonPage className='main-container'>
            <IonContent className='experience-ion-content' >
                <div className='header'  >

                    <img
                        onClick={() => { history.push("/get-started") }}
                        className='nobo-back-btn'
                        style={{ color: "black" }}
                        height={40}
                        src="assets/images/arrow-left.svg"
                        alt="logo"
                    />

                    <img
                        className='nobo-logo'
                        src="assets/images/nobo_logo.png"
                        alt="logo"
                    />
                </div>

                <IonRow className='title-container'>
                    <IonCol className='title'>EXPERIENCE</IonCol>
                </IonRow>
                <IonRow className='desc-container'>
                    <IonCol className='desc'>
                        Select the category of clothing you prefer to shop.
                        Don't worry, you can still vieww other experiences later
                    </IonCol>
                </IonRow>


                <form >

                    <div className='img-container' >
                        <img
                            className='img'
                            src="assets/images/experience-women.png"
                            alt="logo"
                        />
                        <h3 style={{ position: "absolute", color: "white", fontWeight: "bold" }}>WOMEN</h3>

                        <input
                            value="women"
                            name='women'
                            type='checkbox'
                            checked={experienceOption === "women"}
                            className='checkbox'
                            onChange={handleRadioClick}
                        />
                    </div>

                    <div className='img-container'>
                        <img
                            className='img'
                            src="assets/images/experience-men.png"
                            alt="logo"
                        />
                        <h3 style={{ position: "absolute", color: "white", fontWeight: "bold" }}>MEN</h3>
                        <input
                            value="men"
                            name='men'
                            type='checkbox'
                            checked={experienceOption === "men"}
                            className='checkbox'
                            onChange={handleRadioClick}

                        />
                    </div>


                    <div className='img-container' >
                        <img
                            className='img'
                            src="assets/images/experience-sneaker.png"
                            alt="logo"
                        />
                        <h3 style={{ position: "absolute", color: "white", fontWeight: "bold" }}>SNEAKER</h3>
                        <input
                            value="sneaker"
                            name='sneaker'
                            type='checkbox'
                            checked={experienceOption === "sneaker"}
                            className='checkbox'
                            onChange={handleRadioClick}
                        />
                    </div>

                </form>
                <IonRow className='btn-container1'>
                    <IonButton
                        onClick={checkCase}
                        disabled={experienceOption === ""}
                        expand='full'
                        className='btn'
                        title='NEXT'
                    >NEXT
                    </IonButton>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Experience;
