import LinkCustom from '@/components/link-custom.component';
import heroLinks from '../data/men-women-url.json';

type SaleAdProps = {
  imgUrl: string;
  imgUrlMobile: string;
  imgAlt?: string;
  headerText: string;
  paragraphText: string;
  links?: {
    text: string;
    url: string;
  }[];
};

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
        className='h-[83dvh] w-full object-cover hidden md:block'
      />

      <img
        src={imgUrlMobile}
        alt={imgAlt}
        className='h-64 w-full object-cover md:hidden'
      />

      <div className='text-gray text-center mt-8 mb-14 max-w-lg mx-auto'>
        <h4 className='capitalize font-bold text-2xl md:text-[26px]'>
          {headerText}
        </h4>
        <p className='text-[12px] md:text-[12px] mt-2 mb-7 tracking-[0.8px]'>
          {paragraphText}
        </p>

        <div className='flex gap-5 justify-center w-[310px] mx-auto'>
          {links.map((heroLink) => (
            <LinkCustom
              key={heroLink.text}
              to={heroLink.url}
              className='w-full py-[10px]'
              hover
              type='invert'
            >
              {heroLink.text}
            </LinkCustom>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SaleAd;
