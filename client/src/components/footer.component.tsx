import { Link } from 'react-router-dom'
import { usePWAInstall } from 'react-use-pwa-install'
import footerData from '@/data/footer.json'

const Footer = () => {
  const install = usePWAInstall()

  return (
    <footer className='bg-gray px-6 py-10 text-silver'>
      <nav className='mb-6 grid gap-y-8 text-center md:grid-cols-4 md:gap-x-8 md:text-start'>
        {footerData.sections.map((section) => (
          <div key={section.heading}>
            <h5 className='mb-4 text-[13px] font-bold uppercase tracking-[0.5px]'>
              {section.heading}
            </h5>
            <ul>
              {section.links.map((link) =>
                link.url ? (
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
                ) : (
                  install && (
                    <li key={link.text} className='mb-2 text-[9.8px]'>
                      {<button onClick={install}>{link.text}</button>}
                    </li>
                  )
                ),
              )}
            </ul>
          </div>
        ))}
      </nav>
      <p className='text-center text-[10px]'>
        © 2022 Allbirds, Inc. All Rights Reserved.{' '}
        <Link to='/pages/allbirds-terms-of-use'>terms</Link>,{' '}
        <Link to='/pages/privacy-policy'>privacy</Link> &{' '}
        <Link to='/pages/accessability'>accessability</Link>
      </p>
    </footer>
  )
}

export default Footer
