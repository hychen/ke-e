import { Arbitrary} from '../../arbitrary';
import {object, oneOf, constant} from '../../combinators';
import {date} from '../primitive/datetime';
import {Definitions} from '../../definition';

import defsdata  from './definitions/index';
const defs = new Definitions(defsdata);

/**
 * Arbitrary to generate the first name of a person.
 * @example
 * // returns Jack.
 * ke.person.firstName.generate();
 */
const firstName = defs.arbitrary('firstName').set('name', 'First Name');

/**
 * Arbitrary to generate the last name of a person.
 * @example
 * // returns Hand.
 * ke.person.lastName.generate();
 */
const lastName = defs.arbitrary('lastName').set('name', 'Last Name');

/**
 * Arbitrary to generate the name of a person.
 * @example
 * ke.person.name.generate();
 */
const name = object({
  firstName: firstName,
  lastName: lastName
}).transform(defs.formatter('name'))
.set('name', 'Name');

/**
 * Arbitrary to generate the gender of a person.
 * @example
 * ke.person.gender.generate;
 */
const gender = defs.arbitrary('gender').set('name', 'Gender');

/**
 * Arbitrary to generate a person (alive, dead, undead, or fictional).
 * @example
 * // generate a object include person name, gender and birthday.
 * ke.person.generate();
 */
export const person = object({
  name: name,
  gender: gender,
  birthDay: date
}).set('name', 'Person').assign({
  name,
  firstName,
  lastName,
  gender
});