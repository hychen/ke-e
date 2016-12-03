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
  const _locale = locale.replace(/-/g, '_');
  const _def = defs[_locale];
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
 * @return {Arbitrary}
 */
export function fromDefinition(definitions, name) {
  return fromGenMaker(function() {
    return function(engine, locale) {
      const pool = getDef(definitions, locale, name);
      return elements(pool).engine(engine).generate();
    };
  });
}

/**
 * @param {!number} n
 * @return {number}
 */
export function ulog2(n) {
  if (n === 0 ) return 0;
  const x = n < 0 ? Math.abs(n) : n;
  const xprime = Math.log2(x);
  const xprimeprime = _.isInteger(n) ? Math.floor(xprime) : xprime;
  return n < 0 ? -xprimeprime : xprimeprime;
}

/**
 * Take a pair of numbers and returns
 * theire smaller size.
 *
 * @param {!Array<number, number>} range
 * @return {Array<number, number>}
 */
export function smallerRange(range) {
  return [
    ulog2(range[0]),
    ulog2(range[1])
  ];
}
