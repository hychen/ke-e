/**
 * @module
 */
import {object} from '../../combinators';
import {number} from '../primitive';

/**
 * latitude
 *
 * @type {Arbitrary}
 * @example
 * // returns 19.4984.
 * ke.geo.latitude.random
 */
const latitude = number.choose(0, 180 * 10000)
  .transform(n => (n / 10000.0 - 90.0).toFixed(4));

/**
 * longtitude
 *
 * @type {Arbitrary}
 * @example
 * // returns 132.9634.
 * ke.geo.longtitude.random
 */
const longtitude = number.choose(0, 360 * 10000)
  .transform(n => (n / 10000.0 - 180.0).toFixed(4));

/**
 * coordinate
 *
 * @type {Arbitrary}
 * @example
 * // returns 19.4984, 132.9634.
 * ke.geo.coordinate.random
 */
const coordinate = object({
  latitude: latitude,
  longtitude: longtitude
}).transform(c => `${c.latitude}, ${c.longtitude}`)
  .name('Coordinate');

export default {
  latitude,
  longtitude,
  coordinate
}
