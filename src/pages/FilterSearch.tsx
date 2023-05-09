import React, { useState, useEffect } from 'react';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonModal,
  IonSearchbar,
} from '@ionic/react';

export const SEARCH = [
  {
    id: 's1',
    title: 'Search Categpory 1',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-categorty-1',
  },
  {
    id: 's2',
    title: 'Search Categpory 2',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-2',
  },
  {
    id: 's3',
    title: 'Search Categpory 3',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-3',
  },
  {
    id: 's4',
    title: 'Search Categpory 4',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-4',
  },
  {
    id: 's5',
    title: 'Search Categpory 5',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-5',
  },
  {
    id: 's6',
    title: 'Search Categpory 6',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-6',
  },
  {
    id: 's7',
    title: 'Search Categpory 7',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-7',
  },
  {
    id: 's8',
    title: 'Search Categpory 8',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-8',
  },
  {
    id: 's9',
    title: 'Search Categpory 9',
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: '/search-category-9',
  },
];

export const FilterSearch: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    SEARCH.filter(item => item.title === searchText);
  }, [searchText]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {SEARCH.map(search => (
              <IonCol size="12" size-xs="12" size-sm="6" size-md="4" size-lg="4" key={search.id}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{search.title}</IonCardTitle>
                    <IonCardSubtitle>Sector</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>{search.detail}</IonCardContent>
                  <IonFooter className="ion-text-right">
                    <IonButton color="secondary" fill="clear" routerLink={search.page}>
                      View
                    </IonButton>
                  </IonFooter>
                </IonCard>
              </IonCol>
            ))}
            <IonCol className="ion-text-center">
              <IonModal isOpen={showModal} className="my-custom-class">
                <p>This is modal content</p>
                <IonButton color="secondary" onClick={() => setShowModal(false)}>
                  Close Modal
                </IonButton>
              </IonModal>
              <IonButton color="secondary" onClick={() => setShowModal(true)}>
                Information
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FilterSearch;
