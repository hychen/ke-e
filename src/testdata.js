/**
 * @module
 */
import assert from 'assert';
import _ from 'lodash';
import {object,
        oneOf} from './combinators';

function valid(arb) {
  return arb.genOpts()[0][0];
}

function invalid(arb) {
  return arb.genOpts()[0][1];
}

/**
 * Test Data Options.
 * @typedef {Object} TestDataOptions
 * @property {string} name the name of a test dataset.
 * @property {Object} variants
 */

/**
 * A record to represent a data set.
 */
class TestData {
  /**
   * @param {TestDataOptions} opts the options of a test dataset.
   */
  constructor(opts) {
    assert(_.isObject(opts), 'opts must be an object.');
    this._name = opts.name;
    this._variants = opts.variants;
  }
  /**
   * Get/Set the name of a test dataset.
   *
   * @param {string} name the name of a dataset.
   * @return {TestData|string}
   */
  name(name) {
    if (name !== undefined) {
      assert(_.isString(name) && name.length >= 3,
             'name must be a sring of length >= 3.');
      this._name = name;
      return this;
    }
    else {
      return this._name;
    }
  }
  get random() {
    return object(this._variants).random;
  }
  /**
   * Make an arbitrary to produce all valid cases.
   *
   * @return {Arbitrary}
   */
  allValid() {
    return object(_.mapValues(this._variants, valid)).name('AllValid');
  }
  /**
   * Make an arbitrary to produce all invalid cases.
   *
   * @return {Arbitrary}
   */
  allInvalid() {
    return this.invalid();
  }
  /**
   * Make an arbitrary to produce partial invalid cases.
   *
   * @param {string} propName a property name is the spec.
   * @return {Arbitrary}
   */
  invalid(propName) {
    const name = propName === undefined ? 'AllInvalid' : `Invalid_${propName}`;
    const newSpec = _.transform(this._variants, (acc, v, k) => {
      const f = (propName === undefined || propName === k)
              ? invalid
              : valid;
      return acc[k] = f(v);
    }, {});
    return object(newSpec).name(name);
  }
  /**
   * Produce samples in each cases.
   *
   * @param {number} size the size of produced data of each cases.
   * @return {Object}
   */
  sample(size = 200) {
    const result = {};
    Object.keys(this._variants).forEach((propName) => {
      const arb = this.invalid(propName);
      result[arb.name()] = arb.sample(size);
    });
    result['AllValid'] = this.allValid().sample(size);
    return result;
  }
}

export {
  TestData
}
