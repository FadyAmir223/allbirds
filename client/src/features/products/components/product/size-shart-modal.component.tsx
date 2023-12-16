import BottomDrawer from '@/components/bottom-drawer.component'
import sizeChartData from '../../data/size-chart.json'
import type { ModalProps } from '../../types/modal.type'

const SizeChartModal = (props: ModalProps) => {
  return (
    <BottomDrawer {...props}>
      <h3 className='mb-4 text-3xl font-bold'>Allbirds Size Chart</h3>
      <p className='mb-5'>
        Allbirds fit true to size for most customers. If you have wide feet or
        are between sizes, we suggest you size up for all styles except our
        Plant Pacer (size down for those).
      </p>
      <p className='mb-5'>
        Did you know that our shoes are actually unisex? You can easily cross
        over to find shoes in your size.
      </p>
      <p className='mb-5 font-[500]'>Here’s how it works:</p>
      <p className='mb-5'>
        If you wear a men’s size 7, try a women’s size 8 or 9.
      </p>
      <p className='mb-7'>
        If you wear a women’s size 12, try a men’s size 10 or 11.
      </p>

      <ul>
        {sizeChartData.map(({ gender, fields }) => (
          <li key={gender} className='mb-12 last-of-type:mb-0'>
            <h5 className='mb-3 text-[16px] font-[500] uppercase tracking-[1.5px]'>
              {gender} shoes
            </h5>

            <table className='hidden border-separate border-spacing-[3px] md:block'>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.region}>
                    <th className='min-w-[75px] bg-gray p-4 text-center text-white'>
                      {field.region}
                    </th>
                    {field.sizes.map((size) => (
                      <td
                        key={size}
                        className='min-w-[75px] p-4 text-center text-black odd:bg-tBodyOdd even:bg-tBodyEven'
                      >
                        {size}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <table className='block border-separate border-spacing-[3px] md:hidden'>
              <thead>
                <tr>
                  {fields.map(({ region }) => (
                    <th
                      key={region}
                      className='min-w-[75px] bg-gray p-4 text-center text-white'
                    >
                      {region}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: fields[0].sizes.length }).map(
                  (_, sizeIdx) => (
                    <tr
                      key={sizeIdx}
                      className='min-w-[75px] text-center text-black odd:bg-tBodyEven even:bg-tBodyOdd'
                    >
                      {fields.map((field) => (
                        <td key={field.region} className='p-4'>
                          {field.sizes[sizeIdx]}
                        </td>
                      ))}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </li>
        ))}
      </ul>
    </BottomDrawer>
  )
}

export default SizeChartModal
