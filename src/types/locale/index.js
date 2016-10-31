/**
 * @module
 */
import {elements} from '../../combinators';
import avaliableLocaleIds from './avaliableLocaleids';

/**
 * Avaliable Locale Ids in Unicode Common Locale Data Repository.
 *
 * @type {Arbitary}
 *
 * @example
 * // returns zh-Hant-TW
 * hc.locale.localeids.generate(); 
 */
const localeId = elements(avaliableLocaleIds).name('Locale Id');

export default {
  avaliableLocaleIds,
  localeId
};
