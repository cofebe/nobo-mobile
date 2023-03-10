import { useState, useEffect, forwardRef } from 'react';
import { useHistory } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonModal,
} from '@ionic/react';
import './CreateOfferModal.scss';
import { UserService } from '../services/UserService';
import { User } from '../models';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

export interface CreateOfferModalProps {
  onClose: () => void;
}

export type Ref = HTMLIonModalElement;

const CreateOfferModal = forwardRef<Ref, CreateOfferModalProps>(
  ({ onClose }, ref) => {
    const userService = new UserService();
    const [offer, setOffer] = useState<any>('');
    const [isDefault, setIsDefault] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
      reset();
    }, []);

    // function validate() {
    //   return (
    //     !!firstName &&
    //     !!lastName &&
    //     !!address1 &&
    //     !!city &&
    //     !!state &&
    //     !!state &&
    //     !!postalCode &&
    //     !!phone
    //   );
    // }

    // function submit(e: Event) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   const addr: AddressRequest = {
    //     firstName,
    //     lastName,
    //     address1,
    //     address2,
    //     city,
    //     state,
    //     postalCode,
    //     phone,
    //     notes,
    //   };
    //   console.log('Creating address', addr);
    //   userService.addShippingAddress(addr).then((user: User) => {
    //     if (isDefault) {
    //       userService
    //         .setDefaultShippingAddress(user.shippingAddress.length - 1)
    //         .then((user: User) => {
    //           reset();
    //           onClose(user.shippingAddress);
    //         });
    //     } else {
    //       reset();
    //       onClose(user.shippingAddress);
    //     }
    //   });
    // }

    // function reset() {
    //   setFirstName('');
    //   setLastName('');
    //   setAddress1('');
    //   setAddress2('');
    //   setCity('');
    //   setState('');
    //   setPostalCode('');
    //   setPhone('');
    //   setNotes('');
    //   setIsDefault(false);
    // }

    function reset() {
      setOffer('');
      setIsDefault(false);
    }

    return (
      <IonModal
        className="create-offer-container"
        ref={ref}
        backdropDismiss={true}
        swipeToClose={true}
      >
        <IonHeader className="offer-header">
          <IonToolbar className="offer-header-toolbar">
            <IonGrid>
              <IonRow>
                <IonCol size="12">SEND AN OFFER</IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="10">
                  <div>Make sure you send a competitive offer.</div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonContent className="offer-content" scrollY={false}>
          <IonGrid>
            <IonRow className="buttons">
              <IonCol>
                <Button
                  label="SUBMIT"
                  large={true}
                  //   disabled={!validate()}
                  //   onClick={(e) => submit(e)}
                  onClick={() => {
                    //close modal
                    onClose();
                    history.push(`/offer-submitted/123123`);
                  }}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  }
);

export default CreateOfferModal;
