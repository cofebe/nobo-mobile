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
import './SettingsShipping.scss';
import Button from '../components/Button';
import { Address, User } from '../models';
import { UserService } from '../services/UserService';
import CreateShippingAddressModal from '../components/CreateShippingAddressModal';

const SettingsShipping: React.FC = () => {
  const history = useHistory();
  const userService = new UserService();
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [editAddress, setEditAddress] = useState<Address>();
  const [editAddressIndex, setEditAddressIndex] = useState<number>(-1);

  const modal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    load();
  });

  function load() {
    userService.getMe().then((user: User) => {
      setShippingAddresses(user.shippingAddress);
    });
  }

  function addNew() {
    setEditAddress(undefined);
    setEditAddressIndex(-1);

    modal.current?.present();
  }

  function edit(addr: Address, index: number) {
    console.log('edit', addr, index);
    setEditAddress(addr);
    setEditAddressIndex(index);
    modal.current?.present();
  }

  function setDefault(addr: Address, index: number) {
    console.log('remove', addr, index);
    userService.setDefaultShippingAddress(index).then(user => {
      setShippingAddresses(user.shippingAddress);
    });
  }

  function remove(addr: Address, index: number) {
    console.log('remove', addr, index);
    userService.removeShippingAddress(index).then(user => {
      setShippingAddresses(user.shippingAddress);
    });
  }

  return (
    <IonPage className="settings-shipping-container">
      <IonHeader className="settings-shipping-header">
        <IonToolbar className="settings-shipping-header-toolbar">
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
                  Shipping Address
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-shipping-content" scrollY={false}>
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
          <div>New Address</div>
        </div>
        {shippingAddresses.length ? (
          <div>
            {shippingAddresses.map((addr, index) => (
              <div
                className={'settings-shipping-item ' + (addr.default ? 'selected' : '')}
                key={addr._id}
              >
                {addr.default && <div className="is-default">Default Address</div>}
                <div className="name">
                  {addr.firstName} {addr.lastName}
                </div>
                <div className="address1">{addr.address1}</div>
                {addr.address2 ? <div className="address2">{addr.address2}</div> : ''}
                <div className="city">{addr.city}</div>
                <div className="state">{addr.state}</div>
                <div className="zip">{addr.postalCode}</div>
                <div className="phone">{addr.phone}</div>
                <div className="action-container">
                  {!addr.default && (
                    <div
                      className="action"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDefault(addr, index);
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
                      edit(addr, index);
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="action"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(addr, index);
                    }}
                  >
                    Remove
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-cart">No shipping addresses defined!</div>
        )}
      </IonContent>

      <CreateShippingAddressModal
        ref={modal}
        address={editAddress}
        index={editAddressIndex}
        onClose={(addresses: Address[]) => {
          console.log('add/edit address', addresses);
          setShippingAddresses(addresses);
          //load();

          modal.current?.dismiss();
        }}
      />
    </IonPage>
  );
};

export default SettingsShipping;
