import { useParams } from 'react-router-dom';

const Product = () => {
  const { productName } = useParams();
  return <div>{productName}</div>;
};

export default Product;
