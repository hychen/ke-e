/**
 * @module
 */
import _ from 'lodash';
import Random from 'random-js';
import assert from 'assert';
import {stdOpts} from './constants';

/**
 * A function to generate a function to take a random engine in random-js.
 * to generate a random value.
 *
 * @callback GeneratorMaker
 * @param {Engine} engine - engines provided in random-js.
 *                          The default is mt19937 with auto seeds.
 * @return {*}
 */

/**
 * Arguments of a GeneratorMaker.
 * @typedef {Array} GeneratorMakerOptions
 */

/**
 * Arbitrary Options.
 * @typedef {Object} ArbitraryOptions
 * @property {GeneratorMaker} gen
 * @property {GeneratorMakerOptions} opts
 */

/**
 * A function to generate a random value.
 * @callback Generator
 * @param {Engine} engine
 * @param {string} locale
 * @return {*}
 */

/**
 * Random generation and shrinking of values.
 */
class Arbitrary {
  /**
   * Create a arbitrary.
   *
   * @param {!ArbitraryOptions} opts the options of arbitrary creation.
   * @return {Arbitrary}
   */
  constructor(opts) {
    assert(_.isObject(opts), 'opts must be an object.');
    this._locale = 'en';
    this._engine = null;
    this._gen = null;
    this._genOpts = null;
    this._transforms = [_.identity];

    this.engine(opts.engine || stdOpts.engine);
    this.name(opts.name || 'Arbitrary-' + Random.uuid4(this._engine));
    this.generator(opts.gen, opts.genOpts);
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
    let clone = this.clone();
    clone._genOpts = args;
    return clone;
  }
  /**
   * Create a new arbitrary with new locale.
   *
   * @param {!string} locale locale tag.
   * @return {Arbitrary}
   */
  locale(locale) {
    let clone = this.clone();
    clone._locale = locale;
    return clone;
  }
  /**
   * Transform arbitrary A to arbitrary B.
   *
   * @param {function} transform function.
   * @return {Arbitrary}
   */
  transform(f) {
    let clone = this.clone();
    clone._transforms.push(f);
    return clone;
  }
  /**
   * Name this arbitrary.
   *
   * @param {string} name arbitrary name.
   * @return {Arbitrary}
   */
  name(name) {
    if (name) {
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
   * Set a random engine.
   *
   * @param {!Engine} engine
   * @return {Arbitrary}
   */
  engine(engine) {
    assert(engine, 'engine is required.');
    this._engine = engine;
    return this;
  }
  /**
   * Set a seed number.
   *
   * @param {!number} seed 32-bit integer.
   */
  seed(seed) {
    this._engine.seed(seed);
    return this;
  }
  /**
   * Set a random value generator.
   *
   * @param {!GeneratorMaker} gen
   * @param {?GeneratorMakerOptions} opts
   * @return {Arbitrary}
   */
  generator(gen, opts) {
    assert(_.isFunction(gen), 'gen must be a function.');
    this._gen = gen.bind(this);
    if (opts) {
      assert(_.isArray(opts), 'opts must be an object.');
      this._genOpts = opts;
    }
    return this;
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
   * Generate some example values.
   *
   * @param {number} size
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
