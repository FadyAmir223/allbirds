const Loading = () => {
  return (
    <div className='fixed inset-0 z-[100] grid place-items-center bg-white'>
      <img
        src='/images/main-page/favicon.webp'
        alt='favicon'
        className='w-14 animate-[scaling_1.5s_ease-out_infinite]'
      />
    </div>
  )
}

export default Loading
