import {
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
  useIonViewWillEnter,
  useIonViewDidLeave,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { FeedItem } from '../../data/athlete-feed';
import { FeedService } from "../../services/FeedService";
import FeedListItem from '../FeedListItem';
import { useHistory } from "react-router-dom";

interface PostsSectionProps {
  data: { title: string },
  className: string;
  myProfile: boolean;
  userId: number;
  userType: string;
}

const PostsSection: React.FC<PostsSectionProps> = ({ className, myProfile, userId, userType }) => {
  const history = useHistory();
  const feedService = new FeedService();
  const [messages, setMessages] = useState<FeedItem[]>([]);

  useEffect(() => {
    getUserFeed();
  }, [userId, userType]);

  useIonViewWillEnter(() => {
    getUserFeed();
  });

  useIonViewDidLeave(() => {
    reset();
  });

  function reset() {
    setMessages([]);
  }

  function getUserFeed() {
    console.log("getUserFeed:", userId, userType);

    reset();
    return feedService
      .getUserFeed(userId, userType, 0)
      .then((res) => res.json())
      .then((data) => {
        console.log("Feed:", data);
        setMessages(data?.FeedItems || []);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  }

  const refresh = (e: CustomEvent) => {
    getUserFeed()
      .then(() => {
        e.detail.complete();
      })
      .catch(() => {
        e.detail.complete();
      });
  };

  return (
    <div className={'urp-post-section ' + className}>
      <IonContent className="posts-content">
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList lines='none' className="urp-list-background">
          {messages.length > 0 && messages.map(m => <div><FeedListItem key={m.post_id} message={m} disableProfileLink={true} />

          </div>)}
          { messages.length === 0 && myProfile &&
          <div className="urp-highlight-add-media-container urp-highlight-add-media-container">
              <p className="urp-highlight-add-media-title">Uh! Looks  like you haven’t added any posts to your account yet</p>
              <p className="urp-highlight-add-media-text"
                  onClick={(e) => {
                      e.preventDefault();
                      history.push("/home/feed");
                  }}>Add Posts</p>
          </div>}
          { messages.length === 0 && !myProfile &&
            <div className="urp-highlight-add-media-container">
              <p className="urp-highlight-add-media-title">Uh! Looks like the user hasn't added any posts yet</p>
            </div>
          }
        </IonList>
      </IonContent>
    </div>
  );
};

export default PostsSection;
