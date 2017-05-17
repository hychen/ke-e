/**
 * @module
 */
import { Arbitrary } from '../../arbitrary';
import { elements } from '../../combinators';
import avaliableLocaleIds from './avaliableLocaleids';
import timeZone from './timeZone';
import _country from './country';

/**
 * Available Locale Ids in Unicode Common Locale Data Repository.
 *
 * @example
 * // returns zh-Hant-TW
 * ke.locale.localeids.generate();
 */
const localeId = elements(avaliableLocaleIds).set('name', 'Locale Id');

/**
 * Time Zone
 */
const timezone = elements(timeZone).set('name', 'Time Zone');

/**
 * Country
 */
const country = elements(_country).set('name', 'Country');

export const locale = {
  avaliableLocaleIds,
  localeId,
  country,
  timezone
};
