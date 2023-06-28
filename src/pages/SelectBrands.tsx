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
  const [brandsSelectArr, setBrandSelectArray] = useState<string[]>([]);
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
      setBrandSelectArray([...brandsSelectArr, brandId])
    }

    else if (brandsSelectArr.includes(brandId, 0)) {
      const updatedRemove = brandsSelectArr.filter((brand) => brand !== brandId)
      setBrandSelectArray(updatedRemove)
    }
  };


  function getMyBrands() {
    userService.getMe()
      .then((user) => { console.log('my updated brand list', user.favoriteBrands) })
      .catch(error => { console.log('unable to get user', error) })
  }


  const handleSubmit = async (brandId: any) => {
    userService.getMe()
      .then((user: User) => {
        if (user.favoriteBrands.includes(brandId, 0)) {
          console.log('removing : ', brandId)
          userService
            .deleteBrand(brandId)
            .then(res => {
              if (res) {
                console.log('the res ', res);
                getMyBrands();
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
          console.log('adding :', brandId)
          userService
            .addBrand(brandId)
            .then(res => {
              if (res) {
                console.log('the res ', res);
                getMyBrands();
              } else {
                console.log('something went wrong ', res);
              }
            })
            .catch((err: any) => {
              console.log('SelectBrand error', err);
            });
        }
      })
      .catch((err) => {
        console.log('error fetching user', err)
      })

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
                  handleTicker(brand._id)
                  handleSubmit(brand._id)
                }}
                className='select-brand-img-col' key={brand._id} size='5'
              >
                <img className='brand-img' src={brand.url} alt={brand.name} />
                <div className='select-brand-checkbox'>
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
              fill='clear'
              className='select-brands-skip-text'
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
          className='select-brands-btn'
            label='NEXT' large onClick={() => {
              history.push('/onboarding-post');
            }}
            disabled={brandsSelectArr.length < 4} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectBrands;
