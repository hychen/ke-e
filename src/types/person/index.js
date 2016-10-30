/**
 * @module
 */
import {fromDefinition} from '../../utils';

import definitions from './definitions';

const firstName = fromDefinition(definitions, 'firstName');

export default {
  firstName
};
