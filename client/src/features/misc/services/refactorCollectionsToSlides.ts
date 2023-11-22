import * as _ from 'lodash-es';

import { Collection } from '@/features/collections';
import { type SectionDesktop } from '../components/slider.component';

export const refactorCollectionsToSlides = (
  collections: Collection[],
): SectionDesktop[] => {
  const productsFlat = collections.flatMap(({ products }) =>
    products.slice(0, 5).map((product) => {
      const edition = product.editions[0].products[0];
      const description = `${edition.colorName.split(' (')[0]}, Now: $${
        product.price
      }`;

      return {
        imgUrl: edition.image,
        title: product.name,
        description,
        url: 'collections/' + product.handle,
      };
    }),
  );

  const productsShuffle = _.shuffle(productsFlat);
  const productsSlides = [{ items: productsShuffle }];

  return productsSlides;
};
