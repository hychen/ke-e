import { integer} from 'random-js';
import { Arbitrary } from '../arbitrary';
import { ulog2 } from '../utils';
import { any } from '../types/primitive/any';

export type RecursiveGenOpts<V, O> = {
    combinator: Function,
    arb: Arbitrary<V, O>
    depth: number
}

/**
 * Produce a nested values.
 */
export function recursive<V, O>(
    combinator: Function,
    arb: Arbitrary<V, O>,
    depth: number
) {
    return new Arbitrary({
        gen: function ({ combinator, arb, depth }: RecursiveGenOpts<V, O>) {
            return function (engine, locale) {
                function rec(n: number): Arbitrary<V, RecursiveGenOpts<V, O>> {
                    const chance = integer(0, 3)(engine);
                    if (n <= 0 || chance === 0) {
                        return n === depth ? combinator(arb) : arb;
                    }
                    else {
                        return combinator(rec(n - 1));
                    }
                };
                return rec(depth).makeGenerator()(engine, locale);
            };
        },
        genOpts: { combinator: combinator, arb: arb, depth: 4 }
    }).set('name', 'Recursive');
}

/**
 * Options of ArrayGen
 */
export type ArrayGenOpts = {
    min: number,
    max: number
};

/**
 * Generates an array of random length.
 */
export function array<V>(arb?: Arbitrary<V, any>): Arbitrary<any[], ArrayGenOpts> {
    return new Arbitrary({
        gen: function ({ min, max }: ArrayGenOpts) {
            return function (engine, locale) {
                const n = integer(min, max)(engine);
                return [...new Array(n).keys()].map(() => {
                    const chosenArb = arb ? arb : recursive(array, any, 2);
                    return chosenArb.makeGenerator()(engine, locale);
                });
            };
        },
        genOpts: { min: 0, max: 30 },
        smaller: function (opts: ArrayGenOpts): ArrayGenOpts {
            return { min: ulog2(opts.min), max: ulog2(opts.max) };
        }
    }).set('name', 'Array');
}

/**
 *
 * Generates an non-empty array.
 */
export function nearray<V>(arb: Arbitrary<V, any>) {
    return array(arb).choose({ min: 1 }).set('name', 'Non-Empty Array');
};

/**
 * Generate a ordered array.
 */
export function sequence(...arbs: any[]) {
    return new Arbitrary({
        gen: function (pool: any[]) {
            return function (engine, locale) {
                return pool.map(arb => {
                    return arb instanceof Arbitrary
                        ? arb.makeGenerator()(engine, locale)
                        : arb;
                });
            }
        }
        ,
        genOpts: arbs,
    }).set('name', 'Sequence');
}

/**
 * Produces an object.
 */
export function object(spec: { [key: string]: any }) {
    return new Arbitrary({
        gen: function (opts: { [key: string]: any }) {
            return function (engine, locale) {
                const o: { [key: string]: any } = {};
                Object.keys(opts).forEach(k => {
                    const arbOrValue = opts[k];
                    if (arbOrValue instanceof Arbitrary) {
                        o[k] = arbOrValue.makeGenerator()(engine, locale);
                    }
                    else {
                        o[k] = arbOrValue;
                    }
                });
                return o;
            };
        },
        genOpts: spec
    }).set('name', 'Object');
}