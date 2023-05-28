import { useState } from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

import { environment } from './environments/environment';
import { loadingStore, LoadingState } from './loading-store';

import Home from './Home';
import Splash from './pages/Splash';
import Login from './pages/Login';
// import SignUp from './pages/SignUpOld';
import Forgot from './pages/Forgot';
import ForgotReset from './pages/ForgotReset';
import Chat from './pages/Chat';
import GetStarted from './pages/GetStarted';
import ShoppingCart from './pages/ShoppingCart';
import TradeOfferShipping from './pages/TradeOfferShipping';
import TradeOfferPayment from './pages/TradeOfferPayment';
import TradeOfferSummary from './pages/TradeOfferSummary';
import TradeOfferComplete from './pages/TradeOfferComplete';
import CheckoutShipping from './pages/CheckoutShipping';
import CheckoutPayment from './pages/CheckoutPayment';
import CheckoutSummary from './pages/CheckoutSummary';
import CheckoutComplete from './pages/CheckoutComplete';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Settings from './pages/Settings';
import SettingsShipping from './pages/SettingsShipping';
import SettingsPayment from './pages/SettingsPayment';
import HorizontalLineSpinner from './components/HorizontalLineSpinner';
import PostDetail from './pages/PostDetail';
import ListItem from './pages/ListItem';
import SignUp1 from './pages/SignUp1';
import SignUp2 from './pages/SignUp2';
import Experience from './pages/Experience';
import FollowPeople from './pages/FollowPeople';
import SelectBrands from './pages/SelectBrands';
import CreateFirstPost from './pages/CreateFirstPost';
import Purchases from './pages/Purchases';
import SingleOrder from './pages/SingleOrder';
import AccountSettings from './pages/AccountSettings';
import UploadProfilePic from './pages/UploadProfilePic';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import OfferComplete from './pages/OfferComplete';
import MyTrade from './pages/MyTrade';


setupIonicReact({
  swipeBackEnabled: false,
});

Keyboard.setResizeMode({ mode: KeyboardResize.Body }).catch(() => {
  /* do nothing */
});

const stripePromise = loadStripe(environment.stripeApiKey);

document.title = 'The NOBO';

/******************************************************************************
 * Loading indicator
 *
 * A somewhat convoluted way of showing the loading indicator after a specific
 * amount of time, but also to show no less than another specific amount of
 * time. Convoluated because of the way React works.
 */

let loading: boolean = false;
let loadingTimeout: any;
let loadingStartTime: number;
let loadingSetShowLoading: any;

const LOADER_DEBOUNCE_MS = 500; // don't show unless we've been waiting for more than this number of milliseconds
const LOADER_MIN_VISIBLE = 500; // make sure to show the indicator for no less than this amount of milliseconds

function startLoading(setShowLoading: any) {
  if (!loadingTimeout) {
    loadingTimeout = setTimeout(() => {
      if (!loading) {
        loadingStartTime = new Date().getTime();
        loading = true;
        setShowLoading(loading);
      }
    }, LOADER_DEBOUNCE_MS);
  }
}

function stopLoading(setShowLoading: any) {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = undefined;
  }
  if (loading) {
    loading = false;
    const now = new Date().getTime();
    const elapseTime = now - loadingStartTime;
    if (elapseTime < LOADER_MIN_VISIBLE) {
      setTimeout(() => {
        setShowLoading(loading);
      }, LOADER_MIN_VISIBLE - elapseTime);
    } else {
      setShowLoading(loading);
    }
  }
}

loadingStore.subscribe((state: LoadingState) => {
  if (state.pendingLoading) {
    startLoading(loadingSetShowLoading);
  } else {
    stopLoading(loadingSetShowLoading);
  }
});

/******************************************************************************
 * End loading indicator */

const App: React.FC = () => {
  let [showLoading, setShowLoading] = useState<boolean>(false);
  // React goodness with loading indicator
  loadingSetShowLoading = setShowLoading;

  return (
    <Elements stripe={stripePromise}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/home/" exact={false}>
              <Home />
            </Route>
            <Route path="/" exact={true}>
              <Splash />
            </Route>
            <Route path="/get-started" exact={true}>
              <GetStarted />
            </Route>
            <Route path="/login" exact={true}>
              <Login />
            </Route>
            <Route path="/cart" exact={true}>
              <ShoppingCart />
            </Route>
            <Route path="/checkout/shipping" exact={true}>
              <CheckoutShipping />
            </Route>
            <Route path="/checkout/payment" exact={true}>
              <CheckoutPayment />
            </Route>
            <Route path="/checkout/summary" exact={true}>
              <CheckoutSummary />
            </Route>
            <Route path="/checkout/order/:id" exact={true}>
              <CheckoutComplete />
            </Route>
            <Route exact path="/post-detail/:id">
              <PostDetail />
            </Route>
            <Route path="/offer-submitted/:id" exact={true}>
              <OfferComplete />
            </Route>
            <Route path="/trade/shipping" exact={true}>
              <TradeOfferShipping />
            </Route>
            <Route path="/trade/payment" exact={true}>
              <TradeOfferPayment />
            </Route>
            <Route path="/trade/summary" exact={true}>
              <TradeOfferSummary />
            </Route>
            <Route path="/trade/complete/:id" exact={true}>
              <TradeOfferComplete />
            </Route>
            <Route exact path="/list-item/sell">
              <ListItem />
            </Route>
            <Route exact path="/list-item/trade">
              <ListItem />
            </Route>
            <Route path="/chat/:id" exact={true}>
              <Chat />
            </Route>
            <Route path="/settings" exact={true}>
              <Settings />
            </Route>
            <Route path="/settings/shipping" exact={true}>
              <SettingsShipping />
            </Route>
            <Route path="/settings/payment" exact={true}>
              <SettingsPayment />
            </Route>
            <Route path="/settings/account" exact={true}>
              <AccountSettings />
            </Route>
            <Route path="/settings/purchases" exact={true}>
              <Purchases />
            </Route>
            <Route path="/settings/purchases/single-order/:id" exact={true}>
              <SingleOrder />
            </Route>
            <Route path="/settings/trades" exact={true}>
              <MyTrade />
            </Route>
            <Route path="/signup1" exact={true}>
              <SignUp1 />
            </Route>
            <Route path="/signup2" exact={true}>
              <SignUp2 />
            </Route>
            <Route path="/experience" exact={true}>
              <Experience />
            </Route>
            <Route path="/follow-people" exact={true}>
              <FollowPeople />
            </Route>
            <Route path="/select-brands" exact={true}>
              <SelectBrands />
            </Route>
            <Route path="/onboarding-post" exact={true}>
              <CreateFirstPost />
            </Route>
            <Route path="/profile-picture" exact={true}>
              <UploadProfilePic />
            </Route>

            {/* URP */}

            <Route path="/forgot" exact={true}>
              <Forgot />
            </Route>
            <Route path="/forgot-reset" exact={true}>
              <ForgotReset />
            </Route>
            <Route path="/contact-us" exact={true}>
              <ContactUs />
            </Route>
            <Route path="/privacy-policy" exact={true}>
              <PrivacyPolicy />
            </Route>
            <Route path="/terms-and-conditions" exact={true}>
              <TermsAndConditions />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
        {showLoading ? <HorizontalLineSpinner /> : ''}
      </IonApp>
    </Elements>
  );
};

export default App;
