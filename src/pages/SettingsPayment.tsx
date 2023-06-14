import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import './SettingsPayment.scss';
import Button from '../components/Button';
import { User, PaymentMethod, PaymentMethodsResponse } from '../models';
import { UserService } from '../services/UserService';
import CreatePaymentMethodModal from '../components/CreatePaymentMethodModal';
import { getCardImage } from '../utils';

const SettingsPayment: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string>('');

  const modal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    load();
  });

  function load() {
    userService.getPaymentMethods().then((res: PaymentMethodsResponse) => {
      setPaymentMethods(res.cards);
      setDefaultPaymentMethodId(res.customer.default_source);
    });
  }

  function addNew() {
    modal.current?.present();
  }

  function setDefault(pm: PaymentMethod) {
    userService.setDefaultPaymentMethod(pm.id).then(() => {
      load();
    });
  }

  function remove(pm: PaymentMethod) {
    userService.removePaymentMethod(pm.id).then(() => {
      load();
    });
  }

  return (
    <IonPage className="settings-payment-container">
      <IonHeader className="settings-payment-header">
        <IonToolbar className="settings-payment-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div className="title">
                  <div
                    className="back-button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      history.goBack();
                    }}
                  >
                    <img src="assets/images/arrow-left.svg" alt="back" />
                  </div>
                  Payment Methods
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-payment-content" scrollY={false}>
        <div
          className="add-container"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            addNew();
          }}
        >
          <div>
            <img src="assets/images/add-square.svg" alt="add shipping address" />
          </div>
          <div>New Card</div>
        </div>
        {paymentMethods.length ? (
          <div>
            {paymentMethods.map(pm => (
              <div
                className={
                  'settings-payment-item ' + (defaultPaymentMethodId === pm.id ? 'selected' : '')
                }
                key={pm.id}
              >
                {defaultPaymentMethodId === pm.id && (
                  <div className="is-default">Default Payment</div>
                )}
                <div className="left-right">
                  <div className="left">
                    <div className="logo-container">
                      <img src={getCardImage(pm.brand)} alt="card brand" />
                    </div>
                  </div>
                  <div className="right">
                    <div className="name">{pm.name}</div>
                    <div className="last4">
                      * &nbsp;&nbsp; * &nbsp;&nbsp; * &nbsp;&nbsp; * &nbsp;&nbsp; {pm.last4}
                    </div>
                    <div className="expiration">
                      Exp. {pm.exp_month}/{pm.exp_year}
                    </div>
                  </div>
                </div>
                <div className="action-container">
                  {defaultPaymentMethodId !== pm.id && (
                    <div
                      className="action"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDefault(pm);
                      }}
                    >
                      Set as Default
                    </div>
                  )}
                  <div
                    className="action"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(pm);
                    }}
                  >
                    Remove
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-cart">No payment methods defined!</div>
        )}
      </IonContent>

      <CreatePaymentMethodModal
        ref={modal}
        onClose={() => {
          console.log('add payment method');
          userService.getPaymentMethods().then((res: PaymentMethodsResponse) => {
            setPaymentMethods(res.cards);
            modal.current?.dismiss();
          });
        }}
      />
    </IonPage>
  );
};

export default SettingsPayment;
