/**
 * @module
 */
import {object, oneOf, constant} from '../../combinators';
import {fromDefinition} from '../../utils';
import {date} from '../datetime.js';

import definitions from './definitions';

/**
 * Arbitrary to generate the first name of a person.
 *
 * @type {Arbitrary}
 * @example
 * // returns Jack.
 * ke.person.firstName.generate();
 */
const firstName = fromDefinition(definitions, 'firstName').name('First Name');

/**
 * Arbitrary to generate the last name of a person.
 *
 * @type {Arbitrary}
 * @example
 * // returns Hand.
 * ke.person.lastName.generate();
 */
const lastName = fromDefinition(definitions, 'lastName').name('Last Name');

/**
 * Aribitrary to generate the name of a person.
 *
 * @type {Arbitrary}
 * @example
 * ke.person.name.generate();
 */
const name = object({
  firstName: firstName,
  lastName: lastName
}).name('Name');

/**
 * Arbitrary to generate the gender of a person.
 *
 * @type {Arbitrary}
 * @example
 * ke.person.gender.generate;
 */
const gender = fromDefinition(definitions, 'gender').name('Gender');

/**
 * Arbitrary to generate a person (alive, dead, undead, or fictional).
 *
 * @type {Arbitrary}
 * @example
 * // generate a object include person name, gender and birthday.
 * ke.person.generate();
 */
const person = object({
  name: name,
  gender: gender,
  brithDay: date
}).name('Person');

person.firstName = firstName;
person.lastName = lastName;
person.gender = gender;

export default person;
