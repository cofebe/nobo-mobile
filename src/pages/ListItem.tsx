import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/react';
import { useHistory } from 'react-router';
import Select from '../components/Select';
import Button from '../components/Button';

import './ListItem.scss';
import Input from '../components/Input';
import { CategoryService } from '../services/CategoryService';
import { ProductService } from '../services/ProductService';
import { Category, CategoriesResponse, BrandsResponse, Brand } from '../models';

const ListItem: React.FC = () => {
  const history = useHistory();
  const categoryService = new CategoryService();
  const productService = new ProductService();
  const [isTrade, setIsTrade] = useState(false);
  const [tradeSteps, setTradeSteps] = useState(1);
  const [price, setPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [item, setItem] = useState('');
  const [itemType, setItemType] = useState('');
  const [brand, setBrand] = useState('');
  const [menItems, setMenItems] = useState<Option[]>([]);
  const [womenItems, setWomenItems] = useState<Option[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  interface Option {
    label: string;
    value: string;
  }

  const reset = () => {
    setPrice('');
    setItemCategory('');
    setItem('');
    setItemType('');
    setBrand('');
    setTradeSteps(1);
  };

  const getItems = () => {
    switch (itemCategory) {
      case 'men':
        return menItems;
      case 'woman':
        return womenItems;
      default:
        return [];
    }
  };

  const getItemType = () => {
    const uniqueItemTypes = new Set();
    allCategories
      .filter((category: Category) => category?.parent?.name === item)
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
  };

  const valid = () => {
    if (itemCategory === 'sneakers') return itemCategory && brand && price;
    else {
      return itemCategory && item && brand && price && itemType;
    }
  };

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);
    reset();
    categoryService
      .getAllCategories()
      .then((res: CategoriesResponse) => {
        const uniqueWomenCategoryNames = new Set();
        const uniqueMenCategoryNames = new Set();
        res.docs
          .filter(
            (doc: Category) =>
              doc.parent === null && !doc.name.includes('[WOMEN]')
          )
          .forEach((doc: Category) => {
            if (!uniqueMenCategoryNames.has(doc.name)) {
              uniqueMenCategoryNames.add(doc.name);
            }
          });
        res.docs
          .filter(
            (doc: Category) =>
              doc.parent === null && !doc.name.includes('[MEN]')
          )
          .forEach((doc: Category) => {
            if (!uniqueWomenCategoryNames.has(doc.name)) {
              uniqueWomenCategoryNames.add(doc.name);
            }
          });
        const uniqueWomenCategories = Array.from(uniqueWomenCategoryNames).map(
          (name: any) => {
            return {
              label: name.replace('[WOMEN]', '').trim(),
              value: name,
            };
          }
        );
        const uniqueMenCategories = Array.from(uniqueMenCategoryNames).map(
          (name: any) => {
            return {
              label: name.replace('[MEN]', '').trim(),
              value: name,
            };
          }
        );
        setMenItems(uniqueMenCategories);
        setWomenItems(uniqueWomenCategories);
        setAllCategories(res.docs);
      })
      .catch((err) => console.error(err));
    productService
      .getBrands()
      .then((res: BrandsResponse) => {
        setBrands(res.brands);
      })
      .catch((err) => console.error(err));
  });
  return (
    <IonPage className="list-item-page">
      <IonHeader className="list-item-header">
        <span className="progress-bar-container">
          <div
            className={`progress-bar ${tradeSteps === 1 && 'one-third-width'} ${
              tradeSteps === 2 && 'two-thirds-width'
            } ${tradeSteps === 3 && 'full-width'}`}
          ></div>
        </span>
        <div className="titles">
          <img
            src="assets/images/arrow-left.svg"
            className="back-arrow"
            alt="back"
            onClick={() => {
              if (tradeSteps === 1) history.goBack();
              else setTradeSteps(tradeSteps - 1);
            }}
          />
          <div className="title">
            {isTrade ? 'LIST MY ITEM TO TRADE' : 'LIST MY ITEM TO SELL'}
          </div>
        </div>
        <span className="trade-steps">{tradeSteps}/3</span>
      </IonHeader>
      <IonContent>
        <IonGrid className="list-item-content">
          <IonRow>
            <IonCol>
              <div className="list-item-instruction">
                {tradeSteps === 1 && (
                  <>
                    Choose the category for the item being listed to unlock
                    other details
                  </>
                )}
                {tradeSteps === 2 && <>Input your product details</>}
              </div>
            </IonCol>
          </IonRow>
          {tradeSteps === 1 && (
            <>
              <IonRow className="margin-bottom-5">
                <IonCol>
                  <Select
                    value={itemCategory}
                    placeholder="Select Category"
                    onChange={(e) => {
                      setItem('');
                      setItemType('');
                      setBrand('');
                      setPrice('');
                      setItemCategory(e?.length ? e[0] : '');
                    }}
                    options={[
                      {
                        label: 'Men',
                        value: 'men',
                      },
                      {
                        label: 'Woman',
                        value: 'woman',
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
                        value={item}
                        onChange={(e) => {
                          setItemType('');
                          setBrand('');
                          setPrice('');
                          setItem(e?.length ? e[0] : '');
                        }}
                        options={getItems()}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow className="margin-bottom-5">
                    <IonCol>
                      <Select
                        disabled={!item}
                        value={itemType}
                        placeholder="Select Type"
                        onChange={(e) => {
                          setItemType(e?.length ? e[0] : '');
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
                    onChange={(e) => {
                      setBrand(e?.length ? e[0] : '');
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
                    disabled={!brand && !item && !itemType}
                    value={price}
                    className={`input-height ${!brand && 'disabled-input'}`}
                    placeholder="PRICE"
                    onChange={(val) => {
                      setPrice(val);
                    }}
                  />
                </IonCol>
              </IonRow>
            </>
          )}
          {tradeSteps === 2 && (
            <>
              {item === 'Bags' && (
                <IonRow className="margin-bottom-5">
                  <IonCol>
                    <Input
                      onChange={(val) => {}}
                      placeholder="PRODUCT TITLE*"
                    />
                  </IonCol>
                </IonRow>
              )}
            </>
          )}
        </IonGrid>
      </IonContent>
      <div className="footer">
        <Button
          disabled={!valid()}
          label="Next"
          large={true}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTradeSteps(tradeSteps + 1);
          }}
        />
      </div>
    </IonPage>
  );
};

export default ListItem;
