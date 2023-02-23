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
import { environment } from '../environments/environment';
import { calculateEstPrice } from '../helpers/tradeFees';

interface NoboItemProps {
  children?: React.ReactNode;
  product: any;
  isBig?: boolean;
}

const NoboHomeItem: React.FC<NoboItemProps> = ({
  children,
  product,
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
            {product?.action === 'sell' ? (
              <>
                <div>{'$' + product?.price}</div>
                <div>COST</div>
              </>
            ) : (
              <>
                <div>{calculateEstPrice(product?.price)}</div>
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
          product?.action === 'sell' ? 'buy-' : 'trade-'
        }icon.png`}
        alt="nobo-buy-icon"
      />
      <img
        style={{ height: '100%', width: '100%', borderRadius: 10 }}
        alt="nobo-item"
        src={
          product?.image[0] === '/'
            ? environment.serverUrl + product?.image
            : product?.image
        }
      />
    </div>
  );
};

export default NoboHomeItem;
