import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
 IonButtons,
 IonContent,
 IonIcon,
 IonHeader,
 IonPage,
 IonToolbar,
 IonGrid,
 IonRow,
 IonCol,
 useIonViewWillEnter,
 IonText,
 IonRange,
 IonButton,
 useIonLoading,
} from '@ionic/react';
import './PromotePost.scss';
import { chevronBackOutline } from 'ionicons/icons';
import { FeedService } from '../services/FeedService';
import { SubscriptionService } from '../services/SubscriptionService';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { isPlatform } from '@ionic/react';
import { loadingOptions } from '../util';

const PromotePost: React.FC = () => {
 let store = new InAppPurchase2();
 const subscriptionService = new SubscriptionService(store);
 const feedService = new FeedService();
 const [presentLoading, dismissLoading] = useIonLoading();

 const history = useHistory();
 const [postId, setPostId] = useState<number>(getPostId());
 const [duration, setDuration] = useState<number>(3);
 const [cost, setCost] = useState<number>(calculateCost(duration));
 const [appleProductId, setAppleProductId] = useState<string>('');

 useEffect(() => {
  switch (cost) {
   case subscriptionService.getProductPrice('com.nobo.promotedpost.1day'):
    setAppleProductId('com.nobo.promotedpost.1day');
    break;
   case subscriptionService.getProductPrice('com.nobo.promotedpost.2day'):
    setAppleProductId('com.nobo.promotedpost.2day');
    break;
   case subscriptionService.getProductPrice('com.nobo.promotedpost.3day'):
    setAppleProductId('com.nobo.promotedpost.3day');
    break;
   case subscriptionService.getProductPrice('com.nobo.promotedpost.4day'):
    setAppleProductId('com.nobo.promotedpost.4day');
    break;
   case subscriptionService.getProductPrice('com.nobo.promotedpost.5day'):
    setAppleProductId('com.nobo.promotedpost.5day');
    break;
   case subscriptionService.getProductPrice('com.nobo.promotedpost.6day'):
    setAppleProductId('com.nobo.promotedpost.6day');
    break;
   case subscriptionService.getProductPrice('com.nobo.promotedpost.1week'):
    setAppleProductId('com.nobo.promotedpost.1week');
    break;
   default:
    setAppleProductId('');
  }
 }, [cost]);

 //console.log("PromotePost: ", postId);

 useIonViewWillEnter(() => {
  // subscriptionService = new SubscriptionService(new InAppPurchase2());
  if (isPlatform('ios')) {
   subscriptionService.refreshStore();
  }
 });

 function getPostId() {
  const parts = history.location.pathname.split('/');
  const postid = parts[parts.length - 1];
  //console.log(`PostLikes:getPostId: "${postid}" ${parseInt(postid)}`);
  return parseInt(postid);
 }

 function calculateCost(duration: number) {
  console.log('This is the store ', store);
  switch (duration) {
   case 1:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.1day');
   case 2:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.2day');
   case 3:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.3day');
   case 4:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.4day');
   case 5:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.5day');
   case 6:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.6day');
   case 7:
    return subscriptionService.getProductPrice('com.nobo.promotedpost.1week');
   default:
    return 0;
  }

  // if (duration === 7) {
  //   return 9.99;
  // }
  // return duration * 1.49;
 }

 function promotePost(duration: number, cost: number) {
  console.log('promotePost', duration, cost);
  feedService
   .promotePost(postId, duration, cost)
   .then(() => {
    history.goBack();
   })
   .catch(err => {
    console.error('Error promoting post:', err);
   });
 }

 return (
  <IonPage className="post-promote-page">
   <IonHeader>
    <IonToolbar
     style={{
      padding: '40px 10px 10px 10px',
     }}
    >
     <IonButtons
      slot="start"
      onClick={() => {
       history.goBack();
      }}
     >
      <IonIcon slot="icon-only" icon={chevronBackOutline} />
      <IonText>Post</IonText>
     </IonButtons>
    </IonToolbar>
   </IonHeader>
   <IonContent className="post-promote-content" fullscreen>
    <IonGrid className="post-promote-grid">
     <IonRow>
      <IonCol size="12" className="intro">
       Promote your post to reach more users. Promoted posts are shown to all users for a set
       duration and include reporting of impressions.
      </IonCol>
     </IonRow>
     <IonRow>
      <IonCol size="12" className="instructions">
       Please select the number of days you'd like to promote your post.
      </IonCol>
     </IonRow>
     <IonRow>
      <IonCol size="12" className="duration">
       <div className="duration-label">Promote post for</div>
       <div className="duration-text">
        {duration} day{duration > 1 ? 's' : ''}
       </div>
      </IonCol>
     </IonRow>
     <IonRow>
      <IonCol size="12" className="duration-select">
       <IonRange
        min={1}
        max={7}
        snaps={true}
        ticks={false}
        value={duration}
        onIonChange={e => {
         setDuration(e.detail.value as number);
         let c = calculateCost(e.detail.value as number);
         setCost(c);
        }}
       />
      </IonCol>
     </IonRow>
     <IonRow>
      <IonCol size="12" className="cost">
       <div className="cost-label">Cost</div>
       <div className="cost-text">${cost}</div>
      </IonCol>
     </IonRow>
     <IonRow>
      <IonCol size="12" className="buttons">
       <IonButton
        id="open-subscription-modal"
        onClick={e => {
         e.preventDefault();
         if (isPlatform('ios')) {
          presentLoading(loadingOptions);
          subscriptionService
           .purchasePromotedPost(appleProductId)
           .then(() => {
            store.when(appleProductId).approved((product: any) => {
             product.verify();
             product.finish();
             promotePost(duration, cost);
             dismissLoading();
            });
            store.when(appleProductId).cancelled(() => {
             dismissLoading();
            });
            // dismissLoading();
            // console.log('Purchased promoted post');
           })
           .catch((err: any) => {
            dismissLoading();
            console.error('Error buying product:', err);
           });
         } else {
          promotePost(duration, cost);
         }
        }}
        color="#00816D"
        type="submit"
        expand="block"
        className="nobo-upgrade-plan-btn"
       >
        Promote Post
       </IonButton>
      </IonCol>
     </IonRow>
    </IonGrid>
   </IonContent>
  </IonPage>
 );
};

export default PromotePost;
