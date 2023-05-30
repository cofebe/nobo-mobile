import { forwardRef } from 'react';
import { IonHeader, IonGrid, IonRow, IonCol, IonToolbar, IonModal } from '@ionic/react';
import './ListItemModal.scss';
import { useHistory } from 'react-router';

export interface ListItemModalProps {
  onClose: () => void;
}

export type Ref = HTMLIonModalElement;

const ListItemModal = forwardRef<Ref, ListItemModalProps>(({ onClose }, ref) => {
  const history = useHistory();
  return (
    <IonModal className="list-item-container" ref={ref} backdropDismiss={true} swipeToClose={true}>
      <IonHeader className="list-item-header">
        <IonToolbar className="offer-header-toolbar">
          <IonGrid>
            <IonRow>
              <IonCol className="list-item-title" size="12">
                LIST YOUR ITEMS
              </IonCol>
            </IonRow>
            <IonRow
              onClick={() => {
                onClose();
                history.push('/list/category');
              }}
              class="ion-justify-content-center"
            >
              <IonCol className="list-item-flex" size="8">
                <img height={22} src="assets/images/shop-icon-gold.svg" alt="logo" />
                <div className="list-item-option">LIST ITEM TO SELL</div>
              </IonCol>
            </IonRow>
            <IonRow
              onClick={() => {
                onClose();
                //history.push('/list-item/trade');
              }}
              class="ion-justify-content-center"
            >
              <IonCol className="list-item-flex" size="8">
                <img height={22} src="assets/images/trade-icon-gold.svg" alt="logo" />
                <div className="list-item-option">LIST ITEM TO TRADE</div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
    </IonModal>
  );
});

export default ListItemModal;
