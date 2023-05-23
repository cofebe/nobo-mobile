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
import Select from '../components/Select';
import Button from '../components/Button';
import Input from '../components/Input';
import { CategoryService } from '../services/CategoryService';
import { ProductService } from '../services/ProductService';
import { listingStore, ListingState } from '../listing-store';
import { Category, CategoriesResponse, Brand, BrandsResponse } from '../models';

interface Option {
  label: string;
  value: string;
}

const ListItemCategory: React.FC = () => {
  const history = useHistory();
  const categoryService = new CategoryService();
  const productService = new ProductService();
  const [isTrade, setIsTrade] = useState(false);
  const [price, setPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemSubcategory, setItemSubcategory] = useState('');
  const [itemType, setItemType] = useState('');
  const [brand, setBrand] = useState('');
  const [menItems, setMenItems] = useState<Option[]>([]);
  const [womenItems, setWomenItems] = useState<Option[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  let subscription: any;

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);

    reset();

    //listingStore.reset();
    subscription = listingStore.subscribe((state: ListingState) => {
      console.log('state', state);
      setItemCategory(state.itemCategory);
      setItemSubcategory(state.itemSubcategory);
      setItemType(state.itemType);
      setBrand(state.brand);
      setPrice(state.price === null ? '' : state.price.toString());
    });

    categoryService
      .getAllCategories()
      .then((res: CategoriesResponse) => {
        const uniqueWomenCategoryNames = new Set();
        const uniqueMenCategoryNames = new Set();
        res.docs
          .filter((doc: Category) => doc.parent === null && !doc.name.includes('[WOMEN]'))
          .forEach((doc: Category) => {
            if (!uniqueMenCategoryNames.has(doc.name)) {
              uniqueMenCategoryNames.add(doc.name);
            }
          });
        res.docs
          .filter((doc: Category) => doc.parent === null && !doc.name.includes('[MEN]'))
          .forEach((doc: Category) => {
            if (!uniqueWomenCategoryNames.has(doc.name)) {
              uniqueWomenCategoryNames.add(doc.name);
            }
          });
        const uniqueWomenCategories = Array.from(uniqueWomenCategoryNames).map((name: any) => {
          return {
            label: name.replace('[WOMEN]', '').trim(),
            value: name,
          };
        });
        const uniqueMenCategories = Array.from(uniqueMenCategoryNames).map((name: any) => {
          return {
            label: name.replace('[MEN]', '').trim(),
            value: name,
          };
        });
        setMenItems(uniqueMenCategories);
        setWomenItems(uniqueWomenCategories);
        setAllCategories(res.docs);
      })
      .catch(err => console.error(err));
    productService
      .getBrands()
      .then((res: BrandsResponse) => {
        res.brands.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        setBrands(res.brands);
      })
      .catch(err => console.error(err));
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  function reset() {
    setPrice('');
    setItemCategory('');
    setItemSubcategory('');
    setItemType('');
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
    const uniqueItemTypes = new Set();
    allCategories
      .filter((category: Category) => category?.parent?.name === itemSubcategory)
      .forEach((category: Category) => {
        if (!uniqueItemTypes.has(category.name)) {
          uniqueItemTypes.add(category.name);
        }
      });
    return Array.from(uniqueItemTypes).map((itemType: any) => {
      return {
        label: itemType,
        value: itemType,
      };
    });
  }

  function valid() {
    if (itemCategory === 'sneakers') return itemCategory && brand && price;
    else {
      return itemCategory && itemSubcategory && brand && price && itemType;
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
                    setItemSubcategory('');
                    setItemType('');
                    setBrand('');
                    setPrice('');
                    setItemCategory(e?.length ? e[0] : '');
                    listingStore.beginUpdate();
                    listingStore.setItemCategory(e?.length ? e[0] : '');
                    listingStore.setItemSubcategory('');
                    listingStore.setItemType('');
                    listingStore.setBrand('');
                    listingStore.setPrice(null);
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
                        setItemType('');
                        setBrand('');
                        setPrice('');
                        setItemSubcategory(e?.length ? e[0] : '');
                        listingStore.beginUpdate();
                        listingStore.setItemType('');
                        listingStore.setBrand('');
                        listingStore.setPrice(null);
                        listingStore.setItemSubcategory(e?.length ? e[0] : '');
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
                        setItemType(e?.length ? e[0] : '');
                        listingStore.setItemType(e?.length ? e[0] : '');
                      }}
                      options={getItemType()}
                    />
                  </IonCol>
                </IonRow>
              </>
            )}
            <IonRow className="margin-bottom-5">
              <IonCol>
                <Select
                  disabled={!itemType && itemCategory !== 'sneakers'}
                  value={brand}
                  onChange={e => {
                    setBrand(e?.length ? e[0] : '');
                    listingStore.setBrand(e?.length ? e[0] : '');
                  }}
                  placeholder="Select Brand"
                  options={brands.map((b: Brand) => ({
                    label: b.name,
                    value: b.name,
                  }))}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <Input
                  disabled={!brand && !itemSubcategory && !itemType}
                  type="number"
                  value={price}
                  className={`input-height ${!brand && 'disabled-input'}`}
                  placeholder="PRICE"
                  onChange={val => {
                    setPrice(val);
                    listingStore.setPrice(+val);
                  }}
                />
              </IonCol>
            </IonRow>
          </>
        </IonGrid>
      </IonContent>
      <div className="footer">
        <Button
          disabled={!valid()}
          label="Next"
          large={true}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/list/image');
          }}
        />
      </div>
    </IonPage>
  );
};

export default ListItemCategory;
