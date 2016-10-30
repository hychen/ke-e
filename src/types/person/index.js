/**
 * @module
 */
import {object} from '../../combinators';
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

export default {
  firstName,
  lastName,
  name,
  gender
};
