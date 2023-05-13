import {
 IonIcon,
 IonItem,
 IonItemSliding,
 IonItemOptions,
 IonItemOption,
 IonRow,
 IonCol,
 IonAvatar,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import './ConnectionListItem.scss';
import { useHistory } from 'react-router-dom';
import { ConnectionItem } from '../data/connection-list';
import { viewUser } from '../util';

interface ConnectionListItemProps {
 connection: ConnectionItem;
 onDelete?: (conn: ConnectionItem) => void;
}

const ConnectionListItem: React.FC<ConnectionListItemProps> = ({ connection, onDelete }) => {
 const history = useHistory();

 function deleteItem(conn: ConnectionItem) {
  const slider: any = document.querySelector('ion-item-sliding');
  slider.closeOpened();

  if (onDelete) {
   onDelete(conn);
  }
 }

 return (
  <IonItemSliding id="slidingItem" className="connection-list-item">
   <IonItem lines="none" className="connection-item" detail={false}>
    <IonRow
     className="ion-text-wrap connection-row"
     onClick={e => {
      e.preventDefault();
      viewUser(history, connection.user_id, connection.user_type);
     }}
    >
     <IonCol size="7" className="connection-image-name-container">
      <IonAvatar className="connection-image">
       <img src={connection.profile_image} alt="avatar" />
      </IonAvatar>
      <p className="connection-name">
       {connection.first_name} {connection.last_name}
      </p>
     </IonCol>
     <IonCol size="2" className="connection-stats">
      <div>{connection.status === 0 && <div className="connection-dot"> </div>}</div>
      <div className="connection-sport">
       {connection.primary_sport && (
        <img
         className="logo-image"
         src={`assets/images/nobo-badge-${connection.primary_sport?.toLowerCase()}.svg`}
         alt="sport"
        />
       )}
      </div>
      <div className="connection-position">{connection.primary_position}</div>
     </IonCol>
     <IonCol size="3" className="connection-school">
      {connection?.school}
     </IonCol>
    </IonRow>
   </IonItem>
   <IonItemOptions>
    <IonItemOption onClick={(e: any) => deleteItem(connection)} className="reject-connection">
     <IonIcon icon={trashOutline} />
    </IonItemOption>
   </IonItemOptions>
  </IonItemSliding>
 );
};

export default ConnectionListItem;
