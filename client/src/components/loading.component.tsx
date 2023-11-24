const Loading = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-[100dvh] bg-white grid place-items-center'>
      <img
        src='/images/main-page/favicon.webp'
        alt='favicon'
        className='w-14 animate-[scaling_1.5s_ease-out_infinite]'
      />
    </div>
  );
};

export default Loading;
