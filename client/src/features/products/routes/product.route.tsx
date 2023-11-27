import { useLoaderData } from 'react-router-dom';

import ProductDetails from '../components/product-details.component';
import { type ProductDetailed, type Reviews } from '..';

const Product = () => {
  const [initProduct, initReviews] = useLoaderData() as [
    ProductDetailed,
    Reviews,
  ];

  return (
    <main className=''>
      <ProductDetails initProduct={initProduct} initReviews={initReviews} />
    </main>
  );
};

export default Product;
