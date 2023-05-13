import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './NoboHomeItem.scss';
import { environment } from '../environments/environment';
import { calculateEstPrice } from '../helpers/tradeFees';
import { getImageUrl } from '../utils';

interface NoboItemProps {
 children?: React.ReactNode;
 product: any;
 isBig?: boolean;
}

const NoboHomeItem: React.FC<NoboItemProps> = ({ children, product, isBig }) => {
 const history = useHistory();
 const params: any = useParams();
 const [isSneaker, setIsSneaker] = useState(false);
 const [isSneakerTrade, setIsSneakerTrade] = useState(false);

 useEffect(() => {
  if (params.sectionCategory === 'sneakers') {
   setIsSneaker(true);
  } else {
   setIsSneaker(false);
  }
  if (params.sectionName === 'trade' && params.sectionCategory === 'sneakers') {
   setIsSneakerTrade(true);
  } else {
   setIsSneakerTrade(false);
  }
 }, [params]);

 return (
  <div
   className="nobo-home-item"
   style={{
    backgroundImage: getImageUrl(product?.image),
   }}
   onClick={e => {
    e.preventDefault();
    e.stopPropagation();
    console.log('product', product);
    if (isSneakerTrade) {
     history.push(`/home/product/sneakers/trade/${product._id}`);
    } else {
     isSneaker
      ? history.push(`/home/product/sneakers/${product._id}`)
      : history.push(`/home/product/${product._id}`);
    }
   }}
  >
   {isBig ? (
    <div className="nobo-details-card">VIEW DETAILS</div>
   ) : (
    <div className="nobo-details-card-small">
     <div>
      {product?.action === 'sell' ? (
       isSneaker ? (
        <>
         <div>{product?.brand}</div>
         <div>{product?.name}</div>
        </>
       ) : (
        <>
         <div>{'$' + product?.price}</div>
         <div>COST</div>
        </>
       )
      ) : isSneaker ? (
       <>
        <div>{product?.brand}</div>
        <div>{product?.name}</div>
       </>
      ) : (
       <>
        <div>{calculateEstPrice(product?.price)}</div>
        <div>Est. Price</div>
       </>
      )}
     </div>
     <div>
      <img src="assets/images/nobo-square-right-black.png" alt="nobo-square-right" height={16} />
     </div>
    </div>
   )}
   {isSneaker && params.sectionName !== 'explore' && (
    <img
     className="buy-trade-icon"
     src={`assets/images/nobo-${isSneakerTrade ? 'trade-' : 'buy-'}icon.svg`}
     alt="nobo-buy-icon"
    />
   )}
   {!isSneaker && (
    <img
     className="buy-trade-icon"
     src={`assets/images/nobo-${product?.action === 'sell' ? 'buy-' : 'trade-'}icon.svg`}
     alt="nobo-buy-icon"
    />
   )}
  </div>
 );
};

export default NoboHomeItem;
