import {
  IonAvatar,
  IonCol,
  IonItem,
  IonRow,
} from "@ionic/react";
import { useEffect } from "react";
import "./ReviewList.scss";
import { environment } from '../environments/environment';

interface ReviewListProps {
  reviewData: any;
}

const ReviewList: React.FC<ReviewListProps> = ({reviewData}) => {
  let rating = 5;

  function renderStars(rating: number) {
    const stars = [];

    for (let i = 0; i < rating; i++) {
      stars.push(<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.90991 0.847861L3.56729 3.43348L0.563373 3.84944C0.0246826 3.92365 -0.191205 4.55443 0.199449 4.91572L2.37272 6.92719L1.8587 9.76863C1.76617 10.2822 2.33571 10.667 2.81272 10.4268L5.5 9.08512L8.18729 10.4268C8.66429 10.665 9.23383 10.2822 9.1413 9.76863L8.62729 6.92719L10.8006 4.91572C11.1912 4.55443 10.9753 3.92365 10.4366 3.84944L7.43271 3.43348L6.09009 0.847861C5.84953 0.38698 5.15252 0.381122 4.90991 0.847861Z" fill="#D6980E"/>
                  </svg>);
    }

    return stars;
  }

  function formatDate(timestamp: any) {
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return formatter.format(date);
  }

  return (
    <div>
    {reviewData.map((review: any, index: any) => (
        <IonRow
          className="review-row  ion-text-wrap"
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
              <h2 className="review-nobo-badge-line">
                <p className="feed-list-feed-name" style={{fontSize: '12px', marginTop: '5px'}}>
                  <p className="review-buyer-display-name">@{review.buyer.displayName}</p>
                  <p className="review-buyer-text">{review.reviewText}</p>
                  <img src={environment.serverUrl + review.product.images[0].url}/>
                  <p className="review-date">{formatDate(review.createdAt)}</p>
                </p>
              </h2>
            </div>
          </IonCol>
          <IonCol
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            className="explore-feed-first-row feed-content-center feed-content-right"
            size="4"
          >
            <div className="review-rating">
                {renderStars(review.ratingNum)}
            </div>
          </IonCol>
        </IonRow>
    ))}
    {reviewData.length === 0 && (
      <div className="review-none-container">
        <h5 className="review-none-text">Profile has not received any reviews.</h5>
      </div>
    )}
    </div>
  );
};

export default ReviewList;
