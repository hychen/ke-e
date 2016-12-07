/**
 * @module
 */
import repl from 'repl';
import _ from 'lodash';
import ke from './index';

const r = repl.start('> ');
r.context.ke = ke;
r.context.lodash = _;
