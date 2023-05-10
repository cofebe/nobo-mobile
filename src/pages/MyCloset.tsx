import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
} from '@ionic/react';
import './MyCloset.scss';
import Header from '../components/Header';
import Search from '../components/Search';
import ProductCard from '../components/ProductCard';
import { UserService } from '../services/UserService';
import { Product } from '../models';

const MyCloset: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [search, setSearch] = useState<string>('');
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [sellProducts, setSellProducts] = useState<Product[]>([]);
  const [tradeProducts, setTradeProducts] = useState<Product[]>([]);

  useIonViewWillEnter(() => {
    userService.getMyProducts('sell').then(res => {
      setSellProducts(res.docs);
    });

    userService.getMyProducts('trade').then(res => {
      setTradeProducts(res.docs);
    });
  });

  function searchProductsFunc(val: string) {
    return (p: Product) => {
      return p.name.toLowerCase().includes(val);
    };
  }

  function searchOnChange(val: string) {
    setSearch(val);
    if (val) {
      val = val.trim();
      let filteredSellProducts = sellProducts.filter(searchProductsFunc(val));
      let filteredTradeProducts = tradeProducts.filter(searchProductsFunc(val));
      setSearchProducts(filteredSellProducts.concat(filteredTradeProducts));
    }
  }

  return (
    <IonPage className="my-closet-container">
      <Header title="My Closet" showBackButton={false}>
        <img src="assets/images/nobo_logo.png" className="logo" alt="logo" />
      </Header>
      <IonContent className="my-closet-content">
        <Search
          value={search}
          onChange={val => {
            searchOnChange(val);
          }}
        />
        {search ? (
          <>
            {searchProducts.length > 0 ? (
              <IonGrid className="search-grid">
                <IonRow>
                  {searchProducts.map(p => (
                    <IonCol size="6" key={p._id}>
                      <ProductCard product={p} />
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            ) : (
              <div className="no-products">No products found!</div>
            )}
          </>
        ) : (
          <IonList>
            <IonItem
              lines="none"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                history.push('/home/closet/trade');
              }}
            >
              My Trade Closet <span>({tradeProducts.length})</span>
              <img src="assets/images/arrow-right.svg" alt="go" />
            </IonItem>
            <IonItem
              lines="none"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                history.push('/home/closet/sell');
              }}
            >
              My Sell Closet <span>({sellProducts.length})</span>
              <img src="assets/images/arrow-right.svg" alt="go" />
            </IonItem>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyCloset;
