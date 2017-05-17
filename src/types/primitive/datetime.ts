import { date as randomDate } from 'random-js';
import { Arbitrary } from '../../arbitrary';

/**
 * Options of dateGen
 */
export type DateGenOpts = {
    start: Date,
    end: Date
}

/**
 * Date Generator Maker.
 */
function dateGen({start, end}: DateGenOpts) {
    return randomDate(start, end);
};

/**
 * Default Options of Date Generator Maker.
 */
const defaultDateGenOpts: DateGenOpts = {
    start: new Date(1984, 3, 25),
    end: new Date()
}

/**
 * Date Arbitrary
 */
export const date = new Arbitrary({
    gen: dateGen,
    genOpts: defaultDateGenOpts
}).set('name', 'Date');