import {
  IonAvatar,
  IonCol,
  IonItem,
  IonRow,
} from "@ionic/react";
import { useEffect } from "react";
import "./ExploreListItem.css";

interface ReviewListProps {
  reviewData: any;
}

const ReviewList: React.FC<ReviewListProps> = ({reviewData}) => {
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
      {reviewData.map((review: any, index: any) => (
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
                  src="https://thenobo.sfo3.digitaloceanspaces.com/production/NEjGkBQjeoYMEIxkrBue3.jpeg"
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
                  <p className="feed-list-feed-name" style={{fontSize: '12px'}}>
                    @Noelle_Bonner
                    <br/>
                    <p style={{fontSize: '10px'}}>Date</p>
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
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.90991 0.847861L3.56729 3.43348L0.563373 3.84944C0.0246826 3.92365 -0.191205 4.55443 0.199449 4.91572L2.37272 6.92719L1.8587 9.76863C1.76617 10.2822 2.33571 10.667 2.81272 10.4268L5.5 9.08512L8.18729 10.4268C8.66429 10.665 9.23383 10.2822 9.1413 9.76863L8.62729 6.92719L10.8006 4.91572C11.1912 4.55443 10.9753 3.92365 10.4366 3.84944L7.43271 3.43348L6.09009 0.847861C5.84953 0.38698 5.15252 0.381122 4.90991 0.847861Z" fill="#D6980E"/>
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.90991 0.847861L3.56729 3.43348L0.563373 3.84944C0.0246826 3.92365 -0.191205 4.55443 0.199449 4.91572L2.37272 6.92719L1.8587 9.76863C1.76617 10.2822 2.33571 10.667 2.81272 10.4268L5.5 9.08512L8.18729 10.4268C8.66429 10.665 9.23383 10.2822 9.1413 9.76863L8.62729 6.92719L10.8006 4.91572C11.1912 4.55443 10.9753 3.92365 10.4366 3.84944L7.43271 3.43348L6.09009 0.847861C5.84953 0.38698 5.15252 0.381122 4.90991 0.847861Z" fill="#D6980E"/>
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.90991 0.847861L3.56729 3.43348L0.563373 3.84944C0.0246826 3.92365 -0.191205 4.55443 0.199449 4.91572L2.37272 6.92719L1.8587 9.76863C1.76617 10.2822 2.33571 10.667 2.81272 10.4268L5.5 9.08512L8.18729 10.4268C8.66429 10.665 9.23383 10.2822 9.1413 9.76863L8.62729 6.92719L10.8006 4.91572C11.1912 4.55443 10.9753 3.92365 10.4366 3.84944L7.43271 3.43348L6.09009 0.847861C5.84953 0.38698 5.15252 0.381122 4.90991 0.847861Z" fill="#D6980E"/>
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.90991 0.847861L3.56729 3.43348L0.563373 3.84944C0.0246826 3.92365 -0.191205 4.55443 0.199449 4.91572L2.37272 6.92719L1.8587 9.76863C1.76617 10.2822 2.33571 10.667 2.81272 10.4268L5.5 9.08512L8.18729 10.4268C8.66429 10.665 9.23383 10.2822 9.1413 9.76863L8.62729 6.92719L10.8006 4.91572C11.1912 4.55443 10.9753 3.92365 10.4366 3.84944L7.43271 3.43348L6.09009 0.847861C5.84953 0.38698 5.15252 0.381122 4.90991 0.847861Z" fill="#D6980E"/>
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.90991 0.847861L3.56729 3.43348L0.563373 3.84944C0.0246826 3.92365 -0.191205 4.55443 0.199449 4.91572L2.37272 6.92719L1.8587 9.76863C1.76617 10.2822 2.33571 10.667 2.81272 10.4268L5.5 9.08512L8.18729 10.4268C8.66429 10.665 9.23383 10.2822 9.1413 9.76863L8.62729 6.92719L10.8006 4.91572C11.1912 4.55443 10.9753 3.92365 10.4366 3.84944L7.43271 3.43348L6.09009 0.847861C5.84953 0.38698 5.15252 0.381122 4.90991 0.847861Z" fill="#D6980E"/>
                        </svg>
                      </p>
                    </span>
                  )}
                </h2>
              </div>
            </IonCol>
          </IonRow>
        </IonItem>
      ))}
      {reviewData.length === 0 && (
        <div style={{backgroundColor: '#fefcf6', height: '10vh', width: '100%', textAlign: 'center'}}>
          <h5 style={{backgroundColor: '#fefcf6', color: '#ACACAC'}}>Profile has not received any reviews.</h5>
        </div>
      )}
      </div>
    );
};

export default ReviewList;
