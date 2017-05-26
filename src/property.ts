import { every } from 'lodash';
import { Engine } from 'random-js';
import { stdOpts, CheckOptions } from './constants';
import { Arbitrary } from './arbitrary';
import { Shrinker } from './shrink';

/**
 *  A result of property test.
 */
export interface TestResult {
    // The result of test.
    ok: boolean,
    // The input samples.
    samples: any[]
    // the exception thrown, if any.
    theException: Error | null,
}

/**
 * Succeed Result.
 */
function succeed(samples: any[]): TestResult {
    return {
        ok: true,
        samples: samples,
        theException: null
    };
}

/**
 * Failed Result.
 */
function failed(samples: any[], error = null): TestResult {
    return {
        ok: false,
        samples: samples,
        theException: error
    }
}

/**
 * A predicate takes an entity or entities in the domain of discourse as input
 * and outputs either True or False.
 */
export type Predicate = Function;

/**
 * A property is a promise like Generator, but generate a
 * test result.
 */
export type Property = (engine: Engine, locale: string) => Promise<TestResult>;

/**
 * Apply a predicate to an given samples.
 */
export async function apply(predicate: Function, samples: any[]): Promise<TestResult> {
    return new Promise<TestResult>((resolve, reject) => {
        try {
            const r = predicate.apply(null, samples);
            resolve(r ? succeed(samples) : failed(samples));
        } catch (error) {
            resolve(failed(samples, error));
        }
    });
}

/**
 * Check Result.
 */
export interface CheckResult {
    ok: boolean,
    tests: number,
    pass: number,
    samples: any[] | null,
    theException: Error | null,
    seed: number
}

/**
 * Check the property.
 */
export async function check(property: Property, opts: CheckOptions) {
    const result = await safeCheck(property, opts);
    return opts.format ? formatCheckResult(result) : result;
}

export async function safeCheck(property: Property, opts: CheckOptions) {
    opts.engine.seed(opts.seed);
    // Run a property to catch an exception as
    // easier as possible.
    const safe = await property(opts.engine, opts.locale);
    return safe.ok ? await checkWith(property, opts) : {
        ok: false,
        tests: 1,
        pass: 0,
        samples: safe.samples,
        theException: safe.theException,
        seed: opts.seed
    };
}

export async function checkWith(property: Property,  opts: CheckOptions) {
    const tests = [];
    for (let i = 0; i < opts.tests; i++) {
        tests.push(property(opts.engine, opts.locale));
    }
    const results = await Promise.all(tests);
    const total = results.length;
    let pass = 0;
    for(let i = 0; i < total; i++) {
        if (results[i].ok) {
            pass += 1
        }
    }
    let samples = null;
    if (total !== pass) {
        const r = results.find(r => !r.ok);
        if (!!r) {
            samples = r.samples;
        }
    }
    return {
        ok: total === pass,
        tests: total,
        pass: pass,
        samples: samples,
        theException: null,
        seed: opts.seed
    };
}

/**
 * Format the results.
 */
export function formatCheckResult(result: CheckResult): string {
    const msg = [];
    msg.push(result.ok ? '+ Ok' : '+ Fail');
    msg.push(', ');
    msg.push(`pass ${result.pass} tests`);
    msg.push(', ');
    msg.push(`seed: ${result.seed}`);
    msg.push(`, `);
    msg.push(`samples: ${result.samples}`);
    msg.push('\n');
    if (result.theException) {
        msg.push(result.theException.stack);
    }
    return msg.join('');
}

/**
 * Create a property.
 */
export function property(
    predicate: Predicate,
    ...quantifiers: Arbitrary<any, any>[]) {
        return new ForAll(quantifiers).predicate(predicate).makeProperty();
};

/**
 * Constructor a ForAll.
 */
export function forAll(...arbs: Arbitrary<any, any>[]) {
    return new ForAll(arbs);
};

/**
 * The thing which can be tested,
 */
export class ForAll {
    _predicate: Predicate;
    quantifiers: Arbitrary<any, any>[];
    /**
     * Make a Prop.
     */
    constructor(quantifiers: Arbitrary<any, any>[]) {
        this.quantifiers = quantifiers;
    }
    /**
     * Set predicate.
     */
    predicate(pf: Predicate) {
        if (pf.length !== this.quantifiers.length) {
            throw new Error('quantifiers parameter do not match signature of predicate');
        }
        this._predicate = pf;
        return this;
    }
    /**
     * Generate sample values.
     */
    makeSamples(engine: Engine, locale: string): any[] {
        const samples = this.quantifiers.map(
            q => q.makeGenerator()(engine, locale)
        );
        return samples;
    }
    /**
     * Convert the thing to a property.
     */
    makeProperty(): Property {
        return async (engine, locale) => {
            return await apply(this._predicate, this.makeSamples(engine, locale));
        };
    }
    /**
     * Evaluate the function with quantifiers.
     */
    eval(f: Function, opts = stdOpts) {
        return f.apply(null, this.makeSamples(opts.engine, opts.locale));
    }
    /**
     * Check this property.
     */
    check(opts = stdOpts) {
        check(this.makeProperty(), opts).then(console.log).catch(console.error);
    }
}