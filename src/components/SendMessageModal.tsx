import { useState, forwardRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonButton,
  IonTextarea,
  IonToolbar,
  IonModal,
} from '@ionic/react';
import './SendMessageModal.scss';
import { UserService } from "../services/UserService";

export interface SendMessageModalProps {
  orderId?: string;
  productId?: string;
  onCancel?: () => void;
  onClose?: () => void;
};

export type Ref = HTMLIonModalElement;

const SendMessageModal = forwardRef<Ref, SendMessageModalProps>(({ orderId, productId, onCancel, onClose }, ref) => {
  const userService = new UserService();

  const [data, setData] = useState<string>('');

  function validate() {
    return !!data;
  }

  function send() {
    console.log('Send message:', data);

    if (data) {
      userService.newConversation(orderId || null, productId || null, data).then(() => {
        console.log('send message', data);
        if (onClose) {
          onClose();
        }
      });
    }
  }

  return (
    <IonModal className="send-message-container" ref={ref} backdropDismiss={true} swipeToClose={true}>
      <IonHeader className="send-message-header">
        <IonToolbar className="send-message-header-toolbar">
          <IonGrid style={{ backgroundColor: "white" }}>
            <IonRow>
              <IonCol size="12">
                <IonItem lines="none">
                  <IonButton
                    buttonType=""
                    color="#9BC9C1"
                    fill="clear"
                    className="cancel-btn"
                    size="large"
                    slot="start"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onCancel) {
                        onCancel();
                      }
                    }}
                  >
                    Cancel
                  </IonButton>
                  <IonButton
                    buttonType=""
                    className="send-message-btn"
                    size="large"
                    disabled={!validate()}
                    slot="end"
                    onClick={(e) => {
                      e.preventDefault();
                      send();
                    }}
                  >
                    Send
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent className="send-message-content" scrollY={false}>
        <IonItem className="post-input-area">
          <div className="post-input-text">
            <IonTextarea
              className="send-message-text"
              value={data}
              autocapitalize="on sentence"
              spellcheck={true}
              onIonChange={(e) => setData(e.detail.value!)}
              placeholder="Write a message..."
              maxlength={350}
              autoGrow={true}
              rows={5}
            ></IonTextarea>
          </div>
        </IonItem>
      </IonContent>
    </IonModal>
  );
});

export default SendMessageModal;
