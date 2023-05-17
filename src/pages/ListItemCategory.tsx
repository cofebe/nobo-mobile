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
import { FeedService } from '../services/FeedService';
import { CategoryService } from '../services/CategoryService';
import { ProductService } from '../services/ProductService';
import { FileService } from '../services/FileService';
import { attributes } from '../data/list-item-attributes';
import {
  Category,
  CategoriesResponse,
  BrandsResponse,
  Brand,
  ItemAttributes,
} from '../models';

interface ItemAttributesWithValues extends ItemAttributes {
  value: string;
}

const ListItemCategory: React.FC = () => {
  const history = useHistory();
  const categoryService = new CategoryService();
  const productService = new ProductService();
  const fileService = new FileService();
  const [isTrade, setIsTrade] = useState(false);
  const [tradeSteps, setTradeSteps] = useState(4);
  const [photos, setPhotos] = useState<string[]>([]);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
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
  const [seletectedAttributes, setSelectedAttributes] = useState<
    ItemAttributesWithValues[]
  >(
    attributes.map((attribute: ItemAttributes) => {
      return {
        ...attribute,
        value: '',
      };
    })
  );
  const [showAdditionalConditionDetails, setShowAdditionalConditionDetails] =
    useState(false);

  const [additionalConditionDetails, setAdditionalConditionDetails] = useState<
    string[]
  >([]);
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
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
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
    const newAttributes = seletectedAttributes.map(
      (attribute: ItemAttributesWithValues) => {
        if (attribute.id === key) {
          return {
            ...attribute,
            value,
          };
        }
        return attribute;
      }
    );
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

  const postImgeFileUploadVals = useRef<InternalValues>({
    file: false,
  });
  const feedService = new FeedService();
  const [postImages, setPostImages] = useState('');
  const [postImageName, setPostImageName] = useState('');

  const onPostImageFileChange = async (
    fileChangeEvent: any,
    index?: number
  ) => {
    let file = fileChangeEvent.target.files;

    let obj = new FormData();
    obj.append("file", file[0]);

    const response = await feedService.uploadImage(obj);

    const returnValues = await response.json();

    try {
      let newPostImage: string = returnValues?.url;
      if (newPostImage) {
        if (typeof index !== "undefined") {
          setAdditionalPhotos((prevAdditionalPhotos) => {
            const updatedAdditionalPhotos = [...prevAdditionalPhotos];
            updatedAdditionalPhotos[index] = newPostImage;
            return updatedAdditionalPhotos;
          });
        } else {
          setPhotos((prevPhotos) => [newPostImage, ...prevPhotos.slice(1)]);
        }
      }
    } catch (exPostImages) {
      console.log("There was an issue sending the image in the post");
    }
  };

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
                Choose the category for the item being listed to unlock
                other details
              </div>
            </IonCol>
          </IonRow>
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
              history.push('/list/image');
            }}
          />
        </div>
      {tradeSteps === 2 && (
        <div className="footer footer-gradient">
          <Button
            label="Next"
            large={true}
            onClick={(e) => {
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
            disabled={!validItemDetails()}
            label="Next"
            large={true}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTradeSteps(tradeSteps + 1);
            }}
          />
        </div>
      )}
      {tradeSteps === 4 && (
        <div className="footer footer-gradient">
          <Button
            label="NEXT"
            large={true}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTradeSteps(tradeSteps + 1);
            }}
          />
          {/*<div className="cancel-exit">Cancel and Exit</div>*/}
        </div>
      )}
    </IonPage>
  );
};

export default ListItemCategory;
