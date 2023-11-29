import BottomDrawer from '@/components/bottom-drawer.component';
import sizeChartData from '../data/size-chart.json';
import type { ModalProps } from '../types/modal.type';

const SizeChartModal = (props: ModalProps) => {
  return (
    <BottomDrawer {...props}>
      <h3 className='text-3xl font-bold mb-4'>Allbirds Size Chart</h3>
      <p className='mb-5'>
        Allbirds fit true to size for most customers. If you have wide feet or
        are between sizes, we suggest you size up for all styles except our
        Plant Pacer (size down for those).
      </p>
      <p className='mb-5'>
        Did you know that our shoes are actually unisex? You can easily cross
        over to find shoes in your size.
      </p>
      <p className='font-semibold mb-5'>Here’s how it works:</p>
      <p className='mb-5'>
        If you wear a men’s size 7, try a women’s size 8 or 9.
      </p>
      <p className='mb-7'>
        If you wear a women’s size 12, try a men’s size 10 or 11.
      </p>

      <ul className=''>
        {sizeChartData.map(({ gender, fields }) => (
          <li key={gender} className='mb-12 last-of-type:mb-0'>
            <h5 className='uppercase tracking-[1.5px] mb-3 font-semibold text-[16px]'>
              {gender} shoes
            </h5>

            <table className='border-separate border-spacing-[3px]'>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.region}>
                    <th className='p-4 min-w-[75px] text-center bg-gray text-white'>
                      {field.region}
                    </th>
                    {field.sizes.map((size) => (
                      <td
                        key={size}
                        className='p-4 min-w-[75px] text-center text-black even:bg-tBodyEven odd:bg-tBodyOdd'
                      >
                        {size}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
        ))}
      </ul>
    </BottomDrawer>
  );
};

export default SizeChartModal;
