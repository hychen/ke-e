/**
 * @module
 */
import _ from 'lodash';
import {fromGenMaker} from './arbitrary';
import {elements} from './combinators';
import avaliableLocaleIds from './types/locale/avaliableLocaleids.js';

/**
 * Merge namespace
 *
 * @param {!Object} namespace
 * @param {!string} name
 * @returns {Object}
 */
export function liftExport(namespace, name) {
  _.forOwn(namespace[name], (v, k) => {
    namespace[k] = v;
  });
  return namespace;
}

/**
 * Get a definietion.
 *
 * @param {Object} definietions
 * @param {string} locale
 * @param {string} key
 * @return {Object}
 */
export function getDef(defs, locale, key) {
  if (avaliableLocaleIds.indexOf(locale) < 0) {
    throw new Error(`Locale ${locale} is not supported`);
  }
  let _locale = locale.replace(/-/g, '_');
  let _def = defs[_locale];
  if (_def) {
    return _def[key];
  }
  else {
    return defs['en'][key];
  }
}

/**
 * Create an arbitrary from a definition.
 *
 * @param {Object }definietions
 * @param {string} name
 * @return {Arbitary}
 */
export function fromDefinition(definitions, name) {
  return fromGenMaker(function() {
    return function(engine, locale) {
      let pool = getDef(definitions, locale, name);
      return elements(pool).engine(engine).generate();
    };
  });
}
