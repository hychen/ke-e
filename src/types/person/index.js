/**
 * @module
 */
import {object, oneOf, constant} from '../../combinators';
import {fromDefinition} from '../../utils';

import definitions from './definitions';
import {date} from '../datetime.js';

const firstName = fromDefinition(definitions, 'firstName').name('First Name');
const lastName = fromDefinition(definitions, 'lastName').name('Last Name');
const gender = fromDefinition(definitions, 'gender').name('Gender');

const name = object({
  firstName: firstName,
  lastName: lastName
}).name('Name');

const person = object({
  name: name,
  gender: gender,
  brithDay: date
}).name('Person');

person.firstName = firstName;
person.lastName = lastName;
person.gender = gender;

export default person;
