/**
 * @module
 */
import { Arbitrary} from '../../arbitrary';
import {pint} from '../primitive/index';
import {elements, object} from '../../combinators';

interface lorempixURLOpts {width: number, height: number, category: string, gray: boolean};

function lorempixURL({width, height, category, gray}: lorempixURLOpts) {
  const grayPrefix = gray ? 'g/' : ''
  return `http://lorempixel.com/${grayPrefix}${width}/${height}/${category}`;
}

const imageCategory = elements([
  'abstract',
  'animals',
  'business',
  'cats',
  'city',
  'food',
  'nightlife',
  'fashion',
  'people',
  'nature',
  'sports',
  'technics',
  'transport'
]);

/**
 * Image URL
 */
const imageURL = object({
  width: 640,
  height: 480,
  category: imageCategory,
  gray: false
}).transform(lorempixURL).set('name', 'Image URL');

/**
 * Gray Image URL
 */
const grayImageURL = imageURL
  .choose({gray: true})
  .set('name', 'Gray Image URL');

export const image = {
  imageURL,
  grayImageURL
}
