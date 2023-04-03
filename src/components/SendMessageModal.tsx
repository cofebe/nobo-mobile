import { useState, forwardRef } from 'react';
import {
  IonContent,
  IonItem,
  IonButton,
  IonTextarea,
  IonModal,
} from '@ionic/react';
import './SendMessageModal.scss';
import { UserService } from '../services/UserService';
import Button from './Button';

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
      <IonContent className="send-message-content" scrollY={false}>
        <div className="post-input-text">
          <IonTextarea
            className="send-message-text"
            value={data}
            autocapitalize="on sentence"
            spellcheck={true}
            onIonChange={(e) => setData(e.detail.value!)}
            placeholder="WRITE A MESSAGE..."
            maxlength={350}
            autoGrow={true}
            rows={5}
          ></IonTextarea>
        </div>
        <div className="buttons">
          <div className="left">
            <Button
              label="Cancel"
              type="transparent"
              onClick={(e) => {
                e.preventDefault();
                if (onCancel) {
                  onCancel();
                }
              }}
            />
          </div>
          <div className="right">
            <Button
              label="Send"
              disabled={!validate()}
              onClick={(e) => {
                e.preventDefault();
                send();
              }}
            />
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
});

export default SendMessageModal;
