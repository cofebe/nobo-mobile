import { useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
 IonContent,
 IonPage,
 IonGrid,
 IonRow,
 IonCol,
 IonIcon,
 useIonViewWillEnter,
 useIonViewWillLeave,
 useIonActionSheet,
} from '@ionic/react';
import './ProductDetail.scss';
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';
import { ProductService } from '../services/ProductService';
import { AuthService } from '../services/AuthService';
import { ProductResponse, Product } from '../models';
//import ImageZoom from '../components/ImageZoom';
import Button from '../components/Button';
import OfferTradeModal from '../components/OfferTradeModal';
import TradeHelpModal from '../components/TradeHelpModal';
import SendMessageModal from '../components/SendMessageModal';
import Header from '../components/Header';
import { formatPrice, getImageUrl, getMinTradeFee, getMaxTradeFee } from '../utils';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';
import CreateOfferModal from '../components/CreateOfferModal';
import { calculateEstPrice } from '../helpers/tradeFees';

const ProductDetail: React.FC = () => {
 const params: any = useParams();
 const productService = new ProductService();
 const authService = new AuthService();
 const history = useHistory();
 let subscription: any;
 let [productId, setProductId] = useState<string>(params.id);
 const [product, setProduct] = useState<Product>();
 //const [imageZoom, setImageZoom] = useState('');
 const [isTrade, setIsTrade] = useState<boolean>(false);
 const [imageSource, setImageSource] = useState<string>('');
 const [price, setPrice] = useState<number>(0);
 const [rating, setRating] = useState<number>(0);
 const [image1, setImage1] = useState<string>();
 const [image2, setImage2] = useState<string>();
 const [imageIndex, setImageIndex] = useState<number>(0);
 const [showPrevious, setShowPrevious] = useState<boolean>(false);
 const [showNext, setShowNext] = useState<boolean>(false);
 const [isSneaker, setIsSneaker] = useState<boolean>(false);
 const [isMine, setIsMine] = useState<boolean>(false);
 const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);
 const [sneakersSteps, setSneakersSteps] = useState<number>(0);
 const [sneakersIsNew, setSneakersIsNew] = useState<boolean>(true);
 const [selectedSneakers, setSelectedSneakers] = useState<Product[]>();
 const [selectedSneakerDetails, setSelectedSneakerDetails] = useState<Product>();
 const [presentDeleteActionSheet] = useIonActionSheet();

 const tooltipModal = useRef<HTMLIonModalElement>(null);
 const offerTradeModal = useRef<HTMLIonModalElement>(null);
 const offerModal = useRef<HTMLIonModalElement>(null);
 const sendMessageModal = useRef<HTMLIonModalElement>(null);

 interface sneaekerSizeChart {
  size: string;
  active: boolean;
  sneakerIds: Array<string>;
 }

 let mensSneakerSizesList: sneaekerSizeChart[] = [];
 for (let i = 3.5; i <= 18; i += 0.5) {
  mensSneakerSizesList.push({
   size: i + 'M',
   active: false,
   sneakerIds: [''],
  });
 }
 const [mensSneakerSizes, setMensSneakerSizes] =
  useState<sneaekerSizeChart[]>(mensSneakerSizesList);

 const activeTradeSneakerSizes = (product: Product) => {
  mensSneakerSizesList.forEach(size => {
   if (product.trade && Object.keys(product.trade).includes(size.size)) {
    size.active = true;
    size.sneakerIds = product.trade[size.size];
   }
  });
  setMensSneakerSizes(mensSneakerSizesList);
 };

 const activeSneakerSizes = (product: Product, isNew: boolean) => {
  isNew
   ? mensSneakerSizesList.forEach(size => {
      if (product.shop && Object.keys(product.shop?.new).includes(size.size)) {
       size.active = true;
       size.sneakerIds = product.shop?.new[size.size];
      }
     })
   : mensSneakerSizesList.forEach(size => {
      if (product.shop && Object.keys(product.shop?.used).includes(size.size)) {
       size.active = true;
       size.sneakerIds = product.shop?.used[size.size];
      }
     });
  setMensSneakerSizes(mensSneakerSizesList);
 };

 const showSelectedSneakerSizes = (sneakerIds: Array<string>) => {
  console.log('showSelectedSneakerSizes', sneakerIds);
  productService
   .getFilteredProducts(sneakerIds)
   .then(products => {
    console.log('getFilteredProducts', products);
    setSneakersSteps(2);
    setSelectedSneakers(products.docs);
   })
   .catch(error => {
    console.log('Error: ', error);
   });
 };

 useIonViewWillEnter(() => {
  let isSneakerUrl = history.location.pathname.includes('sneakers');
  let isTradeUrl = history.location.pathname.includes('trade');
  subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
   setCart(cart);
  });

  productId = params.id;
  setProductId(productId);

  productService.getProduct(productId, isSneakerUrl).then((data: ProductResponse) => {
   console.log('getProduct:', data.product);
   setProduct(data.product);
   activeTradeSneakerSizes(data.product);
   setIsTrade(data.product.action === 'trade' || isTradeUrl);
   setImageSource(data.product.images[0].url);
   !isSneakerUrl && setPrice(data.product.price);

   setShowPrevious(false);
   setShowNext(data.product.images.length > 2);
   setImageIndex(0);
   setImage1(data.product.images[0].url);
   setImage2(data.product.images.length > 1 ? data.product.images[1].url : '');

   if (data.product?.vendor?.reviews) {
    let vendorRating = 0;
    for (const review of data.product.vendor.reviews) {
     vendorRating += review.ratingNum;
    }
    setRating(vendorRating / data.product.vendor.reviews.length);
   } else {
    setRating(0);
   }

   setIsMine(authService.getUserId() === data.product.vendor._id);
  });

  productService.getCart().then((products: Product[]) => {
   shoppingCartStore.setProducts(products);
  });
  isSneakerUrl ? setIsSneaker(true) : setIsSneaker(false);
  if (isTradeUrl && isSneakerUrl) {
   setSneakersSteps(1);
  }
 });

 useIonViewWillLeave(() => {
  if (subscription) {
   subscription.unsubscribe();
  }
 });

 function updateImages(index: number) {
  setImageIndex(index);
  if (product) {
   setImage1(product.images[index].url);
   setImage2(product.images[index + 1].url);
   setShowPrevious(index > 0);
   setShowNext(product.images.length > index + 2);
  }
 }

 function previousImage() {
  if (imageIndex > 0) {
   updateImages(imageIndex - 1);
  }
 }

 function nextImage() {
  if (product) {
   if (imageIndex < product.images.length - 2) {
    updateImages(imageIndex + 1);
   }
  }
 }

 function getAttributeValue(key: string, defaultValue: string = ''): string {
  if (!product) {
   return defaultValue;
  }

  const attr = product.attributes.find(a => a.id === key);
  return attr ? (attr.value as string) : defaultValue;
 }

 function getSneakerAttributeValue(key: string, defaultValue: string = ''): string {
  if (!selectedSneakerDetails) {
   return defaultValue;
  }

  const attr = selectedSneakerDetails.attributes.find(a => a.id === key);
  return attr ? (attr.value as string) : defaultValue;
 }

 function getAttributeValues(key: string, defaultValue: string[] = []): string[] {
  if (!product) {
   return defaultValue;
  }

  const attr = product.attributes.find(a => a.id === key);
  return attr ? (attr.value as string[]) : defaultValue;
 }

 function offer() {
  offerModal.current?.present();
  console.log('offer');
 }

 function addToCart() {
  console.log('add to cart');
  if (product) {
   productService.addToCart(product._id).then((success: boolean) => {
    if (success) {
     shoppingCartStore.addProduct(product);
    } else {
     window.alert('Unable to add item to cart!');
    }
   });
  }
 }

 function addSneakerToCart(sneakerProduct: Product) {
  console.log('addSneakerToCart');
  if (sneakerProduct) {
   productService.addToCart(sneakerProduct._id).then((success: boolean) => {
    if (success) {
     shoppingCartStore.addProduct(sneakerProduct);
    } else {
     window.alert('Unable to add item to cart!');
    }
   });
  }
 }

 function message() {
  console.log('message');
  sendMessageModal.current?.present();
 }

 function removeItem() {
  console.log('remove item');
  if (product) {
   presentDeleteActionSheet({
    cssClass: 'remove-action-sheet',
    header: `Delete '${product.name}'?`,
    buttons: [
     {
      text: 'Delete',
      data: {
       action: () => {
        productService.deleteProduct(product._id).then(res => {
         if (res.success) {
          history.goBack();
         }
        });
       },
      },
     },
     {
      text: 'Cancel',
      data: {
       action: () => {
        /* noop */
       },
      },
     },
    ],
    onDidDismiss: ({ detail }) => {
     const action = detail.data?.action;
     if (typeof action === 'function') {
      action();
     } else {
      console.warn('Unknown action:', detail.data);
     }
    },
   });
  }
 }

 function editItem() {
  console.log('edit item');
 }

 function offerTrade() {
  console.log('offer trade');
  offerTradeModal.current?.present();
 }

 function showCart() {
  history.push('/cart');
 }

 return (
  <IonPage className="product-detail-page">
   <Header
    title={isTrade ? 'Trade Item' : 'Purchase Item'}
    subtitle={`@${authService.getUserDisplayName()}`}
   >
    <div className="cart">
     <img
      src="assets/images/shopping-cart.svg"
      alt="cart"
      onClick={() => {
       showCart();
      }}
     />
     {cart?.products.length ? <div className="dot"></div> : ''}
    </div>
   </Header>
   {product ? (
    <IonContent className="product-detail-page" fullscreen>
     <IonGrid className="product-details-card">
      {isSneaker && sneakersSteps > 0 && !isTrade && (
       <IonRow>
        <IonCol size="3">
         <img
          src="assets/images/arrow-left.svg"
          className="back-arrow"
          alt="back"
          onClick={() => {
           setSneakersSteps(sneakersSteps - 1);
          }}
         />
        </IonCol>
       </IonRow>
      )}
      {isSneaker && sneakersSteps > 1 && isTrade && (
       <IonRow>
        <IonCol size="3">
         <img
          src="assets/images/arrow-left.svg"
          className="back-arrow"
          alt="back"
          onClick={() => {
           setSneakersSteps(sneakersSteps - 1);
          }}
         />
        </IonCol>
       </IonRow>
      )}

      <IonRow className="product-images-row">
       <IonCol size="3" className="product-images">
        <div
         onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          previousImage();
         }}
         className={'scroller ' + (showPrevious ? 'enabled' : 'disabled')}
        >
         <IonIcon icon={caretUpOutline} />
        </div>

        {image1 ? (
         <div
          style={{ backgroundImage: getImageUrl(image1) }}
          className="img"
          onClick={e => {
           setImageSource(image1);
          }}
         ></div>
        ) : (
         ''
        )}
        {image2 ? (
         <div
          style={{ backgroundImage: getImageUrl(image2) }}
          className="img"
          onClick={e => {
           setImageSource(image2);
          }}
         ></div>
        ) : (
         ''
        )}

        <div
         onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          nextImage();
         }}
         className={'scroller ' + (showNext ? 'enabled' : 'disabled')}
        >
         <IonIcon icon={caretDownOutline} />
        </div>
       </IonCol>
       <IonCol size="6" className="product-large">
        <div style={{ backgroundImage: getImageUrl(imageSource) }} className="img"></div>
       </IonCol>
      </IonRow>
      <IonRow>
       <IonCol size="10" offset="1" className="product-brand">
        {product.brand}
       </IonCol>
      </IonRow>
      <IonRow>
       <IonCol size="10" offset="1" className="product-name">
        {product.name}
       </IonCol>
      </IonRow>
      {!isSneaker && !isTrade && (
       <>
        <IonRow>
         <IonCol size="10" offset="1" className="product-price">
          <span>Cost</span> {formatPrice(price)}
         </IonCol>
        </IonRow>

        <IonRow className="product-info">
         <IonCol size="4" className="label">
          Condition
         </IonCol>
         <IonCol size="8" className="value">
          {getAttributeValue('condition')}
         </IonCol>
        </IonRow>
       </>
      )}
      {!isSneaker && isTrade && (
       <>
        <IonRow>
         <IonCol size="10" offset="1" className="product-price">
          <span>Est. Price</span> {formatPrice(getMinTradeFee(price))} -{' '}
          {formatPrice(getMaxTradeFee(price))}
         </IonCol>
        </IonRow>

        <IonRow className="product-info">
         <IonCol size="4" className="label">
          Product Value
         </IonCol>
         <IonCol size="8" className="value">
          {formatPrice(price)}
         </IonCol>
        </IonRow>
        <IonRow className="product-info">
         <IonCol size="4" className="label">
          Condition
         </IonCol>
         <IonCol size="8" className="value">
          {getAttributeValue('condition')}
         </IonCol>
        </IonRow>
       </>
      )}
      {getAttributeValue('materialAny') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Material
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('materialAny')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('material') && isSneaker && sneakersSteps === 0 && (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Material
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('material')}
        </IonCol>
       </IonRow>
      )}
      {getAttributeValue('colorway') && isSneaker && sneakersSteps === 0 && (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Colorway
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('colorway')}
        </IonCol>
       </IonRow>
      )}
      {getAttributeValue('size') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Size
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('size')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}

      {isSneaker && sneakersSteps === 3 && selectedSneakerDetails && (
       <IonRow>
        <IonCol size="10" offset="1" className="product-price">
         <span>Cost</span> {formatPrice(selectedSneakerDetails?.price)}
        </IonCol>
       </IonRow>
      )}

      {getSneakerAttributeValue('condition') && isSneaker && sneakersSteps === 3 && (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Condition
        </IonCol>
        <IonCol size="8" className="value">
         {getSneakerAttributeValue('condition')}
        </IonCol>
       </IonRow>
      )}
      {getAttributeValue('material') && isSneaker && sneakersSteps === 3 && (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Material
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('material')}
        </IonCol>
       </IonRow>
      )}
      {getSneakerAttributeValue('color') && isSneaker && sneakersSteps === 3 && (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Colorway
        </IonCol>
        <IonCol size="8" className="value">
         {getSneakerAttributeValue('color')}
        </IonCol>
       </IonRow>
      )}
      {!isSneaker && sneakersSteps === 0 && (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Color
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('color')}
        </IonCol>
       </IonRow>
      )}
      {isSneaker && sneakersSteps === 0 && (
       <IonRow className="buttons">
        <IonCol size="6" className="button-container left">
         <Button
          label="Buy New"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           setSneakersSteps(1);
           setSneakersIsNew(true);
           activeSneakerSizes(product, true);
          }}
         />
        </IonCol>
        <IonCol size="6" className="button-container right">
         <Button
          label="Buy Used"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           setSneakersSteps(1);
           setSneakersIsNew(false);
           activeSneakerSizes(product, false);
          }}
         />
        </IonCol>
       </IonRow>
      )}
      {!isSneaker && !isTrade && !isMine && (
       <>
        <IonRow className="buttons">
         <IonCol size="6" className="button-container left">
          <Button
           label="Offer"
           onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            offer();
           }}
          />
         </IonCol>
         <IonCol size="6" className="button-container right">
          {cart.products.find(p => p._id === product._id) ? (
           <Button
            label="View Cart"
            onClick={e => {
             e.preventDefault();
             e.stopPropagation();
             showCart();
            }}
           />
          ) : (
           <Button
            label="Add to Cart"
            onClick={e => {
             e.preventDefault();
             e.stopPropagation();
             addToCart();
            }}
           />
          )}
         </IonCol>
        </IonRow>
        <IonRow className="">
         <IonCol size="12" className="button-container left right">
          <Button
           label="Message"
           onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            message();
           }}
          />
         </IonCol>
        </IonRow>
       </>
      )}
      {!isSneaker && isTrade && !isMine && (
       <IonRow className="buttons">
        <IonCol size="6" className="button-container left">
         <Button
          label="Message"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           message();
          }}
         />
        </IonCol>
        <IonCol size="6" className="button-container right">
         <Button
          label="Offer Trade"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           offerTrade();
          }}
         />
        </IonCol>
       </IonRow>
      )}
      {isMine && (
       <IonRow className="buttons">
        <IonCol size="6" className="button-container left">
         <Button
          label="Remove Item"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           removeItem();
          }}
         />
        </IonCol>
        <IonCol size="6" className="button-container right">
         <Button
          label="Edit Item"
          onClick={e => {
           e.preventDefault();
           e.stopPropagation();
           editItem();
          }}
         />
        </IonCol>
       </IonRow>
      )}
      {isSneaker && sneakersSteps === 1 && !sneakersIsNew && (
       <IonRow className="sneaker-cards-container">
        {isSneaker &&
         sneakersSteps === 1 &&
         !sneakersIsNew &&
         mensSneakerSizes.map(sneaker => {
          return (
           <IonCol key={sneaker.size} size="2">
            <div
             className={`sneaker-size-card ${sneaker.active && 'sneaker-card-active'}`}
             onClick={
              sneaker.active ? () => showSelectedSneakerSizes(sneaker.sneakerIds) : () => {}
             }
            >
             {sneaker.size}
            </div>
           </IonCol>
          );
         })}
       </IonRow>
      )}
      {isSneaker && sneakersSteps === 1 && sneakersIsNew && (
       <IonRow className="sneaker-cards-container">
        {isSneaker &&
         sneakersSteps === 1 &&
         sneakersIsNew &&
         mensSneakerSizes.map(sneaker => {
          return (
           <IonCol key={sneaker.size} size="2">
            <div
             className={`sneaker-size-card ${sneaker.active && 'sneaker-card-active'}`}
             onClick={
              sneaker.active ? () => showSelectedSneakerSizes(sneaker.sneakerIds) : () => {}
             }
            >
             {sneaker.size}
            </div>
           </IonCol>
          );
         })}
       </IonRow>
      )}
      {isSneaker && sneakersSteps === 2 && isTrade && (
       <div className="selected-sneakers-margin-top">
        {selectedSneakers?.map((sneaker, index) => {
         return (
          <IonRow class="ion-justify-content-center ion-align-items-center selected-sneakers-container">
           <IonCol size="8">
            <div className="selected-sneakers-trade-price">
             EST. PRICE {calculateEstPrice(sneaker.price)}
            </div>
           </IonCol>
           <IonCol size="4">
            <div
             className="selected-sneakers-view-details"
             onClick={() => {
              setSneakersSteps(3);
              setSelectedSneakerDetails(selectedSneakers[index]);
             }}
            >
             VIEW DETAILS
            </div>
           </IonCol>
          </IonRow>
         );
        })}
       </div>
      )}

      {isSneaker && sneakersSteps === 2 && !sneakersIsNew && !isTrade && (
       <div className="selected-sneakers-margin-top">
        {selectedSneakers?.map((sneaker, index) => {
         return (
          <IonRow class="ion-justify-content-center ion-align-items-center selected-sneakers-container">
           <IonCol size="4">
            <div className="selected-sneakers-price">{formatPrice(sneaker.price)}</div>
            <div className="selected-sneakers-tags">{sneaker.attributes[6].value}</div>
           </IonCol>
           <IonCol size="4">
            <div>@{sneaker.vendor.displayName}</div>
           </IonCol>
           <IonCol size="4">
            {cart.products.find(p => p._id === selectedSneakers[index]._id) ? (
             <Button
              label="View Cart"
              onClick={e => {
               e.preventDefault();
               e.stopPropagation();
               showCart();
              }}
             />
            ) : (
             <Button
              label="Add to Cart"
              onClick={e => {
               e.preventDefault();
               e.stopPropagation();
               addSneakerToCart(selectedSneakers[index]);
              }}
             />
            )}
            <div
             className="selected-sneakers-view-details"
             onClick={() => {
              setSneakersSteps(3);
              setSelectedSneakerDetails(selectedSneakers[index]);
             }}
            >
             VIEW DETAILS
            </div>
           </IonCol>
          </IonRow>
         );
        })}
       </div>
      )}
      {isSneaker && sneakersSteps === 2 && sneakersIsNew && !isTrade && (
       <div className="selected-sneakers-margin-top">
        {selectedSneakers?.map((sneaker, index) => {
         return (
          <IonRow class="ion-justify-content-center ion-align-items-center selected-sneakers-container">
           <IonCol size="4">
            <div className="selected-sneakers-price">{formatPrice(sneaker.price)}</div>
            <div className="selected-sneakers-tags">{sneaker.attributes[6].value}</div>
           </IonCol>
           <IonCol size="4">
            <div>@{sneaker.vendor.displayName}</div>
           </IonCol>
           <IonCol size="4">
            {cart.products.find(p => p._id === selectedSneakers[index]._id) ? (
             <Button
              label="View Cart"
              onClick={e => {
               e.preventDefault();
               e.stopPropagation();
               showCart();
              }}
             />
            ) : (
             <Button
              label="Add to Cart"
              onClick={e => {
               e.preventDefault();
               e.stopPropagation();
               addSneakerToCart(selectedSneakers[index]);
              }}
             />
            )}
            <div
             className="selected-sneakers-view-details"
             onClick={() => {
              setSneakersSteps(3);
              setSelectedSneakerDetails(selectedSneakers[index]);
             }}
            >
             VIEW DETAILS
            </div>
           </IonCol>
          </IonRow>
         );
        })}
       </div>
      )}
      {isSneaker && sneakersSteps === 3 && selectedSneakerDetails && !isMine && (
       <IonRow className="buttons">
        {isTrade ? (
         <>
          <IonCol size="6" className="button-container left">
           <Button
            label="Message"
            onClick={e => {
             e.preventDefault();
             e.stopPropagation();
             message();
            }}
           />
          </IonCol>
          <IonCol size="6" className="button-container right">
           <Button
            label="Offer Trade"
            onClick={e => {
             e.preventDefault();
             e.stopPropagation();
             offerTrade();
            }}
           />
          </IonCol>
         </>
        ) : (
         <>
          <IonCol size="6" className="button-container left right">
           <Button
            label="Message"
            onClick={e => {
             e.preventDefault();
             e.stopPropagation();
             message();
            }}
           />
          </IonCol>
          <IonCol size="6" className="button-container right">
           {cart.products.find(p => p._id === selectedSneakerDetails._id) ? (
            <Button
             label="View Cart"
             onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              showCart();
             }}
            />
           ) : (
            <Button
             label="Add to Cart"
             onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              addSneakerToCart(selectedSneakerDetails);
             }}
            />
           )}
          </IonCol>
         </>
        )}
       </IonRow>
      )}
     </IonGrid>
     {isTrade && (
      <IonGrid
       className="trade-tooltip"
       onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        tooltipModal.current?.present();
       }}
      >
       <IonRow>
        <IonCol>
         <img src="assets/images/question-mark-tooltip.svg" alt="how do trades work?" />
         <div>How do trades work?</div>
        </IonCol>
       </IonRow>
      </IonGrid>
     )}
     <IonGrid className="product-details">
      <IonRow className="title">
       <IonCol>Product Details</IonCol>
      </IonRow>
      <IonRow className="blurb">
       {isSneaker && sneakersSteps === 3 && selectedSneakerDetails ? (
        <IonCol>{selectedSneakerDetails.description}</IonCol>
       ) : (
        <IonCol>{product.description}</IonCol>
       )}
      </IonRow>
      {!isSneaker && (
       <>
        <IonRow className="title">
         <IonCol>Owner</IonCol>
        </IonRow>
        <IonRow
         className="owner"
         onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('go to profile', product.vendor._id);
          history.push(`/home/profile/${product.vendor._id}`);
         }}
        >
         <IonCol size="1">
          <div
           className="avatar"
           style={{
            backgroundImage: getImageUrl(product.vendor.avatar),
           }}
          ></div>
         </IonCol>
         <IonCol size="11">
          <div className="username">@{product.vendor.displayName}</div>
          <div className="rating">
           <svg
            width="91"
            height="11"
            viewBox="0 0 91 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
           >
            <g>
             <path
              d="M5.85224 0.382694L4.37846 3.22723L1.08106 3.68484C0.489741 3.76648 0.252761 4.46043 0.681581 4.85789L3.06717 7.07078L2.50294 10.1968C2.40137 10.7618 3.02655 11.185 3.55016 10.9208L6.49998 9.4448L9.44981 10.9208C9.97342 11.1829 10.5986 10.7618 10.497 10.1968L9.9328 7.07078L12.3184 4.85789C12.7472 4.46043 12.5102 3.76648 11.9189 3.68484L8.62151 3.22723L7.14773 0.382694C6.88367 -0.124337 6.11856 -0.130782 5.85224 0.382694Z"
              fill={rating > 0 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M24.8522 0.382694L23.3785 3.22723L20.0811 3.68484C19.4897 3.76648 19.2528 4.46043 19.6816 4.85789L22.0672 7.07078L21.5029 10.1968C21.4014 10.7618 22.0265 11.185 22.5502 10.9208L25.5 9.4448L28.4498 10.9208C28.9734 11.1829 29.5986 10.7618 29.497 10.1968L28.9328 7.07078L31.3184 4.85789C31.7472 4.46043 31.5102 3.76648 30.9189 3.68484L27.6215 3.22723L26.1477 0.382694C25.8837 -0.124337 25.1186 -0.130782 24.8522 0.382694Z"
              fill={rating > 1 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M43.8522 0.382694L42.3785 3.22723L39.0811 3.68484C38.4897 3.76648 38.2528 4.46043 38.6816 4.85789L41.0672 7.07078L40.5029 10.1968C40.4014 10.7618 41.0265 11.185 41.5502 10.9208L44.5 9.4448L47.4498 10.9208C47.9734 11.1829 48.5986 10.7618 48.497 10.1968L47.9328 7.07078L50.3184 4.85789C50.7472 4.46043 50.5102 3.76648 49.9189 3.68484L46.6215 3.22723L45.1477 0.382694C44.8837 -0.124337 44.1186 -0.130782 43.8522 0.382694Z"
              fill={rating > 2 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M62.8522 0.382694L61.3785 3.22723L58.0811 3.68484C57.4897 3.76648 57.2528 4.46043 57.6816 4.85789L60.0672 7.07078L59.5029 10.1968C59.4014 10.7618 60.0265 11.185 60.5502 10.9208L63.5 9.4448L66.4498 10.9208C66.9734 11.1829 67.5986 10.7618 67.497 10.1968L66.9328 7.07078L69.3184 4.85789C69.7472 4.46043 69.5102 3.76648 68.9189 3.68484L65.6215 3.22723L64.1477 0.382694C63.8837 -0.124337 63.1186 -0.130782 62.8522 0.382694Z"
              fill={rating > 3 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M83.8522 0.382694L82.3785 3.22723L79.0811 3.68484C78.4897 3.76648 78.2528 4.46043 78.6816 4.85789L81.0672 7.07078L80.5029 10.1968C80.4014 10.7618 81.0265 11.185 81.5502 10.9208L84.5 9.4448L87.4498 10.9208C87.9734 11.1829 88.5986 10.7618 88.497 10.1968L87.9328 7.07078L90.3184 4.85789C90.7472 4.46043 90.5102 3.76648 89.9189 3.68484L86.6215 3.22723L85.1477 0.382694C84.8837 -0.124337 84.1186 -0.130782 83.8522 0.382694Z"
              fill={rating > 4 ? '#000' : '#ACACAC66'}
             />
            </g>
           </svg>
          </div>
         </IonCol>
        </IonRow>
       </>
      )}
      {isSneaker && sneakersSteps === 3 && selectedSneakerDetails && (
       <>
        <IonRow className="title">
         <IonCol>Owner</IonCol>
        </IonRow>
        <IonRow
         className="owner"
         onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('go to profile', selectedSneakerDetails.vendor._id);
          history.push(`/home/profile/${selectedSneakerDetails.vendor._id}`);
         }}
        >
         <IonCol size="1">
          <div
           className="avatar"
           style={{
            backgroundImage: getImageUrl(selectedSneakerDetails.vendor.avatar),
           }}
          ></div>
         </IonCol>
         <IonCol size="11">
          <div className="username">@{selectedSneakerDetails.vendor.displayName}</div>
          <div className="rating">
           <svg
            width="91"
            height="11"
            viewBox="0 0 91 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
           >
            <g>
             <path
              d="M5.85224 0.382694L4.37846 3.22723L1.08106 3.68484C0.489741 3.76648 0.252761 4.46043 0.681581 4.85789L3.06717 7.07078L2.50294 10.1968C2.40137 10.7618 3.02655 11.185 3.55016 10.9208L6.49998 9.4448L9.44981 10.9208C9.97342 11.1829 10.5986 10.7618 10.497 10.1968L9.9328 7.07078L12.3184 4.85789C12.7472 4.46043 12.5102 3.76648 11.9189 3.68484L8.62151 3.22723L7.14773 0.382694C6.88367 -0.124337 6.11856 -0.130782 5.85224 0.382694Z"
              fill={rating > 0 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M24.8522 0.382694L23.3785 3.22723L20.0811 3.68484C19.4897 3.76648 19.2528 4.46043 19.6816 4.85789L22.0672 7.07078L21.5029 10.1968C21.4014 10.7618 22.0265 11.185 22.5502 10.9208L25.5 9.4448L28.4498 10.9208C28.9734 11.1829 29.5986 10.7618 29.497 10.1968L28.9328 7.07078L31.3184 4.85789C31.7472 4.46043 31.5102 3.76648 30.9189 3.68484L27.6215 3.22723L26.1477 0.382694C25.8837 -0.124337 25.1186 -0.130782 24.8522 0.382694Z"
              fill={rating > 1 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M43.8522 0.382694L42.3785 3.22723L39.0811 3.68484C38.4897 3.76648 38.2528 4.46043 38.6816 4.85789L41.0672 7.07078L40.5029 10.1968C40.4014 10.7618 41.0265 11.185 41.5502 10.9208L44.5 9.4448L47.4498 10.9208C47.9734 11.1829 48.5986 10.7618 48.497 10.1968L47.9328 7.07078L50.3184 4.85789C50.7472 4.46043 50.5102 3.76648 49.9189 3.68484L46.6215 3.22723L45.1477 0.382694C44.8837 -0.124337 44.1186 -0.130782 43.8522 0.382694Z"
              fill={rating > 2 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M62.8522 0.382694L61.3785 3.22723L58.0811 3.68484C57.4897 3.76648 57.2528 4.46043 57.6816 4.85789L60.0672 7.07078L59.5029 10.1968C59.4014 10.7618 60.0265 11.185 60.5502 10.9208L63.5 9.4448L66.4498 10.9208C66.9734 11.1829 67.5986 10.7618 67.497 10.1968L66.9328 7.07078L69.3184 4.85789C69.7472 4.46043 69.5102 3.76648 68.9189 3.68484L65.6215 3.22723L64.1477 0.382694C63.8837 -0.124337 63.1186 -0.130782 62.8522 0.382694Z"
              fill={rating > 3 ? '#000' : '#ACACAC66'}
             />
            </g>
            <g>
             <path
              d="M83.8522 0.382694L82.3785 3.22723L79.0811 3.68484C78.4897 3.76648 78.2528 4.46043 78.6816 4.85789L81.0672 7.07078L80.5029 10.1968C80.4014 10.7618 81.0265 11.185 81.5502 10.9208L84.5 9.4448L87.4498 10.9208C87.9734 11.1829 88.5986 10.7618 88.497 10.1968L87.9328 7.07078L90.3184 4.85789C90.7472 4.46043 90.5102 3.76648 89.9189 3.68484L86.6215 3.22723L85.1477 0.382694C84.8837 -0.124337 84.1186 -0.130782 83.8522 0.382694Z"
              fill={rating > 4 ? '#000' : '#ACACAC66'}
             />
            </g>
           </svg>
          </div>
         </IonCol>
        </IonRow>
        <IonRow className="title">
         <IonCol>Additional Details</IonCol>
        </IonRow>
        {getSneakerAttributeValue('smokingHome') ? (
         <IonRow className="product-info">
          <IonCol size="4" className="label">
           IS THE PRODUCT COMING FROM A SMOKING HOME?
          </IonCol>
          <IonCol size="8" className="value">
           {getSneakerAttributeValue('smokingHome')}
          </IonCol>
         </IonRow>
        ) : (
         ''
        )}
        {getSneakerAttributeValue('petHome') ? (
         <IonRow className="product-info">
          <IonCol size="4" className="label">
           IS THE PRODUCT COMING FROM A PET FREE HOME?
          </IonCol>
          <IonCol size="8" className="value">
           {getSneakerAttributeValue('petHome')}
          </IonCol>
         </IonRow>
        ) : (
         ''
        )}
        {getSneakerAttributeValue('box') ? (
         <IonRow className="product-info">
          <IonCol size="4" className="label">
           Box
          </IonCol>
          <IonCol size="8" className="value">
           {getSneakerAttributeValue('box')}
          </IonCol>
         </IonRow>
        ) : (
         ''
        )}
        {selectedSneakerDetails.retailPrice ? (
         <IonRow className="product-info">
          <IonCol size="4" className="label">
           EST. RETAIL PRICE
          </IonCol>
          <IonCol size="8" className="value">
           {formatPrice(selectedSneakerDetails.retailPrice)}
          </IonCol>
         </IonRow>
        ) : (
         ''
        )}
       </>
      )}

      <IonRow className="title">
       <IonCol>Additional Details</IonCol>
      </IonRow>
      {getAttributeValue('box') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Box
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('box')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('yearPurchased') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Year Purchased
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('yearPurchased')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('dustBag') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Dust Bag
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('dustBag')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('authenticityCard') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Authenticity Card
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('authenticityCard')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('retailTags') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Retail Tags
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('retailTags')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('petiteItem') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Petite
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('petiteItem')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('smokingHome') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Smoking Home
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('smokingHome')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('petHome') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Pet Home
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('petHome')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('condition-details').length ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Condition Details
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValues('condition-details').map(c => (
          <div key={c}>{c}</div>
         ))}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {getAttributeValue('condition-notes') ? (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Condition Notes
        </IonCol>
        <IonCol size="8" className="value">
         {getAttributeValue('condition-notes')}
        </IonCol>
       </IonRow>
      ) : (
       ''
      )}
      {isSneaker ? (
       <>
        <IonRow className="product-info">
         <IonCol size="4" className="label">
          SKU
         </IonCol>
         <IonCol size="8" className="value">
          {getAttributeValue('SKU') || 'NOT INCLUDED'}
         </IonCol>
        </IonRow>
        <IonRow className="product-info">
         <IonCol size="4" className="label">
          YEAR RELEASED
         </IonCol>
         <IonCol size="8" className="value">
          {getAttributeValue('yearReleased') || 'NOT INCLUDED'}
         </IonCol>
        </IonRow>
       </>
      ) : (
       <IonRow className="product-info">
        <IonCol size="4" className="label">
         Est. Retail Price
        </IonCol>
        <IonCol size="8" className="value">
         {formatPrice(product.retailPrice)}
        </IonCol>
       </IonRow>
      )}
     </IonGrid>
    </IonContent>
   ) : (
    ''
   )}

   <TradeHelpModal ref={tooltipModal} />

   {product && isTrade && (
    <OfferTradeModal
     ref={offerTradeModal}
     product={product}
     onClose={() => {
      offerTradeModal.current?.dismiss();
     }}
    />
   )}
   <CreateOfferModal
    productId={params.id}
    ref={offerModal}
    onClose={() => {
     offerModal.current?.dismiss();
    }}
   />
   <SendMessageModal
    ref={sendMessageModal}
    productId={params.id}
    onCancel={() => {
     sendMessageModal.current?.dismiss();
    }}
    onClose={() => {
     sendMessageModal.current?.dismiss();
    }}
   />
  </IonPage>
 );
};

export default ProductDetail;
