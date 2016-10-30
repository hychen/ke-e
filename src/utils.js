/**
 * @module
 */
import _ from 'lodash';

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
  let _locale = locale.replace(/-/g, '_');
  let _def = defs[_locale]
  return _def[key];
}
