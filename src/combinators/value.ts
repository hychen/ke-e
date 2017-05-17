let RandExp = require('randexp');
import { integer } from 'random-js';
import { Arbitrary } from '../arbitrary';
import { oneOf } from './pickers';

/**
 * Generates a constant value.
 */
export function constant(value: any) {
    return new Arbitrary({
        gen: () => () => value
    }).set('name', 'Constant');
}

/**
 * Options of RegexGenOpts
 */
export type RegexGenOpts = {
    ignoreCase: boolean,
    multiline: boolean
}

/**
 * Produces regex.
 * @XXX: get rid of randexp.
 */
export function regex(pattern: string) {
    return new Arbitrary({
        gen: function (opts: RegexGenOpts) {
            return function (engine) {
                const m = [];
                if (opts.ignoreCase) m.push('i');
                if (opts.multiline) m.push('m');
                const randexp = new RandExp(pattern, m.join());
                randexp.randInt = (from: number, to: number) => {
                    return integer(from, to)(engine);
                }
                return randexp.gen();
            }
        },
        genOpts: {
            ignoreCase: false,
            multiline: false
        }
    })
}

/**
 * An arbitrary returns a value or null.
 */
export function maybe(arb: Arbitrary<any, any>) {
    return oneOf([arb, constant(null)]).set('name', 'Maybe');
}