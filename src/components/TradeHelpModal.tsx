import { forwardRef } from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonModal } from '@ionic/react';
import './TradeHelpModal.scss';

export interface TradeHelpModalProps {}

export type Ref = HTMLIonModalElement;

const TradeHelpModal = forwardRef<Ref, TradeHelpModalProps>((props, ref) => {
 return (
  <IonModal className="trade-help-container" ref={ref} backdropDismiss={true} swipeToClose={true}>
   <IonContent scrollY={false}>
    <IonGrid className="trade-tooltip">
     <IonRow className="header">
      <IonCol>
       TRADING ON <i>The</i>NOBO
      </IonCol>
     </IonRow>
     <IonRow className="bullet">
      <IonCol size="1" className="label">
       1.
      </IonCol>
      <IonCol size="11" className="value">
       <h1>List Your Product for Trade</h1>
       <p>Trade products from your closet, quickly and easily!</p>
      </IonCol>
     </IonRow>
     <IonRow className="bullet">
      <IonCol size="1" className="label">
       2.
      </IonCol>
      <IonCol size="11" className="value">
       <h1>Get Paid</h1>
       <p>
        When the other NOBO user accepts your trade request and both of you split the cost of the
        trade transaction fee, we will ship your product to them, and theirs to you! Hang tight,
        your “new for you” luxury product is on the way!
       </p>
      </IonCol>
     </IonRow>
     <IonRow className="table-container">
      <IonCol>
       <table>
        <thead>
         <tr>
          <th>Trade Transaction Value</th>
          <th>Trade Transaction Fee</th>
         </tr>
        </thead>
        <tbody>
         <tr>
          <td>$1 - $19,999</td>
          <td>12%</td>
         </tr>
         <tr>
          <td>$20,000 - $49,999</td>
          <td>8%</td>
         </tr>
         <tr>
          <td>$50,000 +</td>
          <td>4%</td>
         </tr>
        </tbody>
       </table>
      </IonCol>
     </IonRow>
     <IonRow className="bullet">
      <IonCol size="1" className="label">
       3.
      </IonCol>
      <IonCol size="11" className="value">
       <h1>Support</h1>
       <p>We’re here to help, in any way we can.</p>
       <p>
        Contact us: <a href="mailto:customerservice@thenobo.com">customerservice@thenobo.com</a>
       </p>
       <p>we promise you’ll hear from real people, not a bot!</p>
      </IonCol>
     </IonRow>
     <IonRow
      className="close"
      onClick={e => {
       e.preventDefault();
       e.stopPropagation();
       (ref as any)?.current?.dismiss();
      }}
     >
      <IonCol>Close</IonCol>
     </IonRow>
    </IonGrid>
   </IonContent>
  </IonModal>
 );
});

export default TradeHelpModal;
