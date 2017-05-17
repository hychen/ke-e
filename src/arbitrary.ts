/**
 * Random generation and shrinking of values.
 */
import { cloneDeep, get, defaults } from 'lodash';
import { Engine, uuid4 } from 'random-js';
import { stdOpts } from './constants';
import { Chainable } from './traits';
import * as seq from './seq';
import {
    Gen,
    Generator,
    GenOptsTransform,
    GenTransform,
    ValueTransform,
    ValuePredication,
    promote,
    suchThat
} from './gen';
import {
    Shrinker,
    shrinkNoop
} from './shrink';

export type Sampler<V> = (count: number) => V[];

/**
 * Options of an Arbitrary.
 */
export interface ArbitraryOptions<ValueT, GenOptsT> {
    attrs?: {
        engine?: Engine;
        name?: string;
        locale?: string;
    }
    gen: Gen<ValueT, GenOptsT>;
    genOpts?: GenOptsT;
    shrinker?: Shrinker<ValueT>;
    smaller?: GenOptsTransform<GenOptsT, GenOptsT> | null;
}

/**
 * Attributes of an Arbitrary.
 */
export interface ArbitraryAttributes {
    engine: Engine;
    name: string;
    locale: string;
    definition: (v: any) => boolean;
}

/**
 * Random generation and shrinking of values.
 *
 * Type Variable:
 * - V : The type of produced value of this arbitrary.
 * - O : The type of options of Gen of this arbitrary.
 * - TV : The type of transformed value.
 * - TO : The type of transformed options.
 */
export class Arbitrary<V, O> extends Chainable<ArbitraryAttributes> {
    readonly gen: Gen<V, O>;
    readonly genOpts: O | null;
    readonly shrinker: Shrinker<V>;
    readonly smaller: GenOptsTransform<O, O> | null;
    /**
     * Create an Arbitrary
     */
    constructor(opts: ArbitraryOptions<V, O>) {
        super();
        /**
         *  Put all attributes need to be protected in `attrs`.
         */
        this.attrs = defaults(opts.attrs, {
            engine: stdOpts.engine,
            name: uuid4(get(opts, 'attrs.engine') || stdOpts.engine),
            locale: stdOpts.locale,
            definition: () => true
        });
        /**
         * The following attributes are immutable and can only be changed via
         * transform methods that always returns a new arbitrary.
         */
        this.gen = opts.gen.bind(this);
        this.genOpts = opts.genOpts || null;
        this.shrinker = opts.shrinker || shrinkNoop;
        this.smaller = opts.smaller || null;
    }
    /**
     * Clone this arbitrary.
     */
    clone() {
        return cloneDeep(this);
    }
    /**
     * Create an Arbitrary with new locale.
     */
    locale(locale: string) {
        return this.clone().set('locale', locale);
    }
    get random() {
        return this.generate();
    }
    /**
     * Run a Generator to produce a value.
     */
    generate(): V {
        return this.makeGenerator()(this.attrs.engine, this.attrs.locale);
    }
    /**
     * Make a Generator.
     */
    makeGenerator(): Generator<V> {
        if (this.genOpts) {
            return this.gen(this.genOpts);
        } else {
            return this.gen();
        }
    }
    /**
     * Create a sampler for a given arbitrary with an optional size.
     */
    makeSampler(): Sampler<V> {
        return (count = 10) => {
            const acc = [];
            for (let i = 0; i < count; i++) {
                acc.push(this.random);
            }
            return acc;
        }
    }
    /**
     * Create an arbitrary with smaller range.
     */
    get small() {
        return this.smaller ? this.transformWith(null, this.smaller, null) : this;
    }
    /**
     * Create a new arbitrary with new
     * inclusive range of its generator maker.
     */
    choose(genOpts: Partial<O>): Arbitrary<V, O> {
        return this.transformWith(null, (oriGenOpts) => defaults(genOpts, oriGenOpts), null);
    }
    /**
     * Generates a value that satisfies a predicate.
     */
    suchThat(predicate: ValuePredication<V>): Arbitrary<V, O> {
        return this.transformWith(suchThat(predicate), null, null);
    }
    /**
     * Transform Arbitrary A to Arbitrary B with value transform only.
     * @param f A function to transform produced value.
     */
    transform<TV, TO>(f: ValueTransform<V, TV>): Arbitrary<TV, O> {
        return this.transformWith<TV, O>(promote<V, O | TO, TV>(f), null, null);
    }
    /**
     * Transform Arbitrary A to Arbitrary B.
     * @param f A function to transform produced value.
     * @param g A function to transform options of Gen.
     * @param s A function transform shrinker.
     */
    transformWith<TV, TO>(
        f: GenTransform<V, O, TV, TO> | null,
        g: GenOptsTransform<O, TO> | null,
        s: Function | null
    ): Arbitrary<any, any> {
        return new Arbitrary<any, any>({
            attrs: cloneDeep(this.attrs),
            gen: f ? f(this.gen) : this.gen,
            genOpts: g ? g(this.genOpts) : this.genOpts,
            shrinker: s ? s(this.shrinker) : s,
            smaller: this.smaller
        });
    }
    /**
     * Shrinks the value.
     */
    shrink(v: V): seq.Seq<V> {
        return seq.filter(this.attrs.definition, this.shrinker(v));
    }
}