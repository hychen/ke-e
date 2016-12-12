/**
 * @module
 */
import _ from 'lodash';
import Random from 'random-js';
import assert from 'assert';
import {stdOpts} from './constants';


/**
 * A function to generate a random value.
 * @callback Generator
 * @param {function} engine Random-js engine.
 * @param {?string} locale locale tag.
 * @return {*}
 */

/**
 * A function to generate a function to take a random engine in random-js.
 * to generate a random value.
 *
 * @callback GeneratorMaker
 * @return {Generator}
 */

/**
 * Arguments of a GeneratorMaker.
 * @typedef {Array} GeneratorMakerOptions the options of a generator maker.
 */

/**
 * Arbitrary Options.
 * @typedef {Object} ArbitraryOptions
 * @property {!GeneratorMaker} gen the generator maker.
 * @property {?GeneratorMakerOptions} genOts the options of the generator maker.
 * @property {?function} smaller a function to return small size of genOts.
 * @property {?function} show a function to stringify the generated values.
 * @property {?string} name the name of a arbitrary.
 * @property {?string} locale the locale tag. default is en.
 * @property {?function} engine the random engine.
 * @property {?number} seed the seed number.
 */

/**
 * Random generation and shrinking of values.
 */
class Arbitrary {
  /**
   * Create an arbitrary.
   *
   * @param {!ArbitraryOptions} opts the options of arbitrary creation.
   * @return {Arbitrary}
   */
  constructor(opts) {
    assert(_.isObject(opts), 'opts must be an object.');
    // private attributes initialization.
    this._gen = null;
    this._genOpts = null;
    this._smaller = null;
    this._show = null;
    this._name = null;
    this._locale = null;
    this._engine = null;
    this._seed = null;
    this._transforms = [];

    this.locale(opts.locale || 'en');
    this.engine(opts.engine || stdOpts.engine);
    this.name(opts.name || 'Arbitrary-' + Random.uuid4(this._engine));
    this.gen(opts.gen);
    this.genOpts(opts.genOpts || []);
    this.smaller(opts.smaller || _.identity);
    this.show(opts.show || JSON.stringify);
  }
  /**
   * A random example value of this arbitrary.
   *
   * @return {*}
   * @example
   * ke.int.random
   */
  get random() {
    return this.generate();
  }
  /**
   * Get/Set the name of this arbitrary.
   *
   * @param {?string} name the name of a arbitrary.
   * @return {Arbitrary|string}
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
  /**
   * Get/Set locale.
   *
   * @param {?string} locale locale tag.
   * @return {Arbitrary|string}
   */
  locale(locale) {
    if (locale !== undefined) {
      this._locale = locale;
      return this;
    }
    else {
      return this._locale;
    }
  }
  /**
   * Get/Set a random engine.
   *
   * @param {?funciton} engine random-js engine.
   * @return {Arbitrary|Engine}
   */
  engine(engine) {
    if (engine !== undefined) {
      assert(engine, 'engine is required.');
      this._engine = engine;
      return this;
    }
    else {
      return this._engine;
    }
  }
  /**
   * Get/Set a seed number.
   *
   * @param {?number} seed 32-bit integer.
   * @return {Arbitrary|number}
   */
  seed(seed) {
    if (seed !== undefined) {
      assert(_.isInteger(seed), 'seed must be a 32-bit integer.');
      this._seed = seed;
      this._engine.seed(seed);
      return this;
    }
    else {
      return this._seed;
    }
  }
  /**
   * Get/Set a generator maker.
   *
   * @param {?GeneratorMaker} gen 
   * @return {Arbitrary|GeneratorMaker}
   */
  gen(gen) {
    if (gen !== undefined) {
      assert(_.isFunction(gen), 'gen must be a function.');
      this._gen = gen.bind(this);
      return this;
    }
    else {
      return this._gen;
    }
  }
  /**
   * Get/Set the options of a generator maker.
   *
   * @param {?GeneratorMakerOptions} opts
   * @return {Arbitrary|GeneratorMakerOptions}
   */
  genOpts(genOpts) {
    if (genOpts !== undefined) {
      assert(_.isArray(genOpts), 'opts must be an object.');
      this._genOpts = genOpts;
      return this;
    }
    else {
      return this._genOpts;
    }
  }
  /**
   * Get/set a function to tweak the options of a
   * generator maker.
   *
   * @param {?function} smaller a function to return tewaked
   *                           generator maker options.
   * @return {Arbitrary|function}
   */
  smaller(smaller) {
    if (smaller !== undefined) {
      this._smaller = smaller;
      return this;
    }
    else {
      return this._smaller;
    }
  }
  /**
   * Get/set a function to stringify the generated value.
   *
   * @param {?function} show a function stringify the generated value.
   * @return {Arbitrary|function}
   */
  show(show) {
    if (show !== undefined) {
      this._show = show;
      return this;
    }
    else {
      return this._show;
    }
  }
  /**
   * Clone this arbitrary.
   *
   * @return {Arbitrary}
   */
  clone() {
    return _.cloneDeep(this);
  }
  /**
   * Create a new arbitrary with new
   * inclusive range of its generator maker.
   *
   * @param {...*}
   * @return {Arbitrary}
   */
  choose(...args) {
    const clone = this.clone();
    clone.genOpts(args);
    return clone;
  }
  /**
   * Transform arbitrary A to arbitrary B.
   *
   * @param {function} transform a function takes the
   *                             generated values of this arbitrary.
   * @return {Arbitrary}
   */
  transform(f) {
    assert(_.isFunction(f), 'f must be a function.');
    const clone = this.clone();
    clone._transforms.push(f);
    return clone;
  }
  /**
   * Make a generator.
   *
   * @return {Generator}
   */
  makeGen() {
    return (engine, locale) => {
      return _.flow(this._transforms)(
        this._gen.apply(this, this._genOpts)(engine, locale || 'en'));
    };
  }
  /**
   * Run a generator.
   *
   * @return {*}
   */
  generate() {
    return this.makeGen()(this._engine, this._locale);
  }
  /**
   * Create a promise.
   *
   * @return {Promise}
   */
  promise() {
    return new Promise((resolve, reject) => {
      try {
        const v = this.generate();
        if (_.isFunction(v)) {
          // async callback.
          v(resolve);
        }
        else {
          // pure value.
          resolve(v);
        }
      }
      catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Generate some example values.
   *
   * @param {number} size the size of values.
   * @return {Array<*>}
   */
  sample(size = 30) {
    if (size !== undefined) {
      assert(_.isInteger(size) && size >= 0,
             'size must be a postive integer.');
    }
    return _.range(0, size).map(() => {
      return this.generate();
    });
  }
}

/**
 * Check if it is Arbitrary.
 *
 * @param {*} arb any value.
 * @return {boolean} True if arb is a Arbitrary.
 */
function isArbitrary(arb) {
  return arb instanceof Arbitrary;
}

/**
 * Transform a generator maker to an arbitrary.
 *
 * @param {!GeneratorMaker}
 * @param {?GeneratorMakerOptions}
 */
function fromGenMaker(gen, genOpts)  {
  return new Arbitrary({
    gen: gen,
    genOpts: genOpts
  });
}

export {
  Arbitrary,
  fromGenMaker,
  isArbitrary
};
