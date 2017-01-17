/**
 * @module
 */
import {pint} from '../primitive';
import {elements, object} from '../../combinators';

function lorempixURL({width, height, category, gray}) {
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
 *
 * @type {Arbitrary} imageURL
 */
const imageURL = object({
  width: 640,
  height: 480,
  category: imageCategory,
  gray: false
}).transform(lorempixURL).name("Image URL");

/**
 * Gray Image URL
 *
 * @type {Arbitrary} grayImageURL
 */
const grayImageURL = imageURL.choose({gray: true}).name('Gray Image URL');

export default {
  imageURL,
  grayImageURL
}
