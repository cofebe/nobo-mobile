import { useState, useEffect, forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonModal,
} from '@ionic/react';
import './OfferTradeModal.scss';
import { UserService } from '../services/UserService';
import { Product } from '../models';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import { getMinTradeValue, getTradeFee } from '../utils';

export interface OfferTradeModalProps {
  product: Product;
  onClose: () => void;
};

export type Ref = HTMLIonModalElement;

const OfferTradeModal = forwardRef<Ref, OfferTradeModalProps>(({ product, onClose }, ref) => {
  const history = useHistory();
  const userService = new UserService();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  useEffect(() => {
    reset();

  }, [product]);

  function validate() {
    return !!firstName && !!lastName;
  }

  function submit(e: Event) {
    e.preventDefault();
    e.stopPropagation();

  }

  function reset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <IonModal className="offer-trade-container" ref={ref} backdropDismiss={true} swipeToClose={true}>
      <IonHeader className="address-header">
        <IonToolbar className="address-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                New Payment Method
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

export default OfferTradeModal;
