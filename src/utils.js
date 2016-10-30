/**
 * @module
 */
import _ from 'lodash';
import {fromGenMaker} from './arbitrary';
import {elements} from './combinators';

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
  let _def = defs[_locale];
  return _def[key];
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
