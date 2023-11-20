export type Collection = {
  pagination: {
    total: number;
    page: number;
    perPage: number;
  };
  products: Product[];
};

export type Product = {
  _id: string;
  handle: string;
  name: string;
  price: number;
  sizes: string[];
  editions: {
    edition: string;
    products: EditionProduct[];
  }[];
};

export type EditionProduct = {
  id: number;
  colorName: string;
  colors: string[];
  hues: string[];
  sizesSoldOut: string[];
  image: string;
  salePrice?: number;
};
