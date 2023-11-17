import { Link } from 'react-router-dom';

import footerData from '@/data/footer.json';

const Footer = () => {
  return (
    <footer className='bg-gray text-silver px-6 py-10'>
      <div className='grid gap-y-8 md:gap-x-8 md:grid-cols-4 mb-6 text-center md:text-start'>
        {footerData.sections.map((section) => (
          <div key={section.heading} className=''>
            <h5 className='text-[13px] tracking-[0.5px] font-bold mb-4 uppercase'>
              {section.heading}
            </h5>
            <ul className=''>
              {section.links.map((link) => (
                <li key={link.url} className='mb-2 text-[9.8px]'>
                  {link?.target ? (
                    <a
                      href={link.url}
                      target={link.target}
                      rel='noopener noreferrer'
                    >
                      {link.text}
                    </a>
                  ) : (
                    <Link to={link.url}>{link.text}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className='text-center text-[10px]'>
        © 2022 Allbirds, Inc. All Rights Reserved.{' '}
        <Link to='/pages/allbirds-terms-of-use'>terms</Link>,{' '}
        <Link to='/pages/privacy-policy'>privacy</Link> &{' '}
        <Link to='/pages/accessability'>accessability</Link>
      </p>
    </footer>
  );
};

export default Footer;
