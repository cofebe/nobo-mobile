import {
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
  IonButton,
  useIonActionSheet,
} from '@ionic/react';
import './NoboExploreHeader.scss';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

interface NoboExploreHeaderProps {
  sectionNameCallback: (sectionName: string) => void;
  sectionCategoryCallback: (sectionCategory: string) => void;
}

const NoboExploreHeader: React.FC<NoboExploreHeaderProps> = ({
  sectionNameCallback,
  sectionCategoryCallback,
}) => {
  const history = useHistory();
  const [present] = useIonActionSheet();

  const [activeButton, setActiveButton] = useState<string>('explore');
  const [activeCategory, setActiveCategory] = useState<string>('WOMEN');

  const handleSectionButtonClick = (section: string) => {
    setActiveButton(section);
    sectionNameCallback(section);
  };

  useIonViewWillEnter(() => {
    sectionNameCallback('explore');
  });

  const openCategoryOptions = () => {
    present({
      cssClass: 'nobo-action-sheet',
      buttons: [
        {
          text: "WOMEN'S",
          data: {
            action: 'women',
          },
        },
        {
          text: "MEN'S",
          data: {
            action: 'men',
          },
        },
        {
          text: 'SNEAKERS',
          data: {
            action: 'sneakers',
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.data === undefined) {
          return;
        }
        if (detail.data.action !== undefined) {
          console.log(detail);
        }
        if (detail.data.action === 'women') {
          setActiveCategory('WOMEN');
          sectionCategoryCallback('women');
        } else if (detail.data.action === 'men') {
          setActiveCategory('MEN');
          sectionCategoryCallback('men');
        } else if (detail.data.action === 'sneakers') {
          setActiveCategory('SNEAKERS');
          sectionCategoryCallback('sneakers');
        }
      },
    });
  };

  return (
    <IonHeader className="home-header">
      <IonToolbar className="home-header-toolbar">
        <IonGrid>
          <IonRow class="ion-align-items-center">
            <IonCol size="3">
              <div>
                <img
                  // className="splash-logo"
                  height={40}
                  src="assets/images/account-settings.svg"
                  alt="logo"
                />
              </div>
            </IonCol>
            <IonCol style={{ textAlign: 'center' }} size="6">
              <div>
                <img
                  // className="splash-logo"
                  height={47}
                  src="assets/images/nobo_logo.png"
                  alt="logo"
                />
              </div>
            </IonCol>
            <IonCol size="3">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
                onClick={(e) => {
                  history.push('/cart');
                }}
              >
                <div>
                  <img
                    height={40}
                    src="assets/images/shopping-cart.svg"
                    alt="logo"
                  />
                </div>
              </div>
            </IonCol>
          </IonRow>
          <IonRow
            style={{ paddingLeft: 45 }}
            className="ion-justify-content-center"
          >
            <IonCol>
              <div
                onClick={() => {
                  openCategoryOptions();
                }}
                style={{
                  textAlign: 'end',
                  fontFamily: 'Nunito Sans',
                  fontWeight: 600,
                }}
              >
                {activeCategory}
              </div>
            </IonCol>
            <IonCol
              style={{
                paddingLeft: 0,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                top: 2,
              }}
            >
              <div>
                <img
                  height={15}
                  src="assets/images/nobo-square-down.png"
                  alt="down"
                />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="3">
              <IonButton
                onClick={() => {
                  handleSectionButtonClick('explore');
                }}
                color={activeButton === 'explore' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'explore'
                      ? '0px 0px 10px rgba(214, 152, 14, 0.4)'
                      : 'none',
                  '--border-color':
                    activeButton === 'explore' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                EXPLORE
              </IonButton>
            </IonCol>
            <IonCol size="3">
              <IonButton
                onClick={() => {
                  handleSectionButtonClick('trade');
                }}
                color={activeButton === 'trade' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'trade'
                      ? '0px 0px 10px rgba(214, 152, 14, 0.4)'
                      : 'none',
                  '--border-color':
                    activeButton === 'trade' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                TRADE
              </IonButton>
            </IonCol>
            <IonCol size="3">
              <IonButton
                onClick={() => {
                  handleSectionButtonClick('shop');
                }}
                color={activeButton === 'shop' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'shop'
                      ? '0px 0px 10px rgba(214, 152, 14, 0.4)'
                      : 'none',
                  '--border-color':
                    activeButton === 'shop' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                SHOP
              </IonButton>
            </IonCol>
            <IonCol size="3">
              <IonButton
                onClick={() => {
                  handleSectionButtonClick('sale');
                }}
                color={activeButton === 'sale' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'sale'
                      ? '0px 0px 10px rgba(214, 152, 14, 0.4)'
                      : 'none',
                  '--border-color':
                    activeButton === 'sale' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                SALE
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonHeader>
  );
};

export default NoboExploreHeader;
