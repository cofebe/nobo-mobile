import { useState, useEffect, forwardRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonModal,
} from '@ionic/react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import './CreatePaymentMethodModal.scss';
import { UserService } from '../services/UserService';
import { User, Address } from '../models';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';

export interface CreatePaymentMethodModalProps {
  onClose: () => void;
};

export type Ref = HTMLIonModalElement;

const CreatePaymentMethodModal = forwardRef<Ref, CreatePaymentMethodModalProps>(({ onClose }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const userService = new UserService();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<Address>();
  const [copyShipping, setCopyShipping] = useState<boolean>(false);

  const elementOptions = {
    classes: {
      base: 'stripe-element',
      invalid: 'stripe-element-invalid',
    },
    style: {
      base: {
        fontFamily: 'Nunito Sans, sans-serif',
        fontSize: '15px',
      },
    },
  };

  useEffect(() => {
    reset();

    userService
      .getMe()
      .then((user: User) => {
        setShippingAddress(user.shippingAddress.find(a => a.default));
      });
  }, []);

  function toggleCopyFromShipping(val: boolean) {
    setCopyShipping(val);
    if (!val) {
      reset(false);
    } else if (shippingAddress) {
      setFirstName(shippingAddress.firstName);
      setLastName(shippingAddress.lastName);
      setAddress1(shippingAddress.address1);
      setAddress2(shippingAddress.address2);
      setCity(shippingAddress.city);
      setState(shippingAddress.state);
      setPostalCode(shippingAddress.postalCode);
    }
  }

  function validate() {
    return !!firstName && !!lastName && !!address1 && !!city && !!state && !!state && !!postalCode;
  }

  function submit(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    if (!stripe) {
      console.log('Stripe isn\'t loaded!');
      return;
    }
    if (!elements) {
      console.log('Stripe Elements aren\'t loaded!');
      return;
    }

    const cardNumberElem = elements.getElement('cardNumber');
    if (!cardNumberElem) {
      window.alert('Unable to find card number element!');
      return;
    }

    const data = {
      name: `${firstName} ${lastName}`,
      address_line1: address1,
      address_line2: address2,
      address_city: city,
      address_state: state,
      address_zip: postalCode,
      address_country: 'US',
      currency: 'USD'
    };
    stripe.createToken(cardNumberElem, data).then(ret => {
      console.log('createToken:ret', ret);
      console.log('Creating payment method', ret);
      userService.addPaymentMethod(ret)
        .then((success: boolean) => {
          if (!success) {
            window.alert('Unable to add payment method!');
            return;
          }

          if (isDefault && ret.token?.card?.id) {
            userService.setDefaultPaymentMethod(ret.token?.card?.id)
              .then((success: boolean) => {
                if (!success) {
                  window.alert('Unable to set default payment method!');
                }

                reset();
                onClose();
              });
          } else {
            reset();
            onClose();
          }
        });
    });
  }

  function reset(setDefault: boolean = true) {
    setFirstName('');
    setLastName('');
    setAddress1('');
    setAddress2('');
    setCity('');
    setState('');
    setPostalCode('');
    if (setDefault) {
      setIsDefault(false);
    }
  }

  return (
    <IonModal className="add-address-container" ref={ref} backdropDismiss={true} swipeToClose={true}>
      <IonHeader className="address-header">
        <IonToolbar className="address-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                New Shipping Address
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="address-content" scrollY={false}>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <CardNumberElement options={elementOptions} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <CardExpiryElement options={elementOptions} />
            </IonCol>
            <IonCol size="6">
              <CardCvcElement options={elementOptions} />
            </IonCol>
          </IonRow>
          <IonRow className="checkbox">
            <IonCol>
              <Checkbox
                value={copyShipping}
                label="Same as shipping address"
                onChange={(val) => toggleCopyFromShipping(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <Input
                value={firstName}
                placeholder="First Name"
                required={true}
                onChange={(val) => setFirstName(val)}
              />
            </IonCol>
            <IonCol size="6">
              <Input
                value={lastName}
                placeholder="Last Name"
                required={true}
                onChange={(val) => setLastName(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Input
                value={address1}
                placeholder="Address 1"
                required={true}
                onChange={(val) => setAddress1(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Input
                value={address2}
                placeholder="Address 2"
                required={false}
                onChange={(val) => setAddress2(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="5">
              <Input
                value={city}
                placeholder="City"
                required={true}
                onChange={(val) => setCity(val)}
              />
            </IonCol>
            <IonCol size="4">
              <Input
                value={state}
                placeholder="State"
                required={true}
                onChange={(val) => setState(val)}
              />
            </IonCol>
            <IonCol size="3">
              <Input
                value={postalCode}
                placeholder="Zip"
                required={true}
                onChange={(val) => setPostalCode(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow className="checkbox">
            <IonCol>
              <Checkbox
                value={isDefault}
                label="Set as defult payment method"
                onChange={(val) => setIsDefault(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow className="buttons">
            <IonCol>
              <Button label="Save" large={true} disabled={!validate()} onClick={(e) => submit(e)} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
});

export default CreatePaymentMethodModal;
