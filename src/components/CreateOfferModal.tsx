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
  useIonViewDidEnter,
} from '@ionic/react';
import './CreateOfferModal.scss';
import { UserService } from '../services/UserService';
import { OfferService } from '../services/OfferService';
import { User, Product } from '../models';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Input from './Input';

export interface CreateOfferModalProps {
  productId: string;
  onClose: () => void;
}

export type Ref = HTMLIonModalElement;

const CreateOfferModal = forwardRef<Ref, CreateOfferModalProps>(
  ({ onClose, productId }, ref) => {
    const userService = new UserService();
    const offerService = new OfferService();
    const [offer, setOffer] = useState<any>('');
    const [isDefault, setIsDefault] = useState<boolean>(false);
    const history = useHistory();

    useIonViewDidEnter(() => {
      reset();
    });

    useEffect(() => {
      reset();
    }, []);

    const submitOffer = () => {
      offerService
        .createBuyOffer(productId, offer)
        .then((res) => {
          if (res) {
            console.log('res', res);
            onClose();
            history.push(`/offer-submitted/${productId}`, {
              offer: offer,
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    };

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
                <IonCol className="send-offer-title" size="12">
                  SEND AN OFFER
                </IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center">
                <IonCol className="competitive-offer-prompt" size="10">
                  <div>Make sure you send a competitive offer.</div>
                </IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center">
                <IonCol className="offer-input-left-padding" size="7">
                  <Input
                    className="offer-input"
                    value={offer}
                    placeholder="__.00"
                    onChange={(val) => setOffer(val)}
                  />
                </IonCol>
              </IonRow>
              <IonRow class="ion-justify-content-center">
                <IonCol className="card-charged-warning" size="10">
                  <div>IF YOUR OFFER IS ACCEPTED YOUR CARD WILL BE CHARGED</div>
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
                    // onClose();
                    submitOffer();
                    // history.push(`/offer-submitted/${productId}`, {
                    //   offer: offer,
                    // });
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
