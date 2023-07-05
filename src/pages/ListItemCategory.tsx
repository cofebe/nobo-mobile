import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { useHistory } from 'react-router';
import './ListItem.scss';
import Select, { SelectOption } from '../components/Select';
import BrandSelect from '../components/BrandSelect';
import BrandSelectModal from '../components/BrandSelectModal';
import Button from '../components/Button';
import Input from '../components/Input';
import { CategoryService } from '../services/CategoryService';
import { UserService } from '../services/UserService';
import { listingStore, TopLevelCategory, ListingState } from '../listing-store';
import { User, Category, CategoriesResponse } from '../models';

const ListItemCategory: React.FC = () => {
  const history = useHistory();
  const categoryService = new CategoryService();
  const userService = new UserService();
  const [isTrade, setIsTrade] = useState(false);
  const [price, setPrice] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [itemCategory, setItemCategory] = useState<TopLevelCategory>('');
  const [itemSubcategory, setItemSubcategory] = useState<Category | null>(null);
  const [itemType, setItemType] = useState<Category | null>(null);
  const [brand, setBrand] = useState<string>('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [menItems, setMenItems] = useState<SelectOption[]>([]);
  const [womenItems, setWomenItems] = useState<SelectOption[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [shippingAddressCount, setShippingAddressCount] = useState(0);

  let subscription: any;

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);

    userService.getMe().then(user => {
      setShippingAddressCount(user.shippingAddress.length);
    });

    reset();
    listingStore.reset();

    //listingStore.reset();
    subscription = listingStore.subscribe((state: ListingState) => {
      setItemCategory(state.itemCategory);
      setItemSubcategory(state.itemSubcategory);
      setItemType(state.itemType);
      setBrand(state.brand);
      setPrice(state.price);
      setEstimatedPrice(state.estimatedPrice);
    });

    categoryService
      .getAllCategories()
      .then((res: CategoriesResponse) => {
        const uniqueWomenCategories: SelectOption[] = [];
        const uniqueMenCategories: SelectOption[] = [];
        res.docs
          .filter((doc: Category) => doc.parent === null && !doc.name.includes('[WOMEN]'))
          .forEach((doc: Category) => {
            const label = doc.name.replace('[MEN]', '').trim();
            if (!uniqueMenCategories.find(c => c.label === label)) {
              uniqueMenCategories.push({
                label,
                value: doc,
              });
            }
          });
        res.docs
          .filter((doc: Category) => doc.parent === null && !doc.name.includes('[MEN]'))
          .forEach((doc: Category) => {
            const label = doc.name.replace('[WOMEN]', '').trim();
            if (!uniqueWomenCategories.find(c => c.label === label)) {
              uniqueWomenCategories.push({
                label: doc.name.replace('[WOMEN]', '').trim(),
                value: doc,
              });
            }
          });
        setMenItems(uniqueMenCategories);
        setWomenItems(uniqueWomenCategories);
        setAllCategories(res.docs);
      })
      .catch(err => console.error(err));
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  function reset() {
    setPrice('');
    setEstimatedPrice('');
    setItemCategory('');
    setItemSubcategory(null);
    setItemType(null);
    setBrand('');
  }

  function getItems() {
    switch (itemCategory) {
      case 'men':
        return menItems;
      case 'women':
        return womenItems;
      default:
        return [];
    }
  }

  function getItemType() {
    if (!itemSubcategory) {
      return [];
    }

    const uniqueItemTypes = new Set();
    allCategories
      .filter((category: Category) => category?.parent?._id === itemSubcategory!._id)
      .forEach((category: Category) => {
        if (!uniqueItemTypes.has(category)) {
          uniqueItemTypes.add(category);
        }
      });
    const ret = Array.from(uniqueItemTypes).map((itemType: any) => {
      return {
        label: itemType.name,
        value: itemType,
      };
    });
    return ret;
  }

  function valid() {
    if (itemCategory === 'sneakers') return itemCategory && brand && price && estimatedPrice;
    else {
      return itemCategory && itemSubcategory && brand && price && itemType && estimatedPrice;
    }
  }

  return (
    <IonPage className="list-item-page">
      <IonHeader className="list-item-header">
        {!!shippingAddressCount && (
          <span className="progress-bar-container">
            <div className="progress-bar one-third-width"></div>
          </span>
        )}
        <div className="titles">
          <img
            src="assets/images/arrow-left.svg"
            className="back-arrow"
            alt="back"
            onClick={() => {
              history.goBack();
            }}
          />
          <div className="title">{isTrade ? 'LIST MY ITEM TO TRADE' : 'LIST MY ITEM TO SELL'}</div>
        </div>
        {!!shippingAddressCount && <span className="trade-steps">1/3</span>}
      </IonHeader>
      <IonContent>
        {!!shippingAddressCount ? (
          <IonGrid className="list-item-content">
            <IonRow>
              <IonCol>
                <div className="list-item-instruction">
                  Choose the category for the item being listed to unlock other details
                </div>
              </IonCol>
            </IonRow>
            <>
              <IonRow className="margin-bottom-5">
                <IonCol>
                  <Select
                    value={itemCategory}
                    placeholder="Select Category"
                    onChange={e => {
                      setItemSubcategory(null);
                      setItemType(null);
                      setBrand('');
                      setPrice('');
                      setEstimatedPrice('');
                      setItemCategory(e[0]);
                      listingStore.beginUpdate();
                      listingStore.setItemCategory(e[0]);
                      listingStore.setItemSubcategory(null);
                      listingStore.setItemType(null);
                      listingStore.setBrand('');
                      listingStore.setPrice('');
                      listingStore.setEstimatedPrice('');
                      listingStore.endUpdate();
                    }}
                    options={[
                      {
                        label: 'Men',
                        value: 'men',
                      },
                      {
                        label: 'Women',
                        value: 'women',
                      },
                      {
                        label: 'Sneakers',
                        value: 'sneakers',
                      },
                    ]}
                  />
                </IonCol>
              </IonRow>
              {itemCategory !== 'sneakers' && (
                <>
                  <IonRow className="margin-bottom-5">
                    <IonCol>
                      <Select
                        disabled={!itemCategory}
                        value={itemSubcategory}
                        onChange={e => {
                          setItemType(null);
                          setBrand('');
                          setPrice('');
                          setEstimatedPrice('');
                          setItemSubcategory(e[0]);
                          listingStore.beginUpdate();
                          listingStore.setItemType(null);
                          listingStore.setBrand('');
                          listingStore.setPrice('');
                          listingStore.setEstimatedPrice('');
                          listingStore.setItemSubcategory(e[0]);
                          listingStore.endUpdate();
                        }}
                        options={getItems()}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow className="margin-bottom-5">
                    <IonCol>
                      <Select
                        disabled={!itemSubcategory}
                        value={itemType}
                        placeholder="Select Type"
                        onChange={e => {
                          setItemType(e[0].value);
                          listingStore.setItemType(e[0]);
                        }}
                        options={getItemType()}
                      />
                    </IonCol>
                  </IonRow>
                </>
              )}
              <IonRow className="margin-bottom-5">
                <IonCol>
                  <BrandSelect
                    placeholder="SELECT BRAND"
                    disabled={!itemType}
                    value={brand}
                    onShow={() => {
                      setShowBrandModal(true);
                    }}
                  ></BrandSelect>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <Input
                    disabled={!brand}
                    type="number"
                    value={estimatedPrice}
                    className={`input-height ${!brand && 'disabled-input'}`}
                    placeholder="ESTIMATED RETAIL PRICE"
                    onChange={val => {
                      setEstimatedPrice(val);
                      listingStore.setEstimatedPrice(val);
                    }}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <Input
                    disabled={!brand}
                    type="number"
                    value={price}
                    className={`input-height ${!brand && 'disabled-input'}`}
                    placeholder="PRICE"
                    onChange={val => {
                      setPrice(val);
                      listingStore.setPrice(val);
                    }}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="button-container">
                  <Button
                    disabled={!valid()}
                    label="Next"
                    large={true}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      history.push(isTrade ? '/list/trade-product' : '/list/image');
                    }}
                  />
                </IonCol>
              </IonRow>
            </>
          </IonGrid>
        ) : (
          <div className="no-shipping-address">
            <div className="text">
              Before you list any items, Please add at least one Shipping to your account.
            </div>
            <div
              className="link"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                history.push('/settings/shipping');
              }}
            >
              <div>go to Shipping Addresses</div>
              <div>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_191_3875)">
                    <path
                      d="M17 3.54167L17 13.4583C16.9989 14.3973 16.6254 15.2975 15.9614 15.9614C15.2975 16.6254 14.3973 16.9989 13.4583 17L3.54167 17C2.6027 16.9989 1.70252 16.6254 1.03857 15.9614C0.374625 15.2975 0.00112476 14.3973 4.2234e-08 13.4583L1.60489e-07 3.54167C0.0011249 2.6027 0.374625 1.70252 1.03857 1.03857C1.70252 0.374625 2.6027 0.00112524 3.54167 5.19071e-07L13.4583 6.37326e-07C14.3973 0.00112538 15.2975 0.374625 15.9614 1.03857C16.6254 1.70252 16.9989 2.6027 17 3.54167V3.54167ZM1.41667 13.4583C1.41667 14.0219 1.64055 14.5624 2.03906 14.9609C2.43758 15.3595 2.97808 15.5833 3.54167 15.5833L13.4583 15.5833C14.0219 15.5833 14.5624 15.3595 14.9609 14.9609C15.3594 14.5624 15.5833 14.0219 15.5833 13.4583L15.5833 3.54167C15.5833 2.97808 15.3595 2.43758 14.9609 2.03907C14.5624 1.64055 14.0219 1.41667 13.4583 1.41667L3.54167 1.41667C2.97808 1.41667 2.43758 1.64055 2.03906 2.03906C1.64055 2.43758 1.41667 2.97808 1.41667 3.54167L1.41667 13.4583ZM11.3333 8.5C11.3339 9.01851 11.1444 9.51923 10.8007 9.90746C10.5945 10.1391 10.3941 10.3587 10.2503 10.5025L8.24996 12.5375C8.11665 12.6627 7.94006 12.7316 7.75717 12.7295C7.57427 12.7275 7.39924 12.6548 7.26872 12.5267C7.1382 12.3986 7.06231 12.2249 7.05693 12.0421C7.05155 11.8592 7.11711 11.6814 7.23987 11.5458L9.24375 9.50583C9.37621 9.37267 9.55612 9.17433 9.73958 8.96821C9.85372 8.83881 9.9167 8.67219 9.9167 8.49965C9.9167 8.3271 9.85372 8.16048 9.73958 8.03108C9.55683 7.82567 9.37692 7.62733 9.24871 7.49842L7.23987 5.45417C7.17033 5.38883 7.1147 5.31011 7.07632 5.22273C7.03795 5.13536 7.01763 5.04113 7.01659 4.94571C7.01554 4.85029 7.03378 4.75564 7.07022 4.66744C7.10666 4.57924 7.16054 4.49932 7.22864 4.43247C7.29673 4.36561 7.37764 4.31321 7.46649 4.2784C7.55534 4.24359 7.65031 4.22709 7.7457 4.22989C7.84108 4.2327 7.93492 4.25475 8.02157 4.29472C8.10823 4.33469 8.18591 4.39176 8.24996 4.4625L10.2538 6.50179C10.3955 6.64346 10.5938 6.86092 10.7985 7.09183C11.1433 7.47983 11.3337 7.98094 11.3333 8.5V8.5Z"
                      fill="#D6980E"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_191_3875">
                      <rect
                        width="17"
                        height="17"
                        fill="white"
                        transform="translate(0 17) rotate(-90)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        )}
      </IonContent>
      <BrandSelectModal
        value={brand}
        show={showBrandModal}
        onChange={val => {
          setBrand(val);
          listingStore.setBrand(val);
          setShowBrandModal(false);
        }}
        onCancel={() => setShowBrandModal(false)}
      />
    </IonPage>
  );
};

export default ListItemCategory;
