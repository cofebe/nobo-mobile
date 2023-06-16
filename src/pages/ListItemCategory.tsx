import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
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
import { listingStore, TopLevelCategory, ListingState } from '../listing-store';
import { Category, CategoriesResponse } from '../models';
import { brands } from '../data/brands';

const ListItemCategory: React.FC = () => {
  const history = useHistory();
  const categoryService = new CategoryService();
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

  let subscription: any;

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);

    reset();

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
        <span className="progress-bar-container">
          <div className="progress-bar one-third-width"></div>
        </span>
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
        <span className="trade-steps">1/3</span>
      </IonHeader>
      <IonContent>
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
