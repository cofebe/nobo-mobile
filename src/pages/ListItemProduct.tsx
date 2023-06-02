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
import Select, { SelectOption } from '../components/Select';
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
  Category,
  User,
  ItemAttributes,
  ItemAttributesWithValues,
} from '../models';
import { listingStore, TopLevelCategory, ListingState } from '../listing-store';

interface InternalValues {
  file: any;
}

const ListItemProduct: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const productService = new ProductService();
  const fileService = new FileService();
  const [isTrade, setIsTrade] = useState(false);
  const [tradeSteps, setTradeSteps] = useState(3);
  const [itemCategory, setItemCategory] = useState<TopLevelCategory>('');
  const [itemSubcategory, setItemSubcategory] = useState<Category | null>(null);
  const [itemType, setItemType] = useState<Category | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [productTitle, setProductTitle] = useState('');
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
    const isTradeUrl = history.location.pathname.includes('trade');
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
    console.log('useEffect', itemCategory, itemSubcategory, itemType);
    if (!itemCategory || !itemSubcategory || !itemType) {
      return;
    }

    const newAttributes = attributes.filter((attr: ItemAttributes) => {
      const showFieldForClothing =
        attr.visible.includes('Clothing') &&
        (itemSubcategory?.name.includes('[MEN]') || itemSubcategory?.name.includes('[WOMEN]'));
      const showFieldForWomensClothing =
        attr.visible.includes("Women's Clothing") && itemSubcategory?.name.includes('[WOMEN]');
      const showFieldForMensClothing =
        attr.visible.includes("Men's Clothing") && itemSubcategory?.name.includes('[MEN]');
      const ret =
        (attr.visible === 'All' && itemSubcategory?.name !== 'EditSneakers') ||
        showFieldForClothing ||
        showFieldForMensClothing ||
        showFieldForWomensClothing ||
        attr.visible.includes(itemSubcategory!.name) ||
        attr.visible.includes(itemType!.name);
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
  }, [itemCategory, itemSubcategory, itemType]);

  function reset(isTradeUrl: boolean) {
    setTradeSteps(isTradeUrl ? 2 : 3);
    setShowAdditionalConditionDetails(false);
    setAdditionalConditionDetails([]);
    setFileName('');
  }

  function valid() {
    let valid = !!productTitle;
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
    if (itemType === null) {
      return false;
    }

    if (getAttributeValue(key).hideIf) {
      if (getAttributeValue(key).hideIf?.category.includes(itemType!.name)) {
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

  function submit() {
    console.log('submit', receiptUrl, fileName, seletectedAttributes, additionalConditionDetails);
    const state = listingStore.getCurrent();
    const product: CreateProductRequest = {
      attributes: seletectedAttributes
        .filter(a => a.value)
        .map(a => {
          return { id: a.id, value: a.value };
        }),
      images: state.photos
        .filter(p => p)
        .map(p => {
          return { url: p, originalName: 'photo.jpg' };
        }),
      action: 'sell',
      name: productTitle,
      brand: state.brand,
      description: '',
      receipt: receiptUrl,
      price: state.price,
      retailPrice: state.estimatedPrice,
      category: itemType!._id,
      parentCategory: itemSubcategory!._id,
      group: itemCategory,
    };
    if (showAdditionalConditionDetails) {
      product.attributes.push({
        id: 'condition-details',
        value: additionalConditionDetails,
      });
    }
    if (receiptUrl) {
      product.receipt = receiptUrl;
    }
    console.log('product', product);
    productService.createProduct(product).then(p => {
      console.log('p', p, JSON.stringify(p));
      listingStore.setProduct(p);
    });
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
            <IonRow className="margin-bottom-5">
              <IonCol>
                <Input
                  value={productTitle}
                  className="input-height"
                  placeholder="Product Title *"
                  onChange={val => {
                    setProductTitle(val);
                  }}
                />
              </IonCol>
            </IonRow>
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
                          setAttributeValue(attr.id, e[0]);
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
