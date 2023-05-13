import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ProductCard.scss';
import { Product } from '../models';
import { getImageUrl, formatPrice } from '../utils';

interface ProductCardProps {
 product: Product;
 priceLabel?: string;
 onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priceLabel, onClick }) => {
 const history = useHistory();
 const [price, setPrice] = useState<string>('');

 //console.log('ProductCard:', product);

 useEffect(() => {
  setPrice(formatPrice(product.price));
 }, [product]);

 function click() {
  if (onClick) {
   onClick(product);
  } else {
   const isSneaker = false;
   if (isSneaker) {
    history.push(`/home/product/sneakers/${product._id}`);
   } else {
    history.push(`/home/product/${product._id}`);
   }
  }
 }

 return (
  <div
   className="product-card"
   onClick={e => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.sold) {
     click();
    }
   }}
  >
   <div className="image-container" style={{ backgroundImage: getImageUrl(product.image) }}></div>
   <p>
    {product.attributes
     .filter((item: any) => item.id === 'size')
     .map((item: any) => {
      return (
       <span key={item.id}>
        Size <br />
        {item.value}
       </span>
      );
     })}
   </p>
   <div className="text-container">
    <div className="brand">{product.brand}</div>
    <div className="name">{product.name}</div>
    <div className="price">
     <span>{priceLabel}</span> {price}
    </div>
   </div>
   {product.sold && (
    <div className="sold-overlay">
     <div className="text">Sold</div>
    </div>
   )}
  </div>
 );
};

export default ProductCard;
