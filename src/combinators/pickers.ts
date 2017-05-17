import { Arbitrary } from '../arbitrary';
import { sum } from 'lodash';
import { Engine, integer, picker } from 'random-js';

/**
 * Generates one of the given values. The input list must be non-empty.
 */
export function elements(pool: any[]) {
    return new Arbitrary({
        gen: (opts: any[]) =>
            (engine:Engine) =>
                picker(opts || pool)(engine),
        genOpts: pool
    }).set('name', 'Elements');
}

/**
 * Options Of OneOf Gen.
 */
export type oneOfGenOpts = Arbitrary<any, any>[];

/**
 * Randomly uses one of the given generators. The input list must be non-empty.
 */
export function oneOf(arbs: oneOfGenOpts) {
    return elements(arbs).transform(
        (result , engine, locale) =>
            result.makeGenerator()(engine, locale)
    ).set('name', 'OneOf');
}

export type FrequencyGenOpts = Array<[number, any]>;

/**
 * Choose one of the given arbitrary(s), with a weighted random distribution.
 * The input list must be non-empty.
 */
export function frequency(pool: FrequencyGenOpts) {
    return new Arbitrary({
        gen: function (pool: FrequencyGenOpts) {
            return function (engine, locale) {
                function pick(n: number, [[k, x], ...xs]): any {
                    return (n <= k) ? x : pick(n - k, xs);
                }
                const total = sum(pool.map(e => e[0]));
                const head = integer(1, total)(engine);
                const result = pick(head, pool);
                if (result instanceof Arbitrary) {
                    return result.makeGenerator()(engine, locale);
                }
                else {
                    return result;
                };
            };
        },
        genOpts: pool
    }).set('name', 'Frequency');
}