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
import { Brand, User } from '../models';
import HeaderComponent from '../components/HeaderComponent';

const SelectBrands: React.FC = () => {
  const userService = new UserService();
  const history = useHistory();
  const [brandsItems, setBrandItems] = useState<Brand[]>([]);
  const [error, setError] = useState<any[]>([]);
  const [userBrandList, setUserBrandList] = useState<string[]>([]);
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


  function getMyBrands() {
    userService.getMe()
      .then((user) => {
        setUserBrandList(user.favoriteBrands)
      })
      .catch(error => { console.log('unable to get user', error) })
  }

  useIonViewWillEnter(() => {
    getMyBrands()

  })



  const handleSubmit = async (brandId: any) => {
    if (userBrandList.includes(brandId, 0)) {
      userService
        .deleteBrand(brandId)
        .then(res => {
          if (res) {
            getMyBrands()
          }
          else {
            console.log('something went wrong ', res);
          }
        })
        .catch((err: any) => {
          console.log('SelectBrand error', err);
        });
    }

    else {
      userService
        .addBrand(brandId)
        .then(res => {
          if (res) {
            getMyBrands()
          } else {
            console.log('something went wrong ', res);
          }
        })
        .catch((err: any) => {
          console.log('SelectBrand error', err);
        });
    }


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

  return (
    <IonPage className='select-brands-main-container'>
      <IonContent className='select-brands-ion-content'>
        <HeaderComponent />

        <IonRow>
          <IonCol className='select-brands-title'>SELECT BRANDS</IonCol>
        </IonRow>
        <IonRow className='select-brands-desc-container'>
          <IonCol className='select-brands-desc'>
            Let other people know your top 4 favorite brands to trade, buy, or sell.
          </IonCol>
        </IonRow>
        <div className='select-brands-search-container'>
          <Search
            className='select-brands-search'
            value={searchQuery}
            onChange={e => setSearchQuery(e)}
          />
        </div>

        <div className='select-brands-body-container'>
          <IonRow className='select-brand-img-container'>
            {mapFilter.sort().map(brand => (
              <IonCol
                onClick={() => {
                  handleSubmit(brand._id)
                }}
                className='select-brand-img-col' key={brand._id} size='5'
              >
                {error.includes(brand._id) ?
                  <p className='brand-img'>{brand.name}</p>
                  :
                  <img className='brand-img'
                    src={brand.url}
                    onError={() => {
                      setError([...error, brand._id])
                    }}

                  />}
                <div className='select-brand-checkbox'>
                  <Checkbox value={userBrandList.includes(brand._id)} onChange={e => { }} />
                </div>
              </IonCol>
            ))}
          </IonRow>
        </div>

        <div
          className={'select-brands-btn-container'}
        >
          <Button
            className='select-brands-btn'
            label='NEXT' large onClick={() => {
              history.push('/onboarding-post');
            }}
            disabled={userBrandList.length < 4} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectBrands;
