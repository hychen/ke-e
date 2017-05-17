/**
Produces a (possibly) empty list of all the possible immediate shrinks of the given value.

Most implementations of shrinker should try at least three things:

1. Shrink a term to any of its immediate subterms.
2. Recursively apply shrink to all immediate subterms.
3. Type-specific shrinkings such as replacing a constructor by a simpler constructor.
**/
import { Seq } from './seq';
import { div2 } from './utils';

export type Shrinker<V> = (v: V) => Seq<V | null>;

export function * shrinkNoop() {
    yield null;
}

/**
 * A function to reducing failed examples to their minimal form.
 */
export function * shrinkNumber(x: number): Seq<number> {
    if (x === 0) return null;
    // abs a < abs b
    const less = (a: number, b: number) => {
        if (a >= 0 && b >= 0) return a < b;
        if (a < 0 && b < 0) return a > b;
        if (a >=0 && b < 0) return a + b < 0;
        if (a < 0 && b >= 0) return a + b > 0;
        throw new Error('should not reach here.');
    }
    if (x < 0 && -x > x) yield -x;
    yield 0;
    // find initial gap.
    let i = div2(x);
    let j = i;
    while(less(j, x)) {
        // calculate the value.
        j = x - i;
        // yield the value if it is not itself.
        if (j !== x) yield j;
        // update gap.
        i = div2(i);
    }
}