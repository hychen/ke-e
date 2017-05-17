import { Engine } from 'random-js';
import { Arbitrary } from '../arbitrary';
import { oneOf } from './pickers';
import { array } from './collections';
import { bool, any } from '../types/primitive/index';

/**
 * Produce a function.
 */
export function func(out = oneOf([any, array()])) {
    return new Arbitrary({
        gen: (arb: Arbitrary<any, any>) => (engine, locale) => {
            return function () {
                return arb.makeGenerator()(engine, locale);
            }
        },
        genOpts: out
    }).set('name', 'Function');
}

/**
 * Produce a TypeScript Generator.
 */
export function genfunc(out = oneOf([any, array()])) {
    return new Arbitrary({
        gen: (arb: Arbitrary<any, any>) => (engine, locale) => {
            return function* () {
                yield arb.makeGenerator()(engine, locale);
            }
        },
        genOpts: out
    }).set('name', 'Generator Function');
}

export type PromiseGenOpts = {
    data: any,
    error: any,
    failrate: number
};

function promiseGen(opts: PromiseGenOpts) {
    return function (engine: Engine, locale: string) {
        return new Promise(function (resolve, reject) {
            const fail = bool.choose(opts.failrate).makeGenerator()(engine, locale);
            return fail ? reject(opts.error) : resolve(opts.data);
        });
    }
}

/**
 * Produces a Promise.
 */
export function promise<V, O>(data: Arbitrary<V, O>, error?: any) {
    return new Arbitrary({
        gen: promiseGen,
        genOpts: {
            data: data,
            error: error || 'promiseFail',
            failrate: 50
        }
    }).set('name', 'Promise');
}