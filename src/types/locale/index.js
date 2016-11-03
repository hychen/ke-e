/**
 * @module
 */
import {elements} from '../../combinators';
import avaliableLocaleIds from './avaliableLocaleids';

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

export default {
  avaliableLocaleIds,
  localeId
};
