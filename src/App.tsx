
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
import Forgot from './pages/Forgot';
import ForgotReset from './pages/ForgotReset';
import Roles from './pages/Roles';
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
import SignUpAthlete from './pages/SignUpAthlete';
import FilterSearch from './pages/FilterSearch';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Settings from './pages/Settings';
import SettingsShipping from './pages/SettingsShipping';
import SettingsPayment from './pages/SettingsPayment';
import ManageSubscription from './pages/ManageSubscription';
import PrimarySport from './pages/PrimarySport';
import HorizontalLineSpinner from './components/HorizontalLineSpinner';
import PostDetail from './pages/PostDetail';
import ListItem from './pages/ListItem';
import Experience from './pages/Experience';
import SignUpDetails from './pages/SignUpDetails';
import SignUp from './pages/SignUp';
import ProfilePicture from './pages/ProfilePicture';
import FollowPeople from './pages/FollowPeople';
import SelectBrands from './pages/SelectBrands';
import CreateFirstPost from './pages/CreateFirstPost';





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

            {/* URP */}
           
            
            
            <Route path="/onboarding-post" exact={true}>
              <CreateFirstPost />
            </Route>
            <Route path="/forgot" exact={true}>
              <Forgot />
            </Route>
            <Route path="/forgot-reset" exact={true}>
              <ForgotReset />
            </Route>
            <Route path="/signup-roles" exact={true}>
              <Roles />
            </Route>
           
            <Route path="/signup-athlete" exact={true}>
              <SignUpAthlete />
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
            <Route path="/manage-subscription" exact={true}>
              <ManageSubscription />
            </Route>
            <Route path="/filter-search" exact={true}>
              <FilterSearch />
            </Route>
            <Route path="/primary-sport" exact={true}>
              <PrimarySport />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
        {showLoading ? <HorizontalLineSpinner /> : ''}
      </IonApp>
    </Elements>
  );
};

export default App;
