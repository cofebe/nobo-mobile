import { useState, useEffect, useRef } from 'react';
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
import Textarea from '../components/Textarea';
import { CategoryService } from '../services/CategoryService';
import { ProductService } from '../services/ProductService';
import { FileService } from '../services/FileService';
import { attributes } from '../data/list-item-attributes';
import { Category, CategoriesResponse, BrandsResponse, Brand, ItemAttributes } from '../models';

interface ItemAttributesWithValues extends ItemAttributes {
  value: string;
}

const ListItem: React.FC = () => {
  const history = useHistory();
  const categoryService = new CategoryService();
  const productService = new ProductService();
  const fileService = new FileService();
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
  const [fileName, setFileName] = useState<string>('');
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

  const fileVals = useRef<InternalValues>({
    file: false,
  });

  const imageRef = useRef<HTMLInputElement>(null);

  interface TradeOption {
    brand: string;
    title: string;
    description: string;
  }

  interface Option {
    label: string;
    value: string;
  }

  interface InternalValues {
    file: any;
  }

  const onFileChange = (e: any) => {
    e.preventDefault();
    fileVals.current.file = e.target.files[0];
    setFileName(e.target.files[0].name);
    let formData = new FormData();
    formData.append('file', fileVals.current.file);
    fileService
      .uploadFiles(formData)
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('error uploading file', err);
      });
  };

  useEffect(() => {
    let currentItem = item;
    if (item.includes('[MEN]') || item.includes('[WOMEN]')) {
      currentItem = 'Clothing';
    } else if (itemCategory === 'sneakers') {
      currentItem = 'Sneakers';
    }
    const newAttributes = attributes.filter((attribute: ItemAttributes) => {
      return (
        attribute.visible === 'All' ||
        attribute.visible.includes(item) ||
        attribute.visible.includes(currentItem)
      );
    });
    setSelectedAttributes(
      newAttributes.map((attribute: ItemAttributes) => {
        return {
          ...attribute,
          value: '',
        };
      })
    );
    setAdditionalConditionDetails([]);
    setShowAdditionalConditionDetails(false);
    setFileName('');
  }, [item, itemCategory]);

  const reset = () => {
    setPrice('');
    setItemCategory('');
    setItem('');
    setItemType('');
    setBrand('');
    setTradeSteps(1);
    setShowAdditionalConditionDetails(false);
    setAdditionalConditionDetails([]);
    setFileName('');
  };

  const getItems = () => {
    switch (itemCategory) {
      case 'men':
        return menItems;
      case 'women':
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

  const validItemDetails = () => {
    let valid = true;
    seletectedAttributes.forEach((attribute: ItemAttributesWithValues) => {
      if (attribute.required && !attribute.value) {
        valid = false;
      }
    });
    return valid;
  };

  const getAttributeValue = (key: string): ItemAttributesWithValues => {
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
  };

  const setAttributeValue = (key: string, value: string) => {
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
  };

  const handleAdditionalConditionDetails = (value: string) => {
    if (additionalConditionDetails.includes(value)) {
      const newAdditionalConditionDetails = additionalConditionDetails.filter(
        (detail: string) => detail !== value
      );
      setAdditionalConditionDetails(newAdditionalConditionDetails);
    } else {
      setAdditionalConditionDetails([...additionalConditionDetails, value]);
    }
  };

  const showIfAttributeIsVisible = (key: string): boolean => {
    if (getAttributeValue(key).showIf) {
      const showIf = getAttributeValue(key).showIf;
      const showIfAttribute = showIf && getAttributeValue(showIf.key);
      if (showIfAttribute?.value === showIf?.value) {
        return true;
      }
      return false;
    }
    return true;
  };

  const hideIfAttributeIsVisible = (key: string): boolean => {
    if (getAttributeValue(key).hideIf) {
      if (getAttributeValue(key).hideIf?.category.includes(itemType)) {
        return false;
      }
      return true;
    }
    return true;
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
        setBrands(res.brands);
      })
      .catch(err => console.error(err));
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
          <div className="title">{isTrade ? 'LIST MY ITEM TO TRADE' : 'LIST MY ITEM TO SELL'}</div>
        </div>
        <span className="trade-steps">{tradeSteps}/3</span>
      </IonHeader>
      <IonContent>
        <IonGrid className="list-item-content">
          <IonRow>
            <IonCol>
              <div className="list-item-instruction">
                {tradeSteps === 1 && (
                  <>Choose the category for the item being listed to unlock other details</>
                )}
                {tradeSteps === 2 && <>Input your product details</>}
                {tradeSteps === 3 && (
                  <>
                    Select potential trade items so we know what you’re looking for. These items
                    must be within a 20% bandwidth of your product
                  </>
                )}
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
                    onChange={e => {
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
                        value={item}
                        onChange={e => {
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
                        onChange={e => {
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
                    onChange={e => {
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
                    onChange={val => {
                      setPrice(val);
                    }}
                  />
                </IonCol>
              </IonRow>
            </>
          )}
          {tradeSteps === 2 && seletectedAttributes && (
            <div className="padding-bottom-container">
              {seletectedAttributes.map((attr: ItemAttributes) => {
                if (
                  attr.type === 'select' &&
                  showIfAttributeIsVisible(attr.id) &&
                  hideIfAttributeIsVisible(attr.id)
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
                  hideIfAttributeIsVisible(attr.id)
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
                        attr.options?.map((o: any) => {
                          return (
                            <div
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
          )}
          {tradeSteps === 3 && (
            <div className="padding-bottom-container">
              {[...Array(3)].map((_, i) => (
                <>
                  <IonRow key={i} className="margin-bottom-5">
                    {i === 0 ? (
                      <>
                        <IonCol className="trade-option-title" size="6">
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
                          <input type="checkbox" />
                          <div style={{ marginLeft: 4 }} className="luxury-options-title">
                            Open to all luxury options
                          </div>
                        </IonCol>
                      </>
                    ) : (
                      <IonCol className="trade-option-title">Trade Option {i + 1}</IonCol>
                    )}
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <Select
                        value={tradeOptions[i].brand}
                        options={brands.map((b: Brand) => ({
                          label: b.name,
                          value: b.name,
                        }))}
                        placeholder="DESIGNER/BRAND"
                        onChange={e => {
                          setTradeOptions(prev => {
                            prev[i].brand = e?.length ? e[0] : '';
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
                        placeholder="PRODUCT TITLE"
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
                        placeholder="DESCRIPTION"
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
          )}
        </IonGrid>
      </IonContent>
      {tradeSteps === 1 && (
        <div className="footer">
          <Button
            disabled={!valid()}
            label="Next"
            large={true}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setTradeSteps(tradeSteps + 1);
            }}
          />
        </div>
      )}
      {tradeSteps === 2 && (
        <div className="footer footer-gradient">
          <Button
            disabled={!validItemDetails()}
            label="Next"
            large={true}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setTradeSteps(tradeSteps + 1);
            }}
          />
        </div>
      )}
      {tradeSteps === 3 && (
        <div className="footer footer-gradient">
          <Button
            label="Submit"
            large={true}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          <div className="cancel-exit">Cancel and Exit</div>
        </div>
      )}
    </IonPage>
  );
};

export default ListItem;
