import BottomDrawer from '@/components/bottom-drawer.component';
import type { ModalProps } from '../types/modal.type';

const GetNotifiedModal = (props: ModalProps) => {
  return (
    <div className=''>
      <BottomDrawer {...props} className='w-3/4 h-3/4 p-4'>
        hello
      </BottomDrawer>
    </div>
  );
};

export default GetNotifiedModal;
