import {
IonAvatar,
IonCol,
IonContent,
IonItem,
IonRow,
useIonViewDidEnter } from "@ionic/react";
import { useState, useEffect } from "react";
import "./ProductList.css";
import { useHistory } from "react-router-dom";
import { UserService } from "../services/UserService";
import { Products, Product } from "../data/products";

interface ReviewListProps {
  reviewData: any;
}


const ReviewList: React.FC<ReviewListProps> = ({reviewData}) => {
  const history = useHistory();
  const userService = new UserService();
  const [products, setProducts] = useState<Products>();

  useIonViewDidEnter(() => {
    load();
  })

  let rating = 5;

  function load() {
    // userService
    //   .getProducts("1", type)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("ProductList: ", data)
    //     setProducts(data)
    //   })
  }

  useEffect(() => {
    load()
  }, [])

    return (
      <div>
      {reviewData.map((review, index) => (
      <IonItem lines="none" className="explore-list-item" detail={false}>
        <IonRow
          className="explore-list-item-content ion-text-wrap"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <IonCol size="2">
            <IonAvatar className="explore-feed-first-row">
              <img
                className="explore-list-feed-image"
                alt="avatar"
              />
            </IonAvatar>
          </IonCol>
          <IonCol
            className="explore-feed-first-row explore-feed-content feed-content-center"
            size="6"
          >
            <div
              style={{
                maxWidth: '176px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <h2 className="feed-list-nobo-badge-line">
                <p className="feed-list-feed-name">
                  Test
                </p>
              </h2>
            </div>
          </IonCol>
          <IonCol
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            className="explore-feed-first-row feed-content-center feed-content-right"
            size="4"
          >
            <div style={{ width: '80%' }}>
              <h2 className="feed-list-nobo-badge-line">
                {rating > 0 && (
                  <span className="feed-list-feed-ranking">
                    <p className="feed-list-feed-ranking-text">
                      {rating}
                      <svg
                        width="20"
                        height="12"
                        viewBox="0 -2 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.52447 1.46353C5.67415 1.00287 6.32585 1.00287 6.47553 1.46353L7.23483 3.80041C7.30176 4.00642 7.49374 4.1459 7.71036 4.1459H10.1675C10.6519 4.1459 10.8532 4.76571 10.4614 5.05041L8.47352 6.49468C8.29828 6.622 8.22495 6.84768 8.29188 7.0537L9.05118 9.39058C9.20086 9.85123 8.67362 10.2343 8.28176 9.94959L6.29389 8.50532C6.11865 8.378 5.88135 8.378 5.70611 8.50532L3.71824 9.94959C3.32638 10.2343 2.79914 9.85123 2.94882 9.39058L3.70812 7.0537C3.77505 6.84768 3.70172 6.622 3.52648 6.49468L1.53861 5.05041C1.14675 4.76571 1.34814 4.1459 1.8325 4.1459H4.28964C4.50626 4.1459 4.69824 4.00642 4.76517 3.80041L5.52447 1.46353Z"
                          fill="#00D6B6"
                        />
                      </svg>
                    </p>
                  </span>
                )}
              </h2>
            </div>
          </IonCol>
        </IonRow>
      </IonItem>
    );
};

export default ReviewList;
