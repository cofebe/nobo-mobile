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
  if (!brandsSelectArr.includes(brandId, 0)) {
   brandsSelectArr.push(brandId);
  } else {
   const brandItem = brandsSelectArr.filter(brand => brand === brandId);
   setTickedBrand(brandItem[0]);
  }
 };

 const handleSubmit = async () => {
  userService
   .selectBrand(tickedBrand)
   .then(res => {
    if (res) {
     history.push('/onboarding-post');
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
   return 1;
  }
  return 0;
 });

 return (
  <IonPage className="select-brands-main-container">
   <IonContent className="select-brands-ion-content">
    <div className="select-brands-header">
     <img
      onClick={() => {
       history.goBack();
      }}
      className="select-brands-back-btn"
      style={{ color: 'black' }}
      height={23}
      src="assets/images/arrow-left.svg"
      alt="logo"
     />

     <img className="select-brands-nobo-logo" src="assets/images/nobo_logo.png" alt="logo" />
    </div>

    <IonRow>
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
       <IonCol className="select-brand-img-col" key={brand._id} size="5">
        <img
         onClick={() => {
          handleTicker(brand._id);
         }}
         src={brand.url}
         alt="Alaia"
        />
        <div className="select-brand-checkbox">
         <Checkbox value={tickedBrand === brand._id} onChange={e => {}} />
        </div>
       </IonCol>
      ))}
     </IonRow>
    </div>

    {tickedBrand === '' && (
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
     className={tickedBrand === '' ? 'select-brands-btn-container' : 'select-brands-btn-container2'}
    >
     <Button label="NEXT" large onClick={handleSubmit} disabled={tickedBrand === ''} />
    </div>
   </IonContent>
  </IonPage>
 );
};

export default SelectBrands;
