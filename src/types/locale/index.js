/**
 * @module
 */
import {elements} from '../../combinators';
import avaliableLocaleIds from './avaliableLocaleids';
import timeZone from './timeZone';
import _country from './country';

/**
 * Avaliable Locale Ids in Unicode Common Locale Data Repository.
 *
 * @type {Arbitrary}
 *
 * @example
 * // returns zh-Hant-TW
 * ke.locale.localeids.generate(); 
 */
const localeId = elements(avaliableLocaleIds).name('Locale Id');

/**
 * Time Zone
 *
 * @type {Arbitrary}
 */
const timezone = elements(timeZone).name('Time Zone');

/**
 * Country
 *
 * @type {Arbitrary}
 */
const country = elements(_country).name('Country');

export default {
  avaliableLocaleIds,
  localeId,
  country,
  timezone
};
