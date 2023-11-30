import { ProductDetailed } from '../..';

type MaterialFeaturesProps = {
  materialFeatures: ProductDetailed['product']['materialFeatures'];
};

const MaterialFeatures = ({ materialFeatures }: MaterialFeaturesProps) => {
  return (
    <section className='my-28'>
      {materialFeatures.map((materialFeature) => (
        <div
          key={materialFeature._id}
          className='flex md:items-center gap-x-6 mb-16 md:mb-28 lg:mb-36 last-of-type:mb-0 md:even:flex-row-reverse flex-col md:flex-row'
        >
          <img
            src={materialFeature.image}
            alt=''
            className='md:w-3/5 mb-5 md:mb-0'
          />
          <div className='md:w-2/5'>
            <h4 className='uppercase text-sm md:text-base font-bold tracking-[1px]'>
              {materialFeature.text.h4}
            </h4>
            <h2 className='capitalize font-bold tracking-[2px] text-2xl md:text-3xl mt-2 mb-5 md:mt-3 md:mb-6'>
              {materialFeature.text.h2}
            </h2>
            <p className='md:max-w-sm text-[14px] md:text-base'>
              {materialFeature.text.p}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MaterialFeatures;
