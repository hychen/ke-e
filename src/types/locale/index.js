/**
 * @module
 */
import {elements} from '../../combinators';
import avaliableLocaleIds from './avaliableLocaleids';

const localeId = elements(avaliableLocaleIds).name('Locale Id');

export default {
  avaliableLocaleIds,
  localeId
};
