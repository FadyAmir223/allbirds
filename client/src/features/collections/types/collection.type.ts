import type { Pagination } from '@/types/pagination.type';
import { type ProductMain, type ProductEdition } from '@/features/products';

export type CollectionEdition = Omit<ProductEdition, 'images'> & {
  image: string;
};

export type CollectionProduct = ProductMain & {
  editions: {
    edition: string;
    products: CollectionEdition[];
  }[];
};

export type Collection = {
  pagination: Pagination;
  products: CollectionProduct[];
};
