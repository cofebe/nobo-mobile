import {
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  useIonActionSheet,
} from '@ionic/react';
import './ExploreHeader.scss';
import { useHistory, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { shoppingCartStore, ShoppingCartState } from '../cart-store';

const NoboExploreHeader: React.FC = () => {
  const history = useHistory();
  const params: any = useParams();
  const [present] = useIonActionSheet();

  const [activeButton, setActiveButton] = useState(params.sectionName);
  const [activeCategory, setActiveCategory] = useState(params.sectionCategory);
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string>('WOMAN');
  const [cart, setCart] = useState<ShoppingCartState>(shoppingCartStore.initialState);

  useEffect(() => {
    const subscription = shoppingCartStore.subscribe((cart: ShoppingCartState) => {
      setCart(cart);
    });
    if (activeCategory === 'men') {
      setActiveCategoryTitle('MEN');
    } else if (activeCategory === 'women') {
      setActiveCategoryTitle('WOMEN');
    } else if (activeCategory === 'sneakers') {
      setActiveCategoryTitle('SNEAKERS');
    }
    setActiveButton(params.sectionName);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSectionButtonClick = (section: string) => {
    setActiveButton(section);
  };

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
          setActiveCategoryTitle('WOMEN');
          setActiveCategory('women');
          history.replace(`/home/explore/women/${activeButton}`);
        } else if (detail.data.action === 'men') {
          setActiveCategoryTitle('MEN');
          setActiveCategory('men');
          history.replace(`/home/explore/men/${activeButton}`);
        } else if (detail.data.action === 'sneakers') {
          setActiveCategoryTitle('SNEAKERS');
          setActiveCategory('sneakers');
          history.replace(`/home/explore/sneakers/${activeButton}`);
        }
      },
    });
  };

  return (
    <IonHeader className="explore-header" >
      {/* <IonToolbar className="explore-header-toolbar" > */}
        <IonGrid >
          <IonRow class="ion-align-items-center" >
            <IonCol size="3">
              <div
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  history.push('/settings');
                }}
              >
                <img
                  // className="splash-logo"
                  height={24}
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
                onClick={e => {
                  history.push('/cart');
                }}
              >
                <div className="cart-container">
                  <img height={24} src="assets/images/shopping-cart.svg" alt="logo" />
                  {cart.products.length ? <div className="dot"></div> : ''}
                </div>
              </div>
            </IonCol>
          </IonRow>
          <IonRow style={{ paddingLeft: 45 }} className="ion-justify-content-center">
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
                {activeCategoryTitle}
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
                <img height={15} src="assets/images/nobo-square-down.png" alt="down" />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="3">
              <IonButton
                routerLink={`/home/explore/${activeCategory}/explore`}
                routerDirection="none"
                onClick={() => {
                  handleSectionButtonClick('explore');
                }}
                color={activeButton === 'explore' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'explore' ? '0px 0px 10px rgba(214, 152, 14, 0.4)' : 'none',
                  '--border-color': activeButton === 'explore' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                EXPLORE
              </IonButton>
            </IonCol>
            <IonCol size="3">
              <IonButton
                routerLink={`/home/explore/${activeCategory}/trade`}
                routerDirection="none"
                onClick={() => {
                  handleSectionButtonClick('trade');
                }}
                color={activeButton === 'trade' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'trade' ? '0px 0px 10px rgba(214, 152, 14, 0.4)' : 'none',
                  '--border-color': activeButton === 'trade' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                TRADE
              </IonButton>
            </IonCol>
            <IonCol size="3">
              <IonButton
                routerLink={`/home/explore/${activeCategory}/shop`}
                routerDirection="none"
                onClick={() => {
                  handleSectionButtonClick('shop');
                }}
                color={activeButton === 'shop' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'shop' ? '0px 0px 10px rgba(214, 152, 14, 0.4)' : 'none',
                  '--border-color': activeButton === 'shop' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                SHOP
              </IonButton>
            </IonCol>
            <IonCol size="3">
              <IonButton
                routerLink={`/home/explore/${activeCategory}/sale`}
                routerDirection="none"
                onClick={() => {
                  handleSectionButtonClick('sale');
                }}
                color={activeButton === 'sale' ? 'primary' : 'secondary'}
                style={{
                  '--box-shadow':
                    activeButton === 'sale' ? '0px 0px 10px rgba(214, 152, 14, 0.4)' : 'none',
                  '--border-color': activeButton === 'sale' ? '#d6980e' : 'black',
                }}
                expand="block"
                className="header-section-button"
              >
                SALE
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      {/* </IonToolbar> */}
    </IonHeader>
  );
};

export default NoboExploreHeader;
