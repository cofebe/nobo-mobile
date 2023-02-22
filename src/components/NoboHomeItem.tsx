import { useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonRow,
  IonToolbar,
  IonPage,
  IonContent,
  IonItem,
} from '@ionic/react';
import './NoboHomeItem.scss';

interface NoboItemProps {
  children?: React.ReactNode;
  tradeOrBuy: string;
  price: string;
  image: string;
  isBig?: boolean;
}

const NoboHomeItem: React.FC<NoboItemProps> = ({
  children,
  tradeOrBuy,
  price,
  image,
  isBig,
}) => {
  return (
    <div
      className="nobo-home-item"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      {isBig ? (
        <div className="nobo-details-card">VIEW DETAILS</div>
      ) : (
        <div className="nobo-details-card-small">
          <div>
            {tradeOrBuy === 'buy' ? (
              <>
                <div>{price}</div>
                <div>COST</div>
              </>
            ) : (
              <>
                <div>{price}</div>
                <div>Est. Price</div>
              </>
            )}
          </div>
          <div>
            <img
              src="assets/images/nobo-square-right.png"
              alt="nobo-square-right"
              height={16}
            />
          </div>
        </div>
      )}
      <img
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          height: '28px',
        }}
        src={`assets/images/nobo-${
          tradeOrBuy === 'buy' ? 'buy-' : 'trade-'
        }icon.png`}
        alt="nobo-buy-icon"
      />
      <img
        style={{ height: '100%', width: '100%', borderRadius: 10 }}
        alt="nobo-item"
        src={image}
      />
    </div>
  );
};

export default NoboHomeItem;
