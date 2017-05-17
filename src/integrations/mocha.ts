import { ok } from 'assert';
import { stdOpts } from '../constants';
import {
    Predicate,
    property,
    safeCheck,
    formatCheckResult
} from '../property';

function mochaTestIt(name: string, pf: Predicate) {
    const test = {
        over: function (...qs: any[]) {
            it(name, async function () {
                const r = await safeCheck(property(pf, ...qs), stdOpts);
                ok(r.ok, formatCheckResult(r));
            });
            return test;
        }
    };
    return test;
}

export function hold(name: string, predicate: Predicate) {
    return mochaTestIt(name, predicate);
}