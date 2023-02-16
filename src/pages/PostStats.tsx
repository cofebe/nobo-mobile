import { useState } from 'react';
import { useHistory } from "react-router-dom";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  useIonViewWillEnter,
  IonText,
  useIonActionSheet,
} from '@ionic/react';
import './PostStats.scss';
import { chevronBackOutline, chevronDownOutline } from "ionicons/icons";
import { FeedService } from "../services/FeedService";

const PostStats: React.FC = () => {
  const history = useHistory();
  const feedService = new FeedService();
  const [stats, setStats] = useState<any>({});
  const [presentActionSheet] = useIonActionSheet();
  let [age, setAge] = useState<number>(7);

  const postId = getPostId();

  console.log("PostStats: ", postId);

  function getPostId() {
    let postid = history.location.pathname.substring(history.location.pathname.lastIndexOf('/') + 1)
    console.log("getPostId: ", postid)
    return parseInt(postid)
  }

  useIonViewWillEnter(() => {
    loadStats();
  });

  function loadStats() {
    feedService
      .getPostStats(postId, age)
      .then((res) => res.json())
      .then((data) => {
        console.log("Stats: ", data);
        setStats(data);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  }

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  function showActionSheet() {
    console.log('showActionSheet');
    presentActionSheet({
      header: 'Stat Age',
      buttons: [
        {
          text: '1 day',
          data: {
            age: 1,
          },
        },
        {
          text: '3 days',
          data: {
            age: 3,
          },
        },
        {
          text: '7 days',
          data: {
            age: 7,
          },
        },
        {
          text: 'All Time',
          data: {
            age: 0,
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        console.log('detail', detail);
        age = detail?.data?.age || 0;
        setAge(age);
        loadStats();
      },
    });
  }

  return (
    <IonPage className="post-stats">
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
            <IonText>Statistics Overview</IonText>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="post-stats-content" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList className="nobo-post-detail-background">
          <IonItem className="nobo-post-stats-header-row">
            <div>
              <div className="nobo-post-stats-header-select" onClick={(e) => {
                showActionSheet();
              }}>
                {age > 0 ? `Last ${age} Day${age > 1 ? 's' : ''}` : 'All Time'}
                <IonIcon icon={chevronDownOutline} />
              </div>
            </div>
            <div>
              <div className="nobo-post-stats-header-dates">
                {/*May 10 - May 23*/}
              </div>
            </div>
          </IonItem>
          <IonItem className="nobo-post-stats-item">
            <IonLabel className="nobo-post-stats-label">Impressions</IonLabel>
            <IonNote className="nobo-post-stats-value">{stats?.impressions === undefined ? '' : stats?.impressions || 0}</IonNote>
          </IonItem>
          <IonItem className="nobo-post-stats-item">
            <IonLabel className="nobo-post-stats-label">Profile visits</IonLabel>
            <IonNote className="nobo-post-stats-value">{stats?.profile_visits === undefined ? '' : stats?.profile_visits || 0}</IonNote>
          </IonItem>
          {/*
          <IonItem className="nobo-post-stats-item">
            <IonLabel className="nobo-post-stats-label">Mentions</IonLabel>
            <IonNote className="nobo-post-stats-value">{stats?.mentions === undefined ? '' : stats?.mentions || 0}</IonNote>
          </IonItem>
          */}
          {/*
          <IonItem className="nobo-post-stats-item">
            <IonLabel className="nobo-post-stats-label">Followers</IonLabel>
            <IonNote className="nobo-post-stats-value">{stats?.follows === undefined ? '' : stats?.follows || 0}</IonNote>
          </IonItem>
          */}
          <IonItem className="nobo-post-stats-item">
            <IonLabel className="nobo-post-stats-label">Likes</IonLabel>
            <IonNote className="nobo-post-stats-value">{stats?.likes === undefined ? '' : stats?.likes || 0}</IonNote>
          </IonItem>
          <IonItem className="nobo-post-stats-item">
            <IonLabel className="nobo-post-stats-label">Comments</IonLabel>
            <IonNote className="nobo-post-stats-value">{stats?.comments === undefined ? '' : stats?.comments || 0}</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PostStats;
