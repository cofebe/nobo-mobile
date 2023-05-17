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

const ListItemImage: React.FC = () => {
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
        <span className="trade-steps">2/3</span>
      </IonHeader>
      <IonContent>
        <IonGrid className="list-item-content">
          <IonRow>
            <IonCol>
              <div className="list-item-instruction">
                Add photos and pricing for your item
              </div>
            </IonCol>
          </IonRow>
          <div className="padding-bottom-container">
            <div className="photo-uploader">
              <div className="upload-container">
                <label htmlFor="upload-input">
                  {photos.length > 0 ? (
                    <img src={photos[0]} alt="Uploaded photo" />
                  ) : (
                    <div className="upload-placeholder">
                      <svg width="175" height="171" viewBox="0 0 175 171" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="173" height="168.706" rx="4" fill="white" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-dasharray="6 6"/>
                        <path d="M117.025 89.0307C117.025 89.583 116.577 90.0307 116.025 90.0307H92.1779V113.877C92.1779 114.43 91.7302 114.877 91.1779 114.877H84.8957C84.3434 114.877 83.8957 114.43 83.8957 113.877V90.0307H60.0491C59.4968 90.0307 59.0491 89.583 59.0491 89.0307V82.7485C59.0491 82.1962 59.4968 81.7485 60.0491 81.7485H83.8957V57.9019C83.8957 57.3496 84.3434 56.9019 84.8957 56.9019H91.1779C91.7302 56.9019 92.1779 57.3496 92.1779 57.9019V81.7485H116.025C116.577 81.7485 117.025 82.1962 117.025 82.7485V89.0307Z" fill="black"/>
                      </svg>
                    </div>
                  )}
                </label>
                <input
                  className="upload-input"
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={onPostImageFileChange}
                />
              </div>
              <div className="thumbnail-container">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="small-upload-container">
                      <label htmlFor={`small-upload-input-${index}`}>
                        {additionalPhotos[index] ? (
                          <img src={additionalPhotos[index]} alt="Thumbnail" />
                        ) : (
                          <div className="upload-placeholder">
                            <svg width="56" height="55" viewBox="0 0 56 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="55" height="53.6258" rx="4.5" fill="white" stroke="black" stroke-linejoin="round" stroke-dasharray="6 6"/>
                              <path d="M37.4479 27.8097C37.4479 28.362 37.0002 28.8097 36.4479 28.8097H29.497V35.7606C29.497 36.3129 29.0493 36.7606 28.497 36.7606H27.8467C27.2944 36.7606 26.8467 36.3129 26.8467 35.7606V28.8097H19.8958C19.3435 28.8097 18.8958 28.362 18.8958 27.8097V27.1594C18.8958 26.6071 19.3435 26.1594 19.8958 26.1594H26.8467V19.2085C26.8467 18.6562 27.2944 18.2085 27.8467 18.2085H28.497C29.0493 18.2085 29.497 18.6562 29.497 19.2085V26.1594H36.4479C37.0002 26.1594 37.4479 26.6071 37.4479 27.1594V27.8097Z" fill="black"/>
                            </svg>
                          </div>
                        )}
                      </label>
                      <input
                        className="upload-input"
                        id={`small-upload-input-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => onPostImageFileChange(e, index)}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <p className="nobo-upload-image-text">Upload at least 4 photos in the order you would like them to appear on your listing.</p>
            <p className="nobo-upload-image-text">Must be in standard format .png, .jpeg and no more than 800x400px</p>
            <p className="nobo-upload-image-text">GENERAL PHOTO TIPS</p>
            <p className="nobo-upload-image-text">Use natural Lighting, with a blank background with no distractions. 
              Take photos of your actual items, don’t use the brand photos or stock photography.</p>
          </div>
        </IonGrid>
      </IonContent>
      <div className="footer">
        <Button
          label="Next"
          large={true}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTradeSteps(tradeSteps + 1);
            history.push('/list/product');
          }}
        />
      </div>
    </IonPage>
  );
};

export default ListItemImage;
