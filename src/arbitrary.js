/**
 * @module
 */
import _ from 'lodash';
import Random from 'random-js';
import assert from 'assert';
import {mt19937} from './random';

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
 * @param {GeneratorMakerOptions} genOpts
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
    this._engine = null;
    this._gen = null;
    this._genOpts = null;
    this._transform = _.identity;

    this.engine(opts.engine || mt19937);
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
   * @param {!number} 32-bit integer.
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
   * Transform arbitrary A to arbitrary B.
   *
   * @param {function} transform function.
   * @return {Arbitrary}
   */
  transform(f) {
    let clone = this.clone();
    clone._transform = f;
    return clone;
  }
  /**
   * Make a generator.
   *
   * @return {Generator}
   */
  makeGen() {
    return (engine, genOpts) => {
      return this._transform(
        this._gen.apply(this, genOpts || this._genOpts || [])(engine));
    };
  }
  /**
   * Run a generator.
   *
   * @return {*}
   */
  generate() {
    return this.makeGen()(this._engine, this._genOpts);
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
  fromGenMaker
};
