import BottomDrawer from '@/components/bottom-drawer.component';

type AddToCartProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const AddToCart = (props: AddToCartProps) => {
  return <BottomDrawer {...props}>AddToCart</BottomDrawer>;
};

export default AddToCart;
