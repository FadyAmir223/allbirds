import { useLoaderData, useParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';

import { productQuery, productReviewsQuery } from '../services/product.query';
import { type ProductDetailed, type Reviews } from '..';

const Product = () => {
  const params = useParams();
  const productName = params.productName as string;

  const [initProduct, initReviews] = useLoaderData() as [
    ProductDetailed,
    Reviews,
  ];

  const [{ data: product }, { data: reviews }] = useQueries({
    queries: [
      { ...productQuery(productName), initialData: initProduct },
      {
        ...productReviewsQuery({ name: productName }),
        initialData: initReviews,
      },
    ],
  });

  console.log({ product, reviews });

  return <main>{productName}</main>;
};

export default Product;
