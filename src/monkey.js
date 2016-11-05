/**
 * @module
 */
import _ from 'lodash';
import {pint} from './types/number';
import {elements} from './combinators';

/**
 * Something to do monkey testing.
 */
class ChaosMonkey {
  constructor(opts = {}) {
    this._seed = opts.seed || pint.generate();
    this.actions = {};
    this._preconds = {};
    this._postconds = {};
    this._speed = opts.speed || 50;
    this._locale = 'en';
  }
  /**
   * Add a behaviour.
   *
   * @param {string} name
   * @param {Arbitrary} action
   */
  behaviour(name, action, opts = {}) {
    this.actions[name] = action;
    this._preconds[name] = opts.precond || _.noop;
    this._postconds[name] = opts.postcond || _.noop;
  }
  /**
   * Do random behaviour.
   */
  doRandomBehaviour() {
    let randomActName = elements(Object.keys(this.actions))
          .seed(this._seed)
          .generate();
    let precond = this._preconds[randomActName];
    let postcond = this._postconds[randomActName];
    let randomAction = this.actions[randomActName]
                         .locale(this._locale)
                         .seed(this._seed);

    precond(this, randomActName); // check pre conditin.
    randomAction.promise()        // do the action.
      .then(postcond)             // check post condition.
      .catch(console.error);
  }
  /**
   * Replay monkey testing by given seed.
   *
   * @return {number} seed 32-bit integer.
   */
  replay(seed) {
    this._seed = seed;
    this.start();
  }
  /**
   * Start running monkey testing.
   *
   * @return {number} interval id.
   */
  start() {
    console.log(`seed: ${this._seed}`);
    let task = () => this.doRandomBehaviour();
    return this.timeId = setInterval(task, this._speed);
  }
  /**
   * Stop running monkey testing.
   */
  stop() {
    clearInterval(this.timeId);
  }
}

export {
  ChaosMonkey
};
