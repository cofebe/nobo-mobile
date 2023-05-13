import { useState, useEffect, forwardRef } from 'react';
import {
 IonContent,
 IonHeader,
 IonGrid,
 IonRow,
 IonCol,
 IonItem,
 IonButton,
 IonToolbar,
 IonModal,
} from '@ionic/react';
import './SignupAddStatsCategoryModal.scss';

export interface SignupAddStatsCategoryModalProps {
 sport: any;
 currentSeason: any;
 onCancel: () => void;
 onClose: (season: string, section: string, category: string) => void;
}

export type Ref = HTMLIonModalElement;

const SignupAddStatsCategoryModal = forwardRef<Ref, SignupAddStatsCategoryModalProps>(
 ({ sport, currentSeason, onCancel, onClose }, ref) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
   let items = (sport?.sections || []).map((s: any) => {
    return {
     name: s.name,
     categories: s.categories
      //.filter((c: any) => {
      //  if (!currentSeason) {
      //    return true;
      //  }

      //  const foundCategory = currentSeason.categories.find((cat: any) => cat.category === c.name);
      //  return !foundCategory;
      //})
      .map((c: any) => {
       let disabled = false;
       if (currentSeason) {
        disabled = !!currentSeason.categories.find((cat: any) => cat.category === c.name);
       }
       return {
        name: c.name,
        disabled,
       };
      }),
    };
   });
   setItems(items);
  }, [currentSeason, sport]);

  return (
   <IonModal className="add-stat-container" ref={ref} backdropDismiss={false} swipeToClose={false}>
    <IonHeader className="add-stat-header">
     <IonToolbar className="add-stat-header-toolbar">
      <IonGrid style={{ backgroundColor: 'white' }}>
       <IonRow>
        <IonCol size="12">
         <IonItem lines="none">
          <IonButton
           buttonType=""
           color="#9BC9C1"
           fill="clear"
           className="cancel-btn"
           size="large"
           slot="start"
           onClick={e => {
            e.preventDefault();
            if (onCancel) {
             onCancel();
            }
           }}
          >
           Cancel
          </IonButton>
         </IonItem>
        </IonCol>
       </IonRow>
      </IonGrid>
     </IonToolbar>
    </IonHeader>
    <IonContent className="add-stat-content" scrollY={false}>
     <div className="add-stat-header">Stats by Category</div>
     {items.map((section: any) => (
      <>
       <IonItem className="add-stat-section" lines="none">
        {section.name}
       </IonItem>
       {section.categories.map((cat: any, index: number) => (
        <IonItem
         className={'add-stat-category ' + (cat.disabled ? 'disabled' : '')}
         onClick={e => {
          //console.log('click', section, cat);
          if (!cat.disabled) {
           onClose(currentSeason.season, section.name, cat.name);
          }
         }}
         lines={index < section.categories.length - 1 ? undefined : 'none'}
        >
         {cat.name}
        </IonItem>
       ))}
      </>
     ))}
    </IonContent>
   </IonModal>
  );
 }
);

export default SignupAddStatsCategoryModal;
