import { Arbitrary } from '../../arbitrary';
import { elements } from '../../combinators/pickers';

/**
 * falsy values.
 */
export const FALSY_VALUES = [
  undefined,
  void(0),
  null,
  false,
  0,
  ''
];

/**
 * Falsy Arbitrary
 *
 * generates falsy values: false, null, undefined, '',
 * 0, void(0) and NaN.
 */
export const falsy = elements(FALSY_VALUES).set('name', 'Falsy');
