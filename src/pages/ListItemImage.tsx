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
import Button from '../components/Button';
import { FeedService } from '../services/FeedService';
import { FileService } from '../services/FileService';
import { listingStore, ListingState } from '../listing-store';

const ListItemImage: React.FC = () => {
  const history = useHistory();
  const fileService = new FileService();
  const feedService = new FeedService();
  const [isTrade, setIsTrade] = useState(false);
  const [photos, setPhotos] = useState<string[]>(['', '', '', '']);
  const [fileName, setFileName] = useState<string>('');

  let subscription: any;

  useIonViewWillEnter(() => {
    subscription = listingStore.subscribe((state: ListingState) => {
      if (!state.itemCategory) {
        //history.push('/list/category');
        history.goBack();
        return;
      }
      setPhotos(state.photos);
    });

    let isTradeUrl = history.location.pathname.includes('trade');
    setIsTrade(isTradeUrl);
    reset();
  });

  useIonViewWillLeave(() => {
    subscription?.unsubscribe();
  });

  const reset = () => {
    setFileName('');
  };

  const onPostImageFileChange = async (fileChangeEvent: any, index: number) => {
    const file = fileChangeEvent.target.files;
    const obj = new FormData();
    obj.append('file', file[0]);
    const response = await feedService.uploadImage(obj);
    const returnValues = await response.json();

    try {
      const newPostImage: string = returnValues?.url;
      if (newPostImage) {
        const newPhotos = [...photos];
        newPhotos[index] = newPostImage;
        setPhotos(newPhotos);
        listingStore.setPhotos(newPhotos);
      }
    } catch (exPostImages) {
      console.log('There was an issue sending the image in the post');
    }
  };

  function valid() {
    //return true;
    return photos.filter(p => p).length === 4;
  }

  return (
    <IonPage className="list-item-page">
      <IonHeader className="list-item-header">
        <span className="progress-bar-container">
          <div className="progress-bar two-thirds-width"></div>
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
        <span className="trade-steps">2/3</span>
      </IonHeader>
      <IonContent>
        <IonGrid className="list-item-content">
          <IonRow>
            <IonCol>
              <div className="list-item-instruction">Add photos and pricing for your item</div>
            </IonCol>
          </IonRow>
          <div className="padding-bottom-container">
            <div className="photo-uploader">
              <div className="upload-container">
                <label htmlFor="upload-input">
                  {photos[0] ? (
                    <div
                      className="upload-image"
                      style={{ backgroundImage: `url(${photos[0]})` }}
                    ></div>
                  ) : (
                    <div className="upload-placeholder">
                      <svg
                        width="175"
                        height="171"
                        viewBox="0 0 175 171"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="1"
                          y="1"
                          width="173"
                          height="168.706"
                          rx="4"
                          fill="white"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeDasharray="6 6"
                        />
                        <path
                          d="M117.025 89.0307C117.025 89.583 116.577 90.0307 116.025 90.0307H92.1779V113.877C92.1779 114.43 91.7302 114.877 91.1779 114.877H84.8957C84.3434 114.877 83.8957 114.43 83.8957 113.877V90.0307H60.0491C59.4968 90.0307 59.0491 89.583 59.0491 89.0307V82.7485C59.0491 82.1962 59.4968 81.7485 60.0491 81.7485H83.8957V57.9019C83.8957 57.3496 84.3434 56.9019 84.8957 56.9019H91.1779C91.7302 56.9019 92.1779 57.3496 92.1779 57.9019V81.7485H116.025C116.577 81.7485 117.025 82.1962 117.025 82.7485V89.0307Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  )}
                </label>
                <input
                  className="upload-input"
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={e => onPostImageFileChange(e, 0)}
                />
              </div>
              <div className="thumbnail-container">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="small-upload-container">
                      <label htmlFor={`small-upload-input-${index}`}>
                        {photos[index + 1] ? (
                          <div
                            className="upload-image"
                            style={{ backgroundImage: `url(${photos[index + 1]})` }}
                          ></div>
                        ) : (
                          <div className="upload-placeholder">
                            <svg
                              width="56"
                              height="55"
                              viewBox="0 0 56 55"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.5"
                                y="0.5"
                                width="55"
                                height="53.6258"
                                rx="4.5"
                                fill="white"
                                stroke="black"
                                strokeLinejoin="round"
                                strokeDasharray="6 6"
                              />
                              <path
                                d="M37.4479 27.8097C37.4479 28.362 37.0002 28.8097 36.4479 28.8097H29.497V35.7606C29.497 36.3129 29.0493 36.7606 28.497 36.7606H27.8467C27.2944 36.7606 26.8467 36.3129 26.8467 35.7606V28.8097H19.8958C19.3435 28.8097 18.8958 28.362 18.8958 27.8097V27.1594C18.8958 26.6071 19.3435 26.1594 19.8958 26.1594H26.8467V19.2085C26.8467 18.6562 27.2944 18.2085 27.8467 18.2085H28.497C29.0493 18.2085 29.497 18.6562 29.497 19.2085V26.1594H36.4479C37.0002 26.1594 37.4479 26.6071 37.4479 27.1594V27.8097Z"
                                fill="black"
                              />
                            </svg>
                          </div>
                        )}
                      </label>
                      <input
                        className="upload-input"
                        id={`small-upload-input-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={e => onPostImageFileChange(e, index + 1)}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <p className="nobo-upload-image-text">
              Upload at least 4 photos in the order you would like them to appear on your listing.
            </p>
            <p className="nobo-upload-image-text">
              Must be in standard format .png, .jpeg and no more than 800x400px
            </p>
            <p className="nobo-upload-image-text">GENERAL PHOTO TIPS</p>
            <p className="nobo-upload-image-text">
              Use natural Lighting, with a blank background with no distractions. Take photos of
              your actual items, don’t use the brand photos or stock photography.
            </p>
          </div>
        </IonGrid>
      </IonContent>
      <div className="footer">
        <Button
          label="Next"
          large={true}
          disabled={!valid()}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/list/product');
          }}
        />
      </div>
    </IonPage>
  );
};

export default ListItemImage;
