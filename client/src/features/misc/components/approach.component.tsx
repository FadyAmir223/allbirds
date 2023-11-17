import { Link } from 'react-router-dom';
import approachData from '../data/approach.json';

const Approach = () => {
  return (
    <section className='px-6 py-10 text-gray'>
      <h2 className='text-2xl font-bold mb-4 capitalize sm:text-center md:text-left'>
        the allbirds approach
      </h2>
      <ul className='grid gap-y-8 md:gap-x-8 md:grid-cols-3'>
        {approachData.map((section) => (
          <li key={section.heading} className='max-w-sm sm:mx-auto md:mx-0'>
            <h4 className='font-bold text-lg mb-1'>{section.heading}</h4>
            <p className='text-[11px]'>{section.description}</p>
            <Link
              className='underline text-[11px] relative -top-[6px] capitalize '
              to={section.url}
            >
              learn more
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Approach;
