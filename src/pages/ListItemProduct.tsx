import { useState, useEffect, useRef } from 'react';
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
import Select from '../components/Select';
import Button from '../components/Button';

import './ListItem.scss';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { UserService } from '../services/UserService';
import { ProductService } from '../services/ProductService';
import { FileService } from '../services/FileService';
import { attributes } from '../data/list-item-attributes';
import {
  CreateProductRequest,
  Product,
  User,
  ItemAttributes,
  ItemAttributesWithValues,
} from '../models';
import { listingStore, ListingState } from '../listing-store';

interface InternalValues {
  file: any;
}

const ListItemProduct: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const productService = new ProductService();
  const fileService = new FileService();
  const [isTrade, setIsTrade] = useState(false);
  const [tradeSteps, setTradeSteps] = useState(4);
  const [itemCategory, setItemCategory] = useState('');
  const [itemSubcategory, setItemSubcategory] = useState('');
  const [itemType, setItemType] = useState('');
  const [fileName, setFileName] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [seletectedAttributes, setSelectedAttributes] = useState<ItemAttributesWithValues[]>(
    attributes.map((attribute: ItemAttributes) => {
      return {
        ...attribute,
        value: '',
      };
    })
  );
  const [showAdditionalConditionDetails, setShowAdditionalConditionDetails] = useState(false);
  const [additionalConditionDetails, setAdditionalConditionDetails] = useState<string[]>([]);
  let [experience, setExperience] = useState<string>('women');

  const fileVals = useRef<InternalValues>({
    file: false,
  });

  const imageRef = useRef<HTMLInputElement>(null);

  let subscription: any;

  useIonViewWillEnter(() => {
    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);
    reset(isTradeUrl);

    subscription = listingStore.subscribe((state: ListingState) => {
      console.log('state', state);
      if (!state.itemCategory) {
        //history.push('/list/category');
        history.goBack();
        return;
      }

      setItemCategory(state.itemCategory);
      setItemSubcategory(state.itemSubcategory);
      setItemType(state.itemType);
    });

    userService.getMe().then((user: User) => {
      experience = user.experiencePreferences;
      setExperience(experience);
    });
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  useEffect(() => {
    console.log('useEffect');
    const newAttributes = attributes.filter((attr: ItemAttributes) => {
      const showFieldForClothing =
        attr.visible.includes('Clothing') &&
        (itemSubcategory.includes('[MEN]') || itemSubcategory.includes('[WOMEN]'));
      const showFieldForWomensClothing =
        attr.visible.includes("Women's Clothing") && itemSubcategory.includes('[WOMEN]');
      const showFieldForMensClothing =
        attr.visible.includes("Men's Clothing") && itemSubcategory.includes('[MEN]');
      const ret =
        (attr.visible === 'All' && itemSubcategory !== 'EditSneakers') ||
        showFieldForClothing ||
        showFieldForMensClothing ||
        showFieldForWomensClothing ||
        attr.visible.includes(itemSubcategory) ||
        attr.visible.includes(itemType);
      return ret;
    });
    const attribs = newAttributes.map((attr: ItemAttributes) => {
      return {
        ...attr,
        value: '',
      };
    });
    //console.log('attribs', attribs);
    setSelectedAttributes(attribs);
    setAdditionalConditionDetails([]);
    setShowAdditionalConditionDetails(false);
  }, [itemCategory, itemSubcategory]);

  function reset(isTradeUrl: boolean) {
    setTradeSteps(isTradeUrl ? 2 : 3);
    setShowAdditionalConditionDetails(false);
    setAdditionalConditionDetails([]);
    setFileName('');
  }

  function valid() {
    let valid = true;
    seletectedAttributes.forEach((attribute: ItemAttributesWithValues) => {
      if (attribute.required && !attribute.value) {
        valid = false;
      }
    });
    return valid;
  }

  function getAttributeValue(key: string): ItemAttributesWithValues {
    const foundAttribute = seletectedAttributes.find(
      (attribute: ItemAttributesWithValues) => attribute.id === key
    );
    if (!foundAttribute) {
      return {
        id: '',
        type: '',
        name: '',
        visible: '',
        options: [],
        value: '',
      };
    }
    return foundAttribute;
  }

  function setAttributeValue(key: string, value: string) {
    const newAttributes = seletectedAttributes.map((attribute: ItemAttributesWithValues) => {
      if (attribute.id === key) {
        return {
          ...attribute,
          value,
        };
      }
      return attribute;
    });
    setSelectedAttributes(newAttributes);
    listingStore.setAttributes(newAttributes);
  }

  function handleAdditionalConditionDetails(value: string) {
    if (additionalConditionDetails.includes(value)) {
      const newAdditionalConditionDetails = additionalConditionDetails.filter(
        (detail: string) => detail !== value
      );
      setAdditionalConditionDetails(newAdditionalConditionDetails);
      listingStore.setConditionDetails(newAdditionalConditionDetails);
    } else {
      setAdditionalConditionDetails([...additionalConditionDetails, value]);
      listingStore.setConditionDetails([...additionalConditionDetails, value]);
    }
  }

  function showIfAttributeIsVisible(key: string): boolean {
    if (getAttributeValue(key).showIf) {
      const showIf = getAttributeValue(key).showIf;
      const showIfAttribute = showIf && getAttributeValue(showIf.key);
      if (showIfAttribute?.value === showIf?.value) {
        return true;
      }
      return false;
    }
    return true;
  }

  function hideIfAttributeIsVisible(key: string): boolean {
    if (getAttributeValue(key).hideIf) {
      if (getAttributeValue(key).hideIf?.category.includes(itemType)) {
        return true;
      }
      return false;
    }
    return false;
  }

  function onFileChange(e: any) {
    e.preventDefault();
    console.log('onFileChange', e);
    fileVals.current.file = e.target.files[0];
    setFileName(e.target.files[0].name);
    let formData = new FormData();
    formData.append('file', fileVals.current.file);
    fileService
      .uploadFiles(formData)
      .then(res => {
        setReceiptUrl(res.url);
        setFileName(res.originalName);
      })
      .catch(err => {
        console.log('error uploading file', err);
      });
  }

function a() { whee; }
function b() {
whee();
}

  function submit() {
    console.log('submit', receiptUrl, fileName, seletectedAttributes, additionalConditionDetails);
    const state = listingStore.getCurrent();
    const product: CreateProductRequest = {
      attributes: seletectedAttributes.filter(a => a.value).map(a => { id: a.id, value: a.value }),
      images: state.photos.map(p => { url: p, originalName: 'photo.jpg' }),
      action: 'sell',
      name: '',
      brand: state.brand,
      description: '',
      receipt: receiptUrl,
      price: state.price!,
      retailPrice: 0,
      category: '',
      parentCategory: '',
    };
    console.log('product', product);
    //productService.createProduct(product).then(p => {
    //  console.log('p', p);
    //});
  }

  return (
    <IonPage className="list-item-page">
      <IonHeader className="list-item-header">
        <span className="progress-bar-container">
          <div
            className={`progress-bar
              ${tradeSteps === 1 && 'one-third-width'}
              ${tradeSteps === 2 && 'two-thirds-width'}
              ${tradeSteps === 3 && 'full-width'}`}
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
      <IonContent>
        <IonGrid className="list-item-content">
          <IonRow>
            <IonCol>
              <div className="list-item-instruction">Input your product details</div>
            </IonCol>
          </IonRow>
          <div className="padding-bottom-container">
            {seletectedAttributes.map((attr: ItemAttributes) => {
              if (
                attr.type === 'select' &&
                showIfAttributeIsVisible(attr.id) &&
                !hideIfAttributeIsVisible(attr.id)
              ) {
                return (
                  <IonRow key={attr.id} className="margin-bottom-5">
                    <IonCol>
                      <Select
                        value={getAttributeValue(attr.id).value}
                        placeholder={`${getAttributeValue(attr.id).name}${
                          attr.required ? '*' : ''
                        }`}
                        options={
                          getAttributeValue(attr.id).options?.map((o: any) => ({
                            label: o,
                            value: o,
                          })) || []
                        }
                        onChange={e => {
                          setAttributeValue(attr.id, e?.length ? e[0] : '');
                        }}
                      />
                    </IonCol>
                  </IonRow>
                );
              } else if (
                attr.type === 'input' &&
                showIfAttributeIsVisible(attr.id) &&
                !hideIfAttributeIsVisible(attr.id)
              ) {
                return (
                  <IonRow key={attr.id} className="margin-bottom-5">
                    <IonCol>
                      <Input
                        value={getAttributeValue(attr.id).value}
                        className="input-height"
                        placeholder={`${getAttributeValue(attr.id).name}${
                          attr.required ? '*' : ''
                        }`}
                        onChange={val => {
                          setAttributeValue(attr.id, val);
                        }}
                      />
                    </IonCol>
                  </IonRow>
                );
              } else if (attr.type === 'textarea') {
                return (
                  <IonRow key={attr.id} className="margin-bottom-5">
                    <IonCol>
                      <Textarea
                        value={getAttributeValue(attr.id).value}
                        placeholder={`${getAttributeValue(attr.id).name}${
                          attr.required ? '*' : ''
                        }`}
                        onChange={val => {
                          setAttributeValue(attr.id, val);
                        }}
                      />
                    </IonCol>
                  </IonRow>
                );
              } else if (attr.type === 'select-multiple') {
                return (
                  <IonRow key={attr.id} className="margin-bottom-5">
                    <IonCol
                      onClick={() => {
                        setShowAdditionalConditionDetails(!showAdditionalConditionDetails);
                      }}
                      className="additional-condition-details-title"
                      size="12"
                    >
                      ADD ADDITIONAL CONDITION DETAILS
                      <img
                        className="additional-details-arrow"
                        src={`assets/images/arrow-${
                          showAdditionalConditionDetails ? 'up' : 'down'
                        }-filled-primary.svg`}
                        alt="arrow"
                      />
                    </IonCol>
                    {showAdditionalConditionDetails &&
                      attr.options?.map((o: any, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              handleAdditionalConditionDetails(o);
                            }}
                            className={`${
                              additionalConditionDetails.includes(o) ? 'selected-detail' : ''
                            } additional-condition-details`}
                          >
                            {o}
                          </div>
                        );
                      })}
                  </IonRow>
                );
              }
            })}
            <IonRow>
              <IonCol>
                <IonRow>
                  <IonCol size="12" className="input-height file-input-border">
                    <label
                      className={`${fileName ? 'opacity-full' : 'opacity-low'}`}
                      htmlFor="fileInput"
                    >
                      {fileName ? fileName : 'UPLOAD RECEIPT'}
                    </label>
                    <input
                      id="fileInput"
                      ref={imageRef}
                      type="file"
                      onChange={e => onFileChange(e)}
                      accept="image/*"
                      placeholder="UPLOAD RECEIPT"
                      className="hide-native-file-button"
                    />
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </div>
        </IonGrid>
      </IonContent>
      <div className="footer footer-gradient">
        <Button
          label="SUBMIT"
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
      </div>
    </IonPage>
  );
};

export default ListItemProduct;
