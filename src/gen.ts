import { Engine, uuid4 } from 'random-js';

/**
 * A function to produce a random value.
 */
export type Generator<ValueT> = (engine: Engine, locale?: string) => ValueT;

/**
 * A function to produce a Generator.
 */
export type Gen<ValueT, GenOptsT> = (genOpts?: GenOptsT) => Generator<ValueT>;

export function mkGen<V, O>(generator: Generator<V>) {
    return (opts: O) => generator;
}

/**
 * A function to transform produced value.
 */
export type ValueTransform<FromValueT, TargetValueT>
    = (v: FromValueT, engine: Engine, locale: string) => TargetValueT;

/**
 * A function to transform Gen A to Gen B.
 */
export type GenTransform<FromValueT, FromGenOptsT, TargetValueT, TargetGenOptsT>
    = (gen: Gen<FromValueT, FromGenOptsT>) =>
        Gen<TargetValueT, TargetGenOptsT>

/**
 * A function to transform GenOpts A to GenOpts B.
 */
export type GenOptsTransform<FromGenOptsT, TargetGenOptsT>
    = (genOpts: FromGenOptsT | null) => TargetGenOptsT;

/**
 * Promote a pure function as GenTransform.
 */
export function promote<FV, FO, TV>(
    f: ValueTransform<FV, TV>
): GenTransform<FV, FO, TV, FO> {
    return (gen: Gen<FV, FO>) => {
        return (genOpts: FO) => {
            return (engine: Engine, locale: string) => {
                return f(gen(genOpts)(engine, locale), engine, locale);
            };
        };
    };
}

/**
 * A function to test a value.
 */
export type ValuePredication<V> = (v: V) => boolean;

/**
 * Transform predicate function as SuchThatGenTransform.
 */
export function suchThat<FV, FO>(
    predicate: ValuePredication<FV>
): GenTransform<FV, FO, FV, FO> {
    return gen => (opts: FO) => {
        return (engine: Engine, locale: string) => {
            let x;
            let j = 0;
            for (let i = 0; ; i++) {
                j++;
                if (i > 5) {
                    i = 0;
                }
                x = gen(opts)(engine, locale);
                if (j > 5000) {
                    throw new Error('cant not find value in this range');
                }
                if (predicate(x)) {
                    break;
                }
            }
            return x;
        };
    };
}