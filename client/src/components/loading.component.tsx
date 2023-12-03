const Loading = () => {
  return (
    <div className='absolute left-0 top-0 grid h-[100dvh] w-full place-items-center bg-white'>
      <img
        src='/images/main-page/favicon.webp'
        alt='favicon'
        className='w-14 animate-[scaling_1.5s_ease-out_infinite]'
      />
    </div>
  )
}

export default Loading
