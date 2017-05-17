import { Arbitrary} from '../arbitrary';
import { sequence } from './collections';

/**
 * Produces an instance of class C.
 */
export function impl([constructor, ...args]: any[]) {
    return sequence(...args)
        .transform(args => new constructor(...args))
        .set('name', 'Impl');
}

/**
 * Produces an value of function with given arguments.
 */
export function call(fn: Function, ...args: any[]) {
    return sequence(...args)
        .transform(args => fn(...args))
        .set('name', 'Call');
}