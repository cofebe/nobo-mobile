import { useHistory, useParams } from 'react-router-dom';
import './NoboHomeItem.scss';
import { environment } from '../environments/environment';
import { calculateEstPrice } from '../helpers/tradeFees';
import { useState, useEffect } from 'react';

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
  const history = useHistory();
  const params: any = useParams();
  const [isSneaker, setIsSneaker] = useState(false);

  useEffect(() => {
    if (params.sectionCategory === 'sneakers') {
      setIsSneaker(true);
    } else {
      setIsSneaker(false);
    }
  }, [params]);

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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('product', product);
        isSneaker
          ? history.push(`/home/product/sneakers/${product._id}`)
          : history.push(`/home/product/${product._id}`);
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
              src="assets/images/nobo-square-right-black.png"
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
        }icon.svg`}
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
