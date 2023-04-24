import {
    IonPage,
    IonRow,
    IonCol,
    useIonViewWillEnter,
    IonLabel,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonButton
} from '@ionic/react';

import './SelectSize.scss';
import { useHistory } from 'react-router';
import { useState } from 'react';



const options = {
    cssClass: 'my-custom-interface',
};


const SelectSize = () => {

    const [dresses, setDresses] = useState<string>();
    const [tops, setTops] = useState<string>();
    const [bottoms, setBottoms] = useState<string>();
    const [error, setError] = useState(false)
    const history = useHistory()
    useIonViewWillEnter(() => {
        //   setError(false);
    });

  const validate = ():boolean | undefined => {
    if(tops === undefined || dresses === undefined || bottoms ===undefined){
        // setError(true)
        return true 
    }else{
        // setError(false)
        return false
    }
  }

  const handleNext = ()=>{
    console.log(dresses)
  }


 console.log(" ---dresses : ", dresses, " --- tops : ", tops, " --- bottoms : ", bottoms)

    return (
        <IonPage className="main-container" style={{ backgroundColor: 'gray' }}>
            <IonContent className='sizes-ion-content'>
                <div >
                    <div className='header'  >
                        <img
                            onClick={() => { history.goBack() }}
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
                        <IonCol className='title'>WHAT SIZE DO YOU WEAR</IonCol>
                    </IonRow>
                    <IonRow className='desc-container'>
                        <IonCol className='desc'>
                            What size do you usually shop for?
                        </IonCol>
                    </IonRow>

                    <IonItem className='select-container'  >
                        <IonLabel style={{color: 'gray' }}>DRESSES</IonLabel>
                        <IonSelect interfaceOptions={options} value={dresses} aria-label='outlined'  onIonChange={(e) => setDresses(e.detail.value)}>
                            <IonSelectOption value="small" >small</IonSelectOption>
                            <IonSelectOption value="medium">medium</IonSelectOption>
                            <IonSelectOption value="large">large</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem className='select-container'  >
                        <IonLabel style={{color: 'gray', fontSize:14 }}>TOPS</IonLabel>
                        <IonSelect interfaceOptions={options} value={tops} aria-label='outlined' onIonChange={(e) => setTops(e.detail.value)}>
                            <IonSelectOption value="small" >small</IonSelectOption>
                            <IonSelectOption value="medium">medium</IonSelectOption>
                            <IonSelectOption value="large">large</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem className='select-container'  >
                        <IonLabel style={{color: 'gray' }}>BOTTOMS</IonLabel>
                        <IonSelect interfaceOptions={options} value={bottoms} aria-label='outlined' onIonChange={(e) => setBottoms(e.detail.value)}>
                            <IonSelectOption value="small" >small</IonSelectOption>
                            <IonSelectOption value="medium">medium</IonSelectOption>
                            <IonSelectOption value="large">large</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonRow className='btn-container'>
                        <IonButton
                             onClick={handleNext}
                            disabled={validate()}
                            expand='full'
                            className='btn'
                            title='NEXT'
                        >NEXT
                        </IonButton>
                    </IonRow>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SelectSize;
