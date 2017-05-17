import { defaults } from 'lodash';
import {
    Engine,
    integer,
    real,
    hex
} from 'random-js';
import { Arbitrary } from '../../arbitrary';
import { shrinkNumber } from '../../shrink';
import { ulog2 } from '../../utils';

export interface NumberGenOpts {
    min: number,
    max: number
}

const defaultNumberGenOpts = {
    min: -Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
}

/**
 * Take a pair of numbers and returns
 * their smaller size.
 */
function smallerRange(range: {min: number, max: number}): NumberGenOpts {
    return {
        min: ulog2(range.min),
        max: ulog2(range.max)
    };
}

function intGen(opts: NumberGenOpts) {
    const {min, max} = defaults(opts, defaultNumberGenOpts);
    return (engine: Engine) => integer(min, max)(engine);
}

/**
 * Arbitrary Integer
 */
export const int = new Arbitrary({
    gen: intGen,
    genOpts: defaultNumberGenOpts,
    shrinker: shrinkNumber,
    smaller: smallerRange
}).set('name', 'Integer')

/**
 * Arbitrary Positive Integer
 */
export const pint = int
    .choose({min: 0})
    .set('definition', (n: number) => n >= 0)
    .set('name', 'Positive Integer');

/**
 * Arbitrary Negative Integer
 */
export const nint = int
    .choose({max: -1})
    .set('definition', (n: number) => n <= -1)
    .set('name', 'Negative Integer');


/**
 * Arbitrary Nature Number
 */
export const nat = int
    .choose({min: 1})
    .set('definition', (n: number) => n >= 1)
    .set('name', 'Nat');

function numberGen(opts: NumberGenOpts) {
    const {min, max} = defaults(opts, defaultNumberGenOpts);
    return (engine: Engine) => real(min, max, true)(engine);
}

/**
 * Arbitrary Number
 */
export const num = new Arbitrary({
    gen: numberGen,
    genOpts: defaultNumberGenOpts,
}).set('name', 'Number');

/**
 * Arbitrary Positive Number
 */
export const pnum = num
    .choose({min: 0})
    .set('definition', (n:number) => n >= 0)
    .set('name', 'Positive Number');

/**
 * Arbitrary Negative Number
 */
export const nnum = num
    .choose({max: -0.000000001})
    .set('definition', (n:number) => n <= -0.000000001)
    .set('name', 'Negative Number');

export interface HexStringGenOpts {
    upper: boolean,
    length: number
}

const defaultHexStringGenOpts = {
    upper: false,
    length: 6
}

function hexStringGen(opts: HexStringGenOpts) {
    const {upper, length} = defaults(opts, defaultHexStringGenOpts);
    return (engine: Engine) => hex(upper)(engine, length);
}

/**
 * Arbitrary Hex String
 */
export const hexString = new Arbitrary({
    gen: hexStringGen,
    genOpts: defaultHexStringGenOpts
}).set('name', 'Hex String');