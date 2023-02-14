import {
  IonItem,
  IonRow,
  IonCol,
  IonAvatar,
  IonButton,
} from '@ionic/react';
import './PendingConnectionListItem.scss';
import { useHistory } from "react-router-dom";
import { ConnectionItem } from '../data/connection-list';
import { viewUser } from '../util';

interface PendingConnectionListItemProps {
  connection: ConnectionItem;
  onDelete?: (conn: ConnectionItem) => void;
  onAccept?: (conn: ConnectionItem) => void;
}

const PendingConnectionListItem: React.FC<PendingConnectionListItemProps> = ({ connection, onDelete, onAccept }) => {
  const history = useHistory();

  function deleteItem() {
    if (onDelete) {
      onDelete(connection);
    }
  }

  function acceptItem() {
    if (onAccept) {
      onAccept(connection);
    }
  }

  return (
    <IonItem lines="none" className="pending-connection-item" detail={false}>
      <IonRow className="ion-text-wrap connection-row">
        <IonCol size="7" className="connection-image-name-container" onClick={
          (e) => {
            e.preventDefault();
            viewUser(history, connection.user_id, connection.user_type);
          }}>
            <IonAvatar className="connection-image">
              <img src={connection.profile_image} alt="avatar" />
            </IonAvatar>
            <p className="connection-name">{connection.first_name} {connection.last_name}</p>
        </IonCol>
        <IonCol size="5" className="connection-buttons">
          <IonButton onClick={(e) => {
            e.preventDefault();
            acceptItem();
          }}>Accept</IonButton>
          <div className="sep"></div>
          <IonButton onClick={(e) => {
            e.preventDefault();
            deleteItem();
          }}>Decline</IonButton>
        </IonCol>
      </IonRow>
    </IonItem>
  );
};

export default PendingConnectionListItem;
