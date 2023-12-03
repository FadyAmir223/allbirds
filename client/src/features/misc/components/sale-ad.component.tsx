import LinkCustom from '@/components/link-custom.component'
import heroLinks from '../data/men-women-url.json'

type SaleAdProps = {
  imgUrl: string
  imgUrlMobile: string
  imgAlt?: string
  headerText: string
  paragraphText: string
  links?: {
    text: string
    url: string
  }[]
}

const SaleAd = ({
  imgUrl,
  imgAlt,
  headerText,
  paragraphText,
  imgUrlMobile,
  links = heroLinks,
}: SaleAdProps) => {
  return (
    <section>
      <img
        src={imgUrl}
        alt={imgAlt}
        className='hidden h-[83dvh] w-full object-cover md:block'
      />

      <img
        src={imgUrlMobile}
        alt={imgAlt}
        className='h-64 w-full object-cover md:hidden'
      />

      <div className='mx-auto mb-14 mt-8 max-w-lg text-center text-gray'>
        <h4 className='text-2xl font-bold capitalize md:text-[26px]'>
          {headerText}
        </h4>
        <p className='mb-7 mt-2 text-[12px] tracking-[0.8px] md:text-[12px]'>
          {paragraphText}
        </p>

        <div className='mx-auto flex w-[310px] justify-center gap-5'>
          {links.map((heroLink) => (
            <LinkCustom
              key={heroLink.text}
              to={heroLink.url}
              className='w-full py-[10px]'
            >
              {heroLink.text}
            </LinkCustom>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SaleAd
