import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidLeave,
} from '@ionic/react';
import { PraiseItem } from '../../data/coach-praise';
import { UserService } from '../../services/UserService';
import { viewUser, DATE_FORMAT } from '../../util';
import format from 'date-fns/format';
import './PraiseSection.scss';

interface PraiseSectionProps {
  data: { title: string };
  className: string;
  myProfile?: boolean;
  userId?: number;
}

const PraiseSection: React.FC<PraiseSectionProps> = ({
  userId,
  className,
}) => {
  const history = useHistory();
  const userService = new UserService();
  const [praises, setPraises] = useState<PraiseItem[]>([]);

  useEffect(() => {
    getPraises();
  }, [userId]);

  useIonViewDidLeave(() => {
    reset();
  });

  function getPraises() {
    console.log('getPraises', userId);

    reset();
    return userService.getUserPraise(userId || 0)
      .then(res => res.json())
      .then(data => {
        console.log('Praise:', data);
        setPraises(data);
      })
      .catch(err => {
        console.error('Error getting user praise:', err);
      });
  }

  function reset() {
    setPraises([]);
  }

  const refresh = (e: CustomEvent) => {
    getPraises()
      .then(() => {
        e.detail.complete();
      })
      .catch(() => {
        e.detail.complete();
      });
  };

  return (
    <div className={"nobo-praise-section " + className}>
      <IonContent className="posts-content">
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList lines="none" className="nobo-list-background">
          {praises.map((p) => (
            <IonItem key={p.praise_id} className="nobo-praise-item" onClick={(e) => {
              e.preventDefault();
              viewUser(history, p.user_id, p.account_type);
            }}>
              <IonRow>
                <IonCol size="2">
                  <img src={p.profile_image} alt="avatar" />
                </IonCol>
                <IonCol size="10">
                  <div className="name">
                    {p.from_name}
                  </div>
                  <div className="message">
                    {p.message}
                  </div>
                  <div className="date">
                    {format(new Date(p.timestamp * 1000), DATE_FORMAT)}
                  </div>
                </IonCol>
              </IonRow>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </div>
  );
};

export default PraiseSection;
