import {
  IonAvatar,
} from '@ionic/react';
import './PendingConnectionAvatarItem.scss';
// import { profile } from 'console';
// import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { ConnectionItem } from '../data/connection-list';
import { viewUser } from '../util';

interface PendingConnectionAvatarItemProps {
  connection: ConnectionItem;
}

const PendingConnectionAvatarItem: React.FC<PendingConnectionAvatarItemProps> = ({ connection }) => {
  const history = useHistory();

  return (
    <div className="pending-connection-avatar-container" onClick={
      (e) => {
        e.preventDefault();
        viewUser(history, connection.user_id, connection.user_type);
      }}>
      <IonAvatar className="pending-connection-image">
        <img src={connection.profile_image} alt="avatar" />
      </IonAvatar>
      {(connection.status === 1) && (
        <div className="pending-connection-dot"> </div>
      )}
    </div>
  );
};

export default PendingConnectionAvatarItem;
