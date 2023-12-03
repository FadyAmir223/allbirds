import { ProductDetailed } from '../..'

type MaterialFeaturesProps = {
  materialFeatures: ProductDetailed['product']['materialFeatures']
}

const MaterialFeatures = ({ materialFeatures }: MaterialFeaturesProps) => {
  return (
    <section className='my-28'>
      {materialFeatures.map((materialFeature) => (
        <div
          key={materialFeature._id}
          className='mb-16 flex flex-col gap-x-6 last-of-type:mb-0 md:mb-28 md:flex-row md:items-center md:even:flex-row-reverse lg:mb-36'
        >
          <img
            src={materialFeature.image}
            alt=''
            className='mb-5 md:mb-0 md:w-3/5'
          />
          <div className='md:w-2/5'>
            <h4 className='text-sm font-bold uppercase tracking-[1px] md:text-base'>
              {materialFeature.text.h4}
            </h4>
            <h2 className='mb-5 mt-2 text-2xl font-bold capitalize tracking-[2px] md:mb-6 md:mt-3 md:text-3xl'>
              {materialFeature.text.h2}
            </h2>
            <p className='text-[14px] md:max-w-sm md:text-base'>
              {materialFeature.text.p}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default MaterialFeatures
