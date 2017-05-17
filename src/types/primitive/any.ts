import { bool } from './boolean';
import { falsy } from './falsy';
import { int, num } from './number';
import { Arbitrary } from '../../arbitrary';
import { oneOf } from '../../combinators/pickers';

/**
 * Arbitrary Any Primitive Type
 */
export const any = oneOf([
  bool, falsy, int, num
]).set('name', 'Any');