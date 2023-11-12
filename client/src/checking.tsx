import { useState } from 'react'

const Checking = () => {
  const [first, setFirst] = useState<number>('var')

  return <h1 className='mr-0'>{first}</h1>
}

export default Checking
