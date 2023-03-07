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
import './CreateShippingAddressModal.scss';
import { UserService } from '../services/UserService';
import { User, Address, AddressRequest } from '../models';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';

export interface CreateShippingAddressModalProps {
  onClose: (addresses: Address[]) => void;
};

export type Ref = HTMLIonModalElement;

const CreateShippingAddressModal = forwardRef<Ref, CreateShippingAddressModalProps>(({ onClose }, ref) => {
  const userService = new UserService();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);

  useEffect(() => {
    reset();
  }, []);

  function validate() {
    return !!firstName && !!lastName && !!address1 && !!city && !!state && !!state && !!postalCode && !!phone;
  }

  function submit(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const addr: AddressRequest = {
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      postalCode,
      phone,
      notes,
    };
    console.log('Creating address', addr);
    userService.addShippingAddress(addr)
      .then((user: User) => {
        if (isDefault) {
          userService.setDefaultShippingAddress(user.shippingAddress.length - 1)
            .then((user: User) => {
              reset();
              onClose(user.shippingAddress);
            });
        } else {
          reset();
          onClose(user.shippingAddress);
        }
      });
  }

  function reset() {
    setFirstName('');
    setLastName('');
    setAddress1('');
    setAddress2('');
    setCity('');
    setState('');
    setPostalCode('');
    setPhone('');
    setNotes('');
    setIsDefault(false);
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
          <IonRow>
            <IonCol>
              <Input
                value={phone}
                placeholder="Phone Number"
                required={true}
                onChange={(val) => setPhone(val)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Textarea
                value={notes}
                autocapitalize="on sentence"
                spellcheck={true}
                onChange={(val) => setNotes(val)}
                placeholder="Notes"
                autoGrow={false}
                rows={3}
              />
            </IonCol>
          </IonRow>
          <IonRow className="checkbox">
            <IonCol>
              <Checkbox
                value={isDefault}
                label="Set as defult shipping address"
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

export default CreateShippingAddressModal;
