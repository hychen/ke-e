/**
 * @module
 */
import _ from 'lodash';
import {object,
        oneOf} from './combinators';

function valid(arb) {
  return arb.genOpts()[0][0];
}

function invalid(arb) {
  return arb.genOpts()[0][1];
}

class TestData {
  /**
   * @param {Object} spec a record to define variants of dataset.
   * @example
   * new ke.TestData([ke.variant(ke.int, ke.bool)]);
   */
  constructor(spec) {
    this._spec = spec;
  }
  /**
   * @type {*} random
   * @example
   * new ke.TestData([ke.variant(ke.int, ke.bool)]).random;
   */
  get random() {
    return object(this._spec).random;
  }
  /**
   * Make an arbitrary to produce all valid cases.
   *
   * @return {Arbitrary}
   */
  allValid() {
    return object(_.mapValues(this._spec, valid)).name('AllValid');
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
    const newSpec = _.transform(this._spec, (acc, v, k) => {
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
    Object.keys(this._spec).forEach((propName) => {
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
