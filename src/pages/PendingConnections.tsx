import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
  IonInput,
  useIonViewWillEnter,
} from '@ionic/react';
import { chevronBackOutline, searchOutline } from 'ionicons/icons';
import './URP.css';
import './Connections.scss';
import { ConnectionItem } from '../data/connection-list';
import PendingConnectionListItem from '../components/PendingConnectionListItem';
import SortWidget from '../components/SortWidget';
import { ConnectionService } from '../services/ConnectionService';

const PendingConnections: React.FC = () => {
  const history = useHistory();
  const connectionService = new ConnectionService();

  const [connectionsSort, setConnectionsSort] = useState<string[]>(['Name', 'asc']);
  const [pendingConnections, setPendingConnections] = useState<ConnectionItem[]>([]);
  const [filter, setFilter] = useState<string | undefined>();

  useIonViewWillEnter(() => {
    loadPendingConnections();
  });

  function loadPendingConnections() {
    connectionService.getPendingConnections()
      .then((res: any) => res.json())
      .then((data: any) => {
        data = sortConnections(data);
        setPendingConnections(data);
      });
  }

  function rejectConnection(conn: ConnectionItem) {
    console.log('rejectConnection', conn);

    connectionService.rejectConnection(conn.id)
      .then(() => {
        loadPendingConnections();
      });
  }

  function acceptConnection(conn: ConnectionItem) {
    console.log('acceptConnection', conn);

    connectionService.acceptConnection(conn.id)
      .then(() => {
        loadPendingConnections();
      });
  }

  function sortConnections(connections: ConnectionItem[], val?: string) {
    function getSortValue(obj: ConnectionItem) {
      switch(val) {
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
        lead = (connectionsSort[1] === 'asc' ? -1 : 1);
      }
    } else {
      val = connectionsSort[0];
      lead = (connectionsSort[1] === 'asc' ? 1 : -1);
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
    setConnectionsSort([val, (lead === 1 ? 'asc' : 'desc')]);
    return conns;
  }


  return (
    <IonPage className="nobo-page">
      <IonHeader>
        <IonToolbar
          style={{
            padding: "40px 10px 10px 10px",
          }}
        >
          <IonButtons slot="start"
              onClick={() => {
                history.goBack()
              }}>
            <IonIcon
              slot="icon-only"
              icon={chevronBackOutline}
            />
            <IonText>Connections</IonText>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="connections-content" scrollY={true}>
        <IonRow className="connections-search-container">
          <IonCol size="12" className="connections-search-col">
            <IonIcon icon={searchOutline} />
            <IonInput className="connections-search" placeholder="Search" value={filter} onIonChange={(e: any) => setFilter(e.target.value?.toLowerCase())} />
          </IonCol>
          <IonCol size="2" className="connections-sort" style={{ display: 'none' }}>
            <SortWidget types={["Name", "School"]} asc={true} onSort={(val) => {
              setPendingConnections(sortConnections(pendingConnections, val));
            }}/>
          </IonCol>
        </IonRow>
        <IonRow className="connections-container">
          <IonCol>
            {pendingConnections
              .filter(c => !filter || (c.first_name + ' ' + c.last_name).toLowerCase().includes(filter) || c.school.toLowerCase().includes(filter))
              .map(c => <PendingConnectionListItem key={c.user_id + 1} connection={c} onDelete={(conn) => rejectConnection(conn)} onAccept={(conn) => acceptConnection(conn)} />)
            }
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default PendingConnections;
