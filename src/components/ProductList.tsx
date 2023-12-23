import { useHistory } from 'react-router-dom';
import { IonRow, useIonViewDidEnter } from '@ionic/react';
import { useState, useEffect } from 'react';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
import './ProductList.css';
import { FeedService } from '../services/FeedService';
import { UserService } from '../services/UserService';
import ProductCard from './ProductCard';
import { ProductsResponse } from '../models';
import { environment } from '../environments/environment';

interface ProductListProps {
  type: string;
  userId: string;
  isLoggedUser: Boolean;
}

interface FeedItem {
  likes: any[];
  images: { url: string; originalName: string }[];
  _id: string;
  user: {
    _id: string;
    avatar: string;
    displayName: string;
    tradeCloset: number;
    sellCloset: number;
  };
  template: string;
  feedText: string;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProductList: React.FC<ProductListProps> = ({ type, userId, isLoggedUser }) => {
  const history = useHistory();
  const feedService = new FeedService();
  const userService = new UserService();
  const [products, setProducts] = useState<ProductsResponse>();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useIonViewDidEnter(() => {
    load();
  });

  function load() {

    if (type !== '') {
      userService
        .getProducts(userId, type)
        .then(data => {
          setProducts(data);
        });
    } else {
      feedService
        .getProfileFeed(userId)
        .then(res => res.json())
        .then(data => {
          if (data.feed !== undefined)
            setFeed(data.feed.feed);
        });
    }
    getFavorites();
  }

  function shareItem(product: any) {
    let itemUrl = `${environment.serverUrl}/${product.group}/${product._id}`;

    const options = {
      subject: 'Share Product',
      files: ['', ''],
      url: itemUrl,
      chooserTitle: 'Pick an app',
      appPackageName: 'com.apple.social.facebook',
      iPadCoordinates: '0,0,0,0',
    };

    SocialSharing.shareWithOptions(options);
  }

  function favoriteItem(product: any) {
    let req = {
      id: product._id
    }

    userService
      .addFavorite(req)
      .then(data => {
        load();
      });
  }

  function checkForFavorite(productID: string) {
    if (favorites.includes(productID)) {
      return true
    }
    return false
  }

  function getFavorites() {
    userService
      .getMe()
      .then(data => {
        setFavorites(data.favorites)
      })
  }

  useEffect(() => {
    load();
  }, [type, userId]);

  if (type === 'trade' && products !== undefined) {
    if (Array.isArray(products.docs) && products.docs.length > 0) {
      return (
        <div className="image-grid image-grid-trade">
          {products?.docs.map((product, index) => (
            <div className="image-grid-container-card" key={index}>
              <ProductCard product={product} priceLabel="Est. Price:" />
              { checkForFavorite(product._id) ? (
                <svg
                  onClick={ () => {favoriteItem(product)}}
                  viewBox="0 0 11 10"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '11px',
                    height: '10px',
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z"
                    fill="#e3b767"
                  />
                </svg>
              ) : (
                <svg
                  onClick={ () => {favoriteItem(product)}}
                  viewBox="0 0 11 10"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '11px',
                    height: '10px',
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z"
                    fill="#000000"
                  />
                </svg>
              )}
              <svg
                onClick={() => shareItem(product)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '30px',
                  width: '11px',
                  height: '10px',
                }}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_175_8158)">
                  <path
                    d="M9.58313 0.417634C9.23857 0.068271 8.73615 -0.0749701 8.25916 0.0401891L1.89008 1.37875C0.680572 1.55772 -0.154835 2.68332 0.0241432 3.89282C0.093723 4.36304 0.312813 4.79839 0.648994 5.13445L1.33181 5.81769C1.36377 5.84923 1.38164 5.89235 1.38139 5.93727V7.19708C1.38231 7.98084 2.01743 8.61596 2.80118 8.61688H4.061C4.10598 8.61688 4.14913 8.63471 4.18098 8.66646L4.8638 9.34927C5.27667 9.76488 5.83817 9.99877 6.42398 9.99918C6.6658 9.99898 6.906 9.95944 7.13513 9.88211C7.92585 9.61951 8.50044 8.93283 8.6195 8.1082L9.95806 1.75912C10.0783 1.27712 9.93585 0.767428 9.58313 0.417634ZM1.30058 3.26138C1.41381 2.91157 1.71935 2.65897 2.08422 2.61357C2.09894 2.61161 2.11351 2.60911 2.12796 2.60607L7.678 1.43958L2.63123 6.48342V5.93725C2.63215 5.56046 2.48209 5.19901 2.21463 4.93364L1.53264 4.25083C1.26996 3.99391 1.1795 3.60831 1.30058 3.26138ZM7.3922 7.8724C7.38886 7.88698 7.38679 7.90155 7.3847 7.91614C7.31235 8.44386 6.82591 8.813 6.2982 8.74065C6.08971 8.71206 5.89628 8.61608 5.74744 8.46731L5.06504 7.78491C4.79953 7.51737 4.43794 7.36733 4.06102 7.36831H3.51485L8.56037 2.32154L7.3922 7.8724Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_175_8158">
                    <rect width="10" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div
          style={{ backgroundColor: '#fefcf6', height: '10vh', width: '100%', textAlign: 'center', padding: '0 16px' }}
        >
          {isLoggedUser ?
            (<h5 style={{ backgroundColor: '#fefcf6', color: '#ACACAC' }}>
              You haven’t added any items to your Trade Closet!
              <img
                onClick={() => {
                  history.push('/list/trade-category');
                }}
                style={{ marginLeft: 8, marginTop: 8, marginBottom: -4 }}
                height={22}
                src="assets/images/trade-icon-gold.svg"
                alt="logo"
              />
            </h5>) : (
            <h5 style={{ backgroundColor: '#fefcf6', color: '#ACACAC' }}>
              User hasn’t added any items to Trade Closet!
            </h5>)
          }
        </div>
      );
    }
  } else if (type === 'sell' && products !== undefined) {
    if (Array.isArray(products.docs) && products.docs.length > 0) {
      return (
        <div className="image-grid">
          {products?.docs.map((product, index) => (
            <div className="image-grid-container-card" key={index}>
              <ProductCard product={product} priceLabel="Cost:" />
              { checkForFavorite(product._id) ? (
                <svg
                  onClick={ () => {favoriteItem(product)}}
                  viewBox="0 0 11 10"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '11px',
                    height: '10px',
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z"
                    fill="#e3b767"
                  />
                </svg>
              ) : (
                <svg
                  onClick={ () => {favoriteItem(product)}}
                  viewBox="0 0 11 10"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '11px',
                    height: '10px',
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.01982 0C7.50392 0.00830248 6.99927 0.157306 6.55684 0.431963C6.11441 0.706621 5.74986 1.09721 5.5 1.56428C5.25014 1.09721 4.88559 0.706621 4.44316 0.431963C4.00073 0.157306 3.49608 0.00830248 2.98018 0C2.15778 0.0369694 1.38294 0.409202 0.824953 1.03538C0.266963 1.66155 -0.0288219 2.49077 0.00221794 3.34186C0.00221794 5.49724 2.19492 7.85124 4.03392 9.44728C4.44453 9.80428 4.96367 10 5.5 10C6.03633 10 6.55547 9.80428 6.96607 9.44728C8.80508 7.85124 10.9978 5.49724 10.9978 3.34186C11.0288 2.49077 10.733 1.66155 10.175 1.03538C9.61706 0.409202 8.84222 0.0369694 8.01982 0ZM6.37735 8.72202C6.13178 8.93598 5.82105 9.05332 5.5 9.05332C5.17895 9.05332 4.86822 8.93598 4.62265 8.72202C2.26868 6.67851 0.918515 4.71795 0.918515 3.34186C0.887196 2.74209 1.08637 2.15383 1.47258 1.70539C1.8588 1.25695 2.40073 0.984712 2.98018 0.948046C3.55963 0.984712 4.10157 1.25695 4.48778 1.70539C4.874 2.15383 5.07317 2.74209 5.04185 3.34186C5.04185 3.46758 5.09012 3.58815 5.17604 3.67705C5.26196 3.76594 5.37849 3.81588 5.5 3.81588C5.62151 3.81588 5.73804 3.76594 5.82396 3.67705C5.90988 3.58815 5.95815 3.46758 5.95815 3.34186C5.92683 2.74209 6.126 2.15383 6.51222 1.70539C6.89843 1.25695 7.44037 0.984712 8.01982 0.948046C8.59927 0.984712 9.1412 1.25695 9.52742 1.70539C9.91363 2.15383 10.1128 2.74209 10.0815 3.34186C10.0815 4.71795 8.73132 6.67851 6.37735 8.72013V8.72202Z"
                    fill="#000000"
                  />
                </svg>
              )}
              <svg
                onClick={() => shareItem(product)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '30px',
                  width: '11px',
                  height: '10px',
                }}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_175_8158)">
                  <path
                    d="M9.58313 0.417634C9.23857 0.068271 8.73615 -0.0749701 8.25916 0.0401891L1.89008 1.37875C0.680572 1.55772 -0.154835 2.68332 0.0241432 3.89282C0.093723 4.36304 0.312813 4.79839 0.648994 5.13445L1.33181 5.81769C1.36377 5.84923 1.38164 5.89235 1.38139 5.93727V7.19708C1.38231 7.98084 2.01743 8.61596 2.80118 8.61688H4.061C4.10598 8.61688 4.14913 8.63471 4.18098 8.66646L4.8638 9.34927C5.27667 9.76488 5.83817 9.99877 6.42398 9.99918C6.6658 9.99898 6.906 9.95944 7.13513 9.88211C7.92585 9.61951 8.50044 8.93283 8.6195 8.1082L9.95806 1.75912C10.0783 1.27712 9.93585 0.767428 9.58313 0.417634ZM1.30058 3.26138C1.41381 2.91157 1.71935 2.65897 2.08422 2.61357C2.09894 2.61161 2.11351 2.60911 2.12796 2.60607L7.678 1.43958L2.63123 6.48342V5.93725C2.63215 5.56046 2.48209 5.19901 2.21463 4.93364L1.53264 4.25083C1.26996 3.99391 1.1795 3.60831 1.30058 3.26138ZM7.3922 7.8724C7.38886 7.88698 7.38679 7.90155 7.3847 7.91614C7.31235 8.44386 6.82591 8.813 6.2982 8.74065C6.08971 8.71206 5.89628 8.61608 5.74744 8.46731L5.06504 7.78491C4.79953 7.51737 4.43794 7.36733 4.06102 7.36831H3.51485L8.56037 2.32154L7.3922 7.8724Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_175_8158">
                    <rect width="10" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div
          style={{ backgroundColor: '#fefcf6', height: '10vh', width: '100%', textAlign: 'center', padding: '0 16px' }}
        >
          {
            isLoggedUser ? (
              <h5 style={{ backgroundColor: '#fefcf6', color: '#ACACAC' }}>
                You haven’t added any items to your Sell Closet!
                <img
                  height={22}
                  style={{ marginLeft: 8, marginTop: 8, marginBottom: -4 }}
                  src="assets/images/shop-icon-gold.svg"
                  alt="logo"
                />
              </h5>
            ) : (
              <h5 style={{ backgroundColor: '#fefcf6', color: '#ACACAC' }}>
                User hasn’t added any items to Sell Closet!
              </h5>
            )
          }

        </div>
      );
    }
  } else {
    if (Array.isArray(feed) && feed.length > 0) {
      return (
        <div className="image-grid">
          {feed.map((feedItem: any, index: any) => (
            <div
              className="image-grid-container"
              onClick={e => {
                e.preventDefault();
                history.push(`/post-detail/${feedItem._id}/${feedItem.user._id}`);
              }}
              key={index}
              style={{ boxShadow: 'none' }}
            >
              {feedItem.images && feedItem.images[0] && (
                <div
                  className="image-grid-container"
                  style={{
                    backgroundImage: `url(${
                      feedItem.images[0].url.includes('https://')
                        ? feedItem.images[0].url
                        : `https://thenobo.com${feedItem.images[0].url}`
                    })`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '168px',
                    boxShadow: 'none',
                  }}
                  onClick={() => history.push(`assets/images/test/${index}`)}
                ></div>
              )}
              {feedItem.feedText && !(feedItem.images && feedItem.images[0]) && (
                <div
                  className="image-grid-container image-grid-container-text"
                  style={{
                    maxWidth: '168px',
                    minHeight: '168px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 'none'
                  }}
                  dangerouslySetInnerHTML={{ __html: feedItem.feedText }}
                ></div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div
          style={{ backgroundColor: '#fefcf6', height: '10vh', width: '100%', textAlign: 'center' }}
        >
          <h5 style={{ backgroundColor: '#fefcf6', color: '#ACACAC' }}>Profile has no feed</h5>
        </div>
      );
    }
  }
};

export default ProductList;
