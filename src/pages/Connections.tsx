import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonIcon,
  IonContent,
  IonPage,
  useIonViewWillEnter,
  IonRow,
  IonCol,
  IonInput,
} from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import '../styles.scss';
import './Connections.scss';
import { ConnectionItem } from '../data/connection-list';
import ConnectionListItem from '../components/ConnectionListItem';
import PendingConnectionAvatarItem from '../components/PendingConnectionAvatarItem';
import SortWidget from '../components/SortWidget';
import { ConnectionService } from '../services/ConnectionService';
// import UrpHeader from '../components/NoboHeader';

const Connections: React.FC = () => {
  const connectionService = new ConnectionService();
  const history = useHistory();

  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [connectionsSort, setConnectionsSort] = useState<string[]>(['Name', 'asc']);
  const [pendingConnections, setPendingConnections] = useState<ConnectionItem[]>([]);
  const [filter, setFilter] = useState<string | undefined>();

  useIonViewWillEnter(() => {
    loadConnections();

    connectionService
      .getPendingConnections()
      .then((res: any) => res.json())
      .then((data: any) => {
        console.log('pending connections', data);
        setPendingConnections(data);
      });
  });

  function loadConnections() {
    connectionService
      .getConnections()
      .then((res: any) => res.json())
      .then((data: any) => {
        data = sortConnections(data);
        setConnections(data);
      });
  }

  function removeConnection(conn: ConnectionItem) {
    console.log('removeConnection', conn);

    connectionService.removeConnection(conn.id).then(() => {
      loadConnections();
    });
  }

  function sortConnections(connections: ConnectionItem[], val?: string) {
    function getSortValue(obj: ConnectionItem) {
      switch (val) {
        case 'Name':
          return `${obj.first_name} ${obj.last_name}`;
        case 'School':
          return obj.school;
        case 'Sport':
          return obj.primary_sport;
        case 'Position':
          return obj.primary_position;
        default:
          return `${obj.first_name} ${obj.last_name}`;
      }
    }

    let lead = 1;
    if (val) {
      if (connectionsSort[0] === val) {
        lead = connectionsSort[1] === 'asc' ? -1 : 1;
      }
    } else {
      val = connectionsSort[0];
      lead = connectionsSort[1] === 'asc' ? 1 : -1;
    }

    const conns = [...connections];
    conns.sort((a, b) => {
      const a1 = getSortValue(a);
      const b1 = getSortValue(b);
      if (a1 < b1) {
        return -1 * lead;
      } else if (a1 > b1) {
        return 1 * lead;
      } else {
        return 0;
      }
    });
    setConnectionsSort([val, lead === 1 ? 'asc' : 'desc']);
    return conns;
  }

  return (
    <IonPage className="nobo-page">
      {/* <UrpHeader></UrpHeader> */}
      <IonContent className="connections-content" scrollY={true}>
        <IonRow className="connections-search-container">
          <IonCol size="12" className="connections-search-col">
            <IonIcon icon={searchOutline} />
            <IonInput
              className="connections-search"
              placeholder="Search"
              value={filter}
              onIonChange={(e: any) => setFilter(e.target.value?.toLowerCase())}
            />
          </IonCol>
          <IonCol size="2" className="connections-sort" style={{ display: 'none' }}>
            <SortWidget
              types={['Name', 'School']}
              asc={true}
              onSort={val => {
                setConnections(sortConnections(connections, val));
              }}
            />
          </IonCol>
        </IonRow>
        {pendingConnections.length > 0 && (
          <IonRow className="connection-requests-container">
            <IonCol>
              Connection Requests
              <span
                className="connection-requests-view-all"
                onClick={e => {
                  e.preventDefault();
                  history.push('/home/connections/pending');
                }}
              >
                View All
              </span>
            </IonCol>
          </IonRow>
        )}
        {pendingConnections.length > 0 && (
          <IonRow className="pending-connections-container">
            <IonCol>
              {pendingConnections.map(c => (
                <PendingConnectionAvatarItem key={c.user_id + 1} connection={c} />
              ))}
            </IonCol>
          </IonRow>
        )}
        <IonRow className="connections-container">
          <IonCol>
            {connections
              .filter(
                c =>
                  !filter ||
                  (c.first_name + ' ' + c.last_name).toLowerCase().includes(filter) ||
                  c.school.toLowerCase().includes(filter)
              )
              .map(c => (
                <ConnectionListItem
                  key={c.user_id + 1}
                  connection={c}
                  onDelete={conn => removeConnection(conn)}
                />
              ))}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Connections;
