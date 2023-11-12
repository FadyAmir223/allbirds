const Loading = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-screen bg-gray grid place-items-center'>
      <img
        src='/images/main-page/favicon.webp'
        alt='favicon'
        className='w-14 animate-[scaling_1.8s_linear_infinite]'
      />
    </div>
  );
};

export default Loading;
