import { useState, useEffect } from 'react';
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
import BrandSelect from '../components/BrandSelect';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { CreateProductRequest, User } from '../models';
import { listingStore, ListingState } from '../listing-store';

interface TradeOption {
  brand: string;
  title: string;
  description: string;
}

const ListItemTradeOptions: React.FC = () => {
  const history = useHistory();
  const productService = new ProductService();
  const userService = new UserService();
  const [isTrade, setIsTrade] = useState(false);
  const [tradeSteps, setTradeSteps] = useState(3);
  const [allOptions, setAllOptions] = useState(false);
  const [tradeOptions, setTradeOptions] = useState<TradeOption[]>([
    {
      brand: '',
      title: '',
      description: '',
    },
    {
      brand: '',
      title: '',
      description: '',
    },
    {
      brand: '',
      title: '',
      description: '',
    },
  ]);
  let [experience, setExperience] = useState<string>('women');

  let subscription: any;

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);

    reset();

    subscription = listingStore.subscribe((state: ListingState) => {
      console.log('state', state);
      if (!state.itemCategory) {
        //history.push('/list/category');
        history.goBack();
        return;
      }
    });

    userService.getMe().then((user: User) => {
      experience = user.experiencePreferences;
      setExperience(experience);
    });
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  function reset() {
    setTradeSteps(3);
  }

  function valid() {
    return (
      allOptions || tradeOptions.filter(to => to.brand && to.title && to.description).length === 3
    );
  }

  function submit() {
    console.log('submit');
    const state = listingStore.getCurrent();
    const product: CreateProductRequest = {
      attributes: state.attributes
        .filter(a => a.value)
        .map(a => {
          return { id: a.id, value: a.value };
        }),
      images: state.photos
        .filter(p => p)
        .map(p => {
          return { url: p, originalName: 'photo.jpg' };
        }),
      action: 'trade',
      name: state.productTitle,
      brand: state.brand,
      description: '',
      receipt: state.receiptUrl,
      price: state.price,
      retailPrice: state.estimatedPrice,
      category: state.itemType!._id,
      parentCategory: state.itemSubcategory!._id,
      group: state.itemCategory,
    };
    if (state.conditionDetails?.length) {
      product.attributes.push({
        id: 'condition-details',
        value: state.conditionDetails,
      });
    }
    if (state.receiptUrl) {
      product.receipt = state.receiptUrl;
    }
    if (allOptions) {
      product.openToAllLuxuryOptions = true;
      product.potentialTradeItems = [{}, {}, {}];
    } else {
      product.openToAllLuxuryOptions = false;
      product.potentialTradeItems = tradeOptions.map(to => ({
        designer: to.brand,
        productName: to.title,
        notes: to.description,
      }));
    }
    console.log('product', product);
    productService.createProduct(product).then(p => {
      console.log('p', p, JSON.stringify(p));
      listingStore.setProduct(p);
      history.push('/list/trade-confirm');
    });
  }

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
          <div className="title">{isTrade ? 'LIST MY ITEM TO TRADE' : 'LIST MY ITEM TO SELL'}</div>
        </div>
        <span className="trade-steps">{tradeSteps}/3</span>
      </IonHeader>
      <IonContent style={{ zIndex: 100 }}>
        <IonGrid className="list-item-content">
          <div className="">
            {[...Array(3)].map((_, i) => (
              <>
                <IonRow key={i} className="margin-bottom-5">
                  {i === 0 ? (
                    <>
                      <IonCol
                        className={'trade-option-title' + (allOptions ? ' disabled' : '')}
                        size="6"
                      >
                        Trade Option {i + 1}
                      </IonCol>
                      <IonCol
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                        size="6"
                      >
                        <Checkbox
                          value={allOptions}
                          label="Open to all luxury options"
                          onChange={val => {
                            setAllOptions(val);
                          }}
                        ></Checkbox>
                      </IonCol>
                    </>
                  ) : (
                    <IonCol className={'trade-option-title' + (allOptions ? ' disabled' : '')}>
                      Trade Option {i + 1}
                    </IonCol>
                  )}
                </IonRow>
                <IonRow>
                  <IonCol>
                    <BrandSelect
                      value={tradeOptions[i].brand}
                      placeholder="DESIGNER/BRAND"
                      disabled={allOptions}
                      onChange={val => {
                        setTradeOptions(prev => {
                          prev[i].brand = val;
                          return [...prev];
                        });
                      }}
                    />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <Input
                      className="input-height"
                      value={tradeOptions[i].title}
                      placeholder="Product Title"
                      disabled={allOptions}
                      onChange={val => {
                        setTradeOptions(prev => {
                          prev[i].title = val;
                          return [...prev];
                        });
                      }}
                    />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <Input
                      className="input-height"
                      value={tradeOptions[i].description}
                      disabled={allOptions}
                      placeholder="Description"
                      onChange={val => {
                        setTradeOptions(prev => {
                          prev[i].description = val;
                          return [...prev];
                        });
                      }}
                    />
                  </IonCol>
                </IonRow>
              </>
            ))}
          </div>
          <IonRow>
            <IonCol className="button-container">
              <Button
                label="Submit"
                large={true}
                disabled={!valid()}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  submit();
                }}
              />
              <div
                className="cancel-exit"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  listingStore.reset();

                  const url = `/home/explore/${experience}/explore`;
                  history.push(url);
                }}
              >
                Cancel and Exit
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ListItemTradeOptions;
