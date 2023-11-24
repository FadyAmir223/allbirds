export type ProductSignature = {
  handle: string;
  editionId: number;
  size: string;
};

export type PureCartProduct = ProductSignature & {
  name: string;
  price: number;
  salePrice?: number;
  colorName: string;
  image: string;
};

export type CartProduct = PureCartProduct & {
  amount: number;
};
