import { Predicate } from '../property';
import { hold as mochaHold } from './mocha';

export default function hold(name: string, predicate: Predicate) {
    // running with mocha;
    if (typeof it !== 'undefined') {
        return mochaHold.apply(null, arguments);
    }
    else {
        throw new Error('Oops!');
    }
}