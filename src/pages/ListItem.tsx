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
import { productItemCategories } from '../data/product-item-categories';
import { brands } from '../data/brands';

import './ListItem.scss';
import Input from '../components/Input';

const ListItem: React.FC = () => {
  const history = useHistory();
  const [isTrade, setIsTrade] = useState(false);
  const [tradeSteps, setTradeSteps] = useState(1);
  const [price, setPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [item, setItem] = useState('');
  const [itemType, setItemType] = useState('');
  const [brand, setBrand] = useState('');

  interface Option {
    label: string;
    value: string;
  }

  const menItems: Option[] = [
    {
      label: 'Bags',
      value: 'Bags',
    },
    {
      label: 'Shoes',
      value: 'Shoes',
    },
    {
      label: 'Jewelry',
      value: 'Jewelry',
    },
    {
      label: 'Accessories',
      value: 'Accessories',
    },
    {
      label: 'Tops',
      value: 'Tops [MEN]',
    },
    {
      label: 'Outerwear',
      value: 'Outerwear [MEN]',
    },
    {
      label: 'Botttoms',
      value: 'Bottoms [MEN]',
    },
    {
      label: 'Suits',
      value: 'Suits [MEN]',
    },
    {
      label: 'Jeans',
      value: 'Jeans [MEN]',
    },
    {
      label: 'Suiting',
      value: 'Suiting [MEN]',
    },
  ];

  const womenItems: Option[] = [
    {
      label: 'Bags',
      value: 'Bags',
    },
    {
      label: 'Shoes',
      value: 'Shoes',
    },
    {
      label: 'Jewelry',
      value: 'Jewelry',
    },
    {
      label: 'Accessories',
      value: 'Accessories',
    },
    {
      label: 'Tops',
      value: 'Tops [WOMEN]',
    },
    {
      label: 'Dresses',
      value: 'Dresses [WOMEN]',
    },
    {
      label: 'Outerwear',
      value: 'Outerwear [WOMEN]',
    },
    {
      label: 'Activewear',
      value: 'Activewear [WOMEN]',
    },
    {
      label: 'Swim',
      value: 'Swim [WOMEN]',
    },
    {
      label: 'Bottoms',
      value: 'Bottoms [WOMEN]',
    },
    {
      label: 'Jeans',
      value: 'Jeans [WOMEN]',
    },
    {
      label: 'Suiting',
      value: 'Suiting [WOMEN]',
    },
  ];

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

  const valid = () => {
    if (itemCategory === 'sneakers') return itemCategory && brand && price;
    else {
      return itemCategory && item && brand && price && itemType;
    }
  };

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);
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
              history.goBack();
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
                Choose the category for the item being listed to unlock other
                details
              </div>
            </IonCol>
          </IonRow>
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
                    options={productItemCategories[item]?.map((c: string) => ({
                      label: c,
                      value: c,
                    }))}
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
                options={brands.map((b: string) => ({
                  label: b,
                  value: b,
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
          }}
        />
      </div>
    </IonPage>
  );
};

export default ListItem;
