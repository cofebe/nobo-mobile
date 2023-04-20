import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  useIonToast,
  useIonViewDidEnter,
} from '@ionic/react';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import './ProfileFollowButton.scss';
import { Profile } from '../data/profile';
import { UserService } from '../services/UserService';
import { ConnectionService } from '../services/ConnectionService';
import { MessagingService } from '../services/MessagingService';
import { SubscriptionService } from '../services/SubscriptionService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import WatchlistItem from '../components/WatchlistItem';
import CreatePraiseModal from './CreatePraiseModal';

interface ProfileFollowButtonProps {
  userId: number;
  data: any;
  athleteProfile?: any;
}

interface ActionListItem {
  label: string;
  disabled?: boolean;
  action: () => void;
}

const ProfileFollowButton: React.FC<ProfileFollowButtonProps> = ({
  userId,
  data,
  athleteProfile,
}) => {
  const history = useHistory();
  const userService = new UserService();
  const connectionService = new ConnectionService();
  const messagingService = new MessagingService();
  const subscriptionService = new SubscriptionService(new InAppPurchase2());
  let [menuOpen, setMenuOpen] = useState(false);
  const [buttonText, setButtonText] = useState<string>('Follow');
  const [socialData, setSocialData] = useState<any | null | undefined>({});
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [watchlistNotes, setWatchlistNotes] = useState('');
  const [userSubscribed, setUserSubscribed] = useState(false);
  const [profile, setProfile] = useState<Profile>(athleteProfile);

  const [present, dismiss] = useIonToast();

  const praiseModal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setProfile(athleteProfile);

    setSocialData(data || {});

    if (data.my_user_type === 'coach') {
      setUserSubscribed(
        subscriptionService.isSubscribed('com.nobo.coachrecruiter.1month')
      );
    } else if (data.my_user_type === 'trainer') {
      setUserSubscribed(
        subscriptionService.isSubscribed('com.nobo.trainer.1month')
      );
    }

    updateButton(data);
  }, [data, athleteProfile]);

  useIonViewDidEnter(() => {
    setMenuOpen(false);
  });

  function getActionItems() {
    const items: ActionListItem[] = [];

    items.push({
      label: socialData?.is_followed ? 'Unfollow' : 'Follow',
      action: socialData?.is_followed ? unfollow : follow,
    });
    switch (socialData?.connection_status) {
      case 'pending':
        items.push({
          label: 'Disconnect', // 'Connect Pending',
          // disabled: true,
          action: disconnect,
        });
        break;
      case 'connected':
        items.push({
          label: 'Disconnect',
          action: disconnect,
        });
        break;
      default:
        items.push({
          label: 'Connect',
          action: connect,
        });
        break;
    }

    if (socialData?.connection_status === 'connected') {
      items.push({
        label: 'Reach',
        action: reach,
      });

      items.push({
        label: 'Praise',
        action: praise,
      });
    }

    if (
      (socialData?.my_user_type === 'coach' && userSubscribed) ||
      (socialData?.my_user_type === 'trainer' && userSubscribed)
    ) {
      items.push({
        label: 'Watch',
        action: watch,
      });
    }

    return items;
  }
  const menuItems = getActionItems();

  function updateButton(socialData: any) {
    // console.log('updateButton', socialData?.is_followed, socialData?.is_connected);
    let buttonText = 'Follow';

    if (socialData?.connection_status === 'pending') {
      buttonText = 'Pending';
    } else if (socialData?.connection_status === 'connected') {
      buttonText = 'Connected';
    } else if (socialData?.is_followed) {
      buttonText = 'Followed';
    } else {
      buttonText = 'Follow';
    }

    setButtonText(buttonText);
    setMenuOpen(false);
  }

  function button(e: any) {
    e.preventDefault();
    setMenuOpen(!menuOpen);
  }

  function showMessage(message: string) {
    // let mess = `Connection Request Sent to ${coachProfile.fromName}`;
    let errColor = 'primary';

    present({
      buttons: [{ handler: () => dismiss() }],
      message,
      color: errColor,
      duration: 5000,
      position: 'top',
      //onDidDismiss: () => console.log("dismissed"),
      //onWillDismiss: () => console.log("will dismiss"),
    });
  }

  function follow() {
    console.log('follow');
    // userService
    //   .followUser(userId)
    //   .then(() => {
    //     socialData.is_followed = true;
    //     setSocialData(socialData);
    //     updateButton(socialData);
    //     showMessage(`Followed ${socialData?.name || 'user'}.`);
    //   })
    //   .catch((err) => {
    //     console.error('Error: ', err);
    //   });
  }

  function unfollow() {
    console.log('unfollow');
    // userService
    //   .removeFollowUser(userId)
    //   .then(() => {
    //     socialData.is_followed = false;
    //     setSocialData(socialData);
    //     updateButton(socialData);
    //     showMessage(`Unfollowed ${socialData?.name || 'user'}.`);
    //   })
    //   .catch((err) => {
    //     console.error('Error: ', err);
    //   });
  }

  function connect() {
    follow();
    console.log('connect');
    connectionService
      .createConnection(userId)
      .then((res) => res.json())
      .then((data) => {
        socialData.connection_status = 'pending';
        socialData.connection_id = data.id;
        setSocialData(socialData);
        updateButton(socialData);
        showMessage(
          `Connection request sent to ${socialData?.name || 'user'}.`
        );
      });
  }

  function disconnect() {
    console.log('disconnect');
    connectionService.removeConnection(socialData.connection_id).then(() => {
      socialData.connection_status = 'unknown';
      setSocialData(socialData);
      updateButton(socialData);
      showMessage(`Connection to ${socialData?.name || 'user'} removed.`);
    });
  }

  function reach() {
    console.log('reach');
    messagingService.getOrCreateConversation(userId).then((convo: any) => {
      history.push(`/chat/${convo?.id}`);
    });
  }

  function watch() {
    setShowBottomMenu(true);
    console.log('Watch show menu');
  }

  function addToWatchlist() {
    console.log('watch');
    if (profile === undefined) return;

    userService
      .addToWatchlist(userId, {
        athlete_id: profile.user_id,
        notes: watchlistNotes,
      })
      .then(() => {
        console.log('Added to watchlist');
        showMessage(`${socialData?.name || 'user'} added to Watchlist.`);
        setWatchlistNotes('');
      });
  }
  function praise() {
    console.log('praise');
    praiseModal.current?.present();
    setMenuOpen(false);
  }

  return (
    <div className={`follow-button ${menuOpen ? ' open' : ''}`}>
      <IonButton
        onClick={(e) => button(e)}
        className={'follow-button-white' + (menuOpen ? ' open' : '')}
      >
        <div>{buttonText}</div>
        <div>
          <IonIcon icon={menuOpen ? chevronUpOutline : chevronDownOutline} />
        </div>
      </IonButton>
      <div className={`follow-menu ${menuOpen ? ' open' : ''}`}>
        {menuItems.map((item) => (
          <div
            className={'follow-menu-item ' + (item.disabled ? 'disabled' : '')}
            onClick={(e) => {
              e.preventDefault();
              item.action();
            }}
            key={item.label}
          >
            <div>{item.label}</div>
          </div>
        ))}
      </div>
      {showBottomMenu && profile !== undefined && (
        <div className="nobo-watchlist-praiseModal-back">
          <div className="nobo-watchlist-bottom-menu">
            <div style={{ paddingTop: '12px' }}>
              <WatchlistItem profile={profile}></WatchlistItem>
            </div>

            <div className="nobo-add-to-watchlist">
              <IonItem lines="full">
                <IonLabel class="nobo-label" position="floating">
                  Add Note
                </IonLabel>
                <IonInput
                  autoCapitalize="on sentence"
                  spellCheck={true}
                  style={{ paddingLeft: '8px' }}
                  type="text"
                  onIonChange={(e) => setWatchlistNotes(e.detail.value!)}
                ></IonInput>
              </IonItem>
              <div className="nobo-watchlist-add-button">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    addToWatchlist();
                    setShowBottomMenu(false);
                  }}
                >
                  Add Player
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreatePraiseModal
        ref={praiseModal}
        userId={userId}
        onCancel={() => {
          praiseModal.current?.dismiss();
        }}
        onClose={() => {
          praiseModal.current?.dismiss();
        }}
      />
    </div>
  );
};

export default ProfileFollowButton;
