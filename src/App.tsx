import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './Home';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Forgot from './pages/Forgot';
import ForgotReset from './pages/ForgotReset';
import Roles from './pages/Roles';
import Chat from './pages/Chat';
import CheckoutShipping from './pages/CheckoutShipping';
import SignUpAthlete from './pages/SignUpAthlete';
import FilterSearch from './pages/FilterSearch';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Settings from './pages/Settings';
import ManageSubscription from './pages/ManageSubscription';
import PrimarySport from './pages/PrimarySport';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

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

import GetStarted from './pages/GetStarted';
import ShoppingCart from './pages/ShoppingCart';

setupIonicReact({
  swipeBackEnabled: false,
});

Keyboard.setResizeMode({ mode: KeyboardResize.Body }).catch(() => {
  /* do nothing */
});

document.title = 'The NOBO';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
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


        <Route path="/signup" exact={true}>
          <SignUp />
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
        <Route path="/settings" exact={true}>
          <Settings />
        </Route>
        <Route path="/manage-subscription" exact={true}>
          <ManageSubscription />
        </Route>
        <Route path="/filter-search" exact={true}>
          <FilterSearch />
        </Route>
        <Route path="/chat/:id" exact={true}>
          <Chat />
        </Route>
        <Route path="/home/" exact={false}>
          <Home />
        </Route>
        <Route path="/primary-sport" exact={true}>
          <PrimarySport />
        </Route>
        <Route path="/" exact={true}>
          <Splash />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
