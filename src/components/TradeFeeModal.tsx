import { forwardRef } from 'react';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
} from '@ionic/react';
import './TradeFeeModal.scss';

export interface TradeFeeModalProps {
};

export type Ref = HTMLIonModalElement;

const TradeFeeModal = forwardRef<Ref, TradeFeeModalProps>((props, ref) => {

  return (
    <IonModal className="trade-fee-container" ref={ref} backdropDismiss={true} swipeToClose={true}>
      <IonContent scrollY={false}>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <img src="/assets/images/trade-fee-equation.svg" className="trade-fee-equation" alt="trade fee equation" />
            </IonCol>
          </IonRow>
          <IonRow className="button">
            <IonCol size="12" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              (ref as any)?.current?.dismiss();
            }}>
              Close
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
});

export default TradeFeeModal;
