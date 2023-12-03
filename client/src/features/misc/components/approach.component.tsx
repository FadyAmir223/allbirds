import { Link } from 'react-router-dom'

import approachData from '../data/approach.json'

export const Approach = () => {
  return (
    <section className='px-6 py-10 text-gray'>
      <h2 className='mb-4 text-2xl font-bold capitalize sm:text-center md:text-left'>
        the allbirds approach
      </h2>
      <ul className='grid gap-y-8 md:grid-cols-3 md:gap-x-8'>
        {approachData.map((section) => (
          <li key={section.heading} className='max-w-sm sm:mx-auto md:mx-0'>
            <h4 className='mb-1 text-lg font-bold'>{section.heading}</h4>
            <p className='text-[11px]'>{section.description}</p>
            <Link
              className='relative -top-[6px] text-[11px] capitalize underline '
              to={section.url}
            >
              learn more
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
