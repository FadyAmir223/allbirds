type CartProps = {
  sidebar: boolean;
  handleSidebar: () => void;
};

const Cart = ({ sidebar, handleSidebar }: CartProps) => {
  return (
    <>
      <button
        className={`absolute top-0 left-0 w-full h-screen duration-[400ms] bg-black opacity-0 ${
          sidebar ? 'opacity-30' : 'pointer-events-none'
        }`}
        onClick={handleSidebar}
      />

      <div
        className={`p-6 bg-white shadow-lg fixed h-screen w-96 top-0 right-0 duration-[400ms] delay-200 ${
          sidebar ? 'right-0' : 'right-[-384px]'
        }`}
      >
        <div className="">sidebar</div>
      </div>
    </>
  );
};

export default Cart;
