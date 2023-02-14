import {
  IonContent,
  IonLabel,
  IonCol,
  IonRow,
  IonModal,
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonInput,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  useIonViewWillEnter,
} from '@ionic/react';
import './NILDealsSection.scss';
import { useHistory } from 'react-router-dom';
import { OverlayEventDetail } from '@ionic/core/components';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { UserService } from '../../services/UserService';
import { IonIcon } from '@ionic/react';
import { useState, useRef, useEffect } from 'react';

import {
  linkOutline,
  chevronDownOutline,
  chevronUpOutline,
  trashOutline,
  pencilOutline,
  add,
} from 'ionicons/icons';

interface ArticlesSectionProps {
  data: { title: string };
  className: string;
  myProfile: boolean;
  userId: number;
  userType: string;
}

interface Article {
  articleName: string;
  articleSourceLink: string;
  id: number;
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  data,
  userId,
  className,
  myProfile,
  userType,
}) => {
  const history = useHistory();
  const articleModal = useRef<HTMLIonModalElement>(null);
  const articleInput = useRef<HTMLIonInputElement>(null);
  //   const [showMore, setShowMore] = useState(false);
  const [newArticles, setNewArticles] = useState<Article[]>([]);
  const [singleNewArticle, setSingleNewArticle] = useState<Article>({
    articleName: '',
    articleSourceLink: '',
    id: 0,
  });
  const [validName, setValidName] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sourceLinkEmpty, setSourceLinkEmpty] = useState(true);
  const [validSourceLink, setValidSourceLink] = useState(true);

  const userService = new UserService();

  const confirm = () => {
    if (editMode) {
      const slider: any = document.querySelector('ion-item-sliding');
      slider.closeOpened();
      userService
        .updateArticle(userId, singleNewArticle.id, singleNewArticle)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setNewArticles([...newArticles, singleNewArticle]);
      userService
        .saveArticles(userId, singleNewArticle)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    userService
      .getArticles(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewArticles(dataCopy);
        setSingleNewArticle({
          articleName: '',
          articleSourceLink: '',
          id: 0,
        });
        setValidName(false);
        articleModal.current?.dismiss(articleInput.current?.value, 'confirm');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    const slider: any = document.querySelector('ion-item-sliding');
    slider.closeOpened();
    userService
      .getArticles(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        setNewArticles(dataCopy);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validate = () => {
    if (validName && validSourceLink && !sourceLinkEmpty) {
      return true;
    } else if (
      singleNewArticle.articleName.length !== 0 &&
      singleNewArticle.articleSourceLink.length !== 0 &&
      validName &&
      validSourceLink
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log('Entered Articles Section');
    userService
      .getArticles(userId)
      .then((res) => res.json())
      .then((data) => {
        const dataCopy = [...data];
        console.log('Article Data: ', dataCopy);
        setNewArticles(dataCopy);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      id="urp-article-section"
      className={'urp-article-section ' + className}
    >
      <IonContent style={{ fontSize: '10px' }}>
        <div
          style={{
            display: 'flex',
            marginBottom: '10px',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {newArticles.map((Article, index) => (
            <IonItemSliding>
              <IonItem lines="none">
                <div
                  key={Article.articleName}
                  style={{
                    borderBottom: '1px solid lightgrey',
                    width: '100%',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div
                      style={{
                        flex: '7',
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <IonLabel style={{ color: '#00D6B6' }}>
                        <span style={{ fontWeight: '500', fontSize: '12px' }}>
                          {Article.articleName}
                        </span>
                      </IonLabel>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p
                        onClick={(e) =>
                          Article.articleSourceLink &&
                          InAppBrowser.create(
                            Article.articleSourceLink!,
                            '_blank',
                            'location=yes'
                          )
                        }
                        style={{
                          color: '#9BC9C1',
                          fontSize: '12px',
                          margin: '4px 0',
                        }}
                      >
                        {Article.articleSourceLink}
                      </p>
                    </div>
                  </div>
                </div>
              </IonItem>
              {myProfile && (
                <IonItemOptions>
                  <IonItemOption
                    style={{
                      backgroundColor: '#2F736F',
                    }}
                    onClick={() => {
                      const articleCopy = { ...Article };
                      setSingleNewArticle(articleCopy);
                      setEditMode(true);
                    }}
                  >
                    <IonIcon slot="icon-only" icon={pencilOutline} />
                  </IonItemOption>
                  <IonItemOption
                    style={{
                      backgroundColor: '#9BC9C1',
                    }}
                    onClick={() => {
                      newArticles.splice(index, 1);
                      userService
                        .removeArticle(userId, Article.id)
                        .then((res) => {
                          console.log(res);
                          setNewArticles([...newArticles]);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    <IonIcon slot="icon-only" icon={trashOutline} />
                  </IonItemOption>
                </IonItemOptions>
              )}
            </IonItemSliding>
          ))}
          {myProfile && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                padding: '20px 0',
              }}
            >
              <div
                style={{ display: 'flex', width: '35%', alignItems: 'center' }}
              >
                <div style={{ backgroundColor: '#00D6B6' }}>
                  <IonIcon
                    style={{
                      position: 'relative',
                      top: '1px',
                      color: 'white',
                      width: '17px',
                      height: '17px',
                    }}
                    icon={add}
                  ></IonIcon>
                </div>
                <div
                  id="open-new-article-modal"
                  style={{ textAlign: 'end', paddingLeft: '10px' }}
                >
                  <IonLabel style={{ color: '#00D6B6' }}>
                    <h3>New Article</h3>
                  </IonLabel>
                </div>
              </div>
            </div>
          )}
        </div>
        <IonModal
          isOpen={editMode}
          className="new-article-modal"
          ref={articleModal}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
          trigger="open-new-article-modal"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar
              style={{
                '--background': 'white',
                padding: '10px 5px',
                marginTop: '40px',
              }}
            >
              <IonButtons slot="start">
                <IonButton
                  style={{ '--color': '#9BC9C1' }}
                  onClick={() => articleModal.current?.dismiss()}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle>New Article</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  style={{
                    fontSize: '14px',
                    '--padding-end': '15px',
                    '--padding-start': '15px',
                  }}
                  fill="solid"
                  strong={true}
                  onClick={() => confirm()}
                  disabled={!validate()}
                >
                  Add to List
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList className="deal-list">
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Article Name</IonLabel>
                <IonItem
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={singleNewArticle.articleName}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      if (value !== '' && value !== null) {
                        setValidName(true);
                      } else {
                        setValidName(false);
                      }
                      setSingleNewArticle({
                        ...singleNewArticle,
                        articleName: value,
                      });
                    }}
                    placeholder="Fastest Man"
                  />
                </IonItem>
              </IonItem>
              <IonItem style={{ fontSize: '12px' }} lines="full">
                <IonLabel position="stacked">Source Link</IonLabel>

                <IonItem
                  className={validSourceLink ? '' : ' invalid'}
                  style={{
                    paddingBottom: '20px',
                    width: '90%',
                    fontSize: '12px',
                  }}
                >
                  <IonInput
                    autoCapitalize="on sentence"
                    spellCheck={true}
                    value={singleNewArticle.articleSourceLink}
                    onIonChange={(e) => {
                      const value = e.detail.value!;
                      const target: any = e.target;
                      if (value === '' || value == null) {
                        setSourceLinkEmpty(true);
                      } else {
                        setSourceLinkEmpty(false);
                      }
                      setValidSourceLink(target.nativeInput.validity.valid);
                      setSingleNewArticle({
                        ...singleNewArticle,
                        articleSourceLink: value,
                      });
                    }}
                    type="url"
                    pattern="https?://.+"
                    placeholder="https://www.link.com"
                  />
                </IonItem>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </div>
  );
};

export default ArticlesSection;
