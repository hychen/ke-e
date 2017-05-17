/**
 * A generator to simulate Lazy-Seq
 *
 * @FIXME: use real lazy seq.
 */
export type Seq<ValueT> = IterableIterator<ValueT>;

export function * fold(f: Function, seq: Seq<any>, acc?: any) {
    let v = seq.next();
    while(!v.done) {
        yield f(v.value, acc);
        v = seq.next();
    };
}

export function * filter(f:Function, seq: Seq<any>) {
    let v = seq.next();
    while(!v.done) {
        if (f(v.value))
            yield v.value;
        v = seq.next();
    }
}

export function * map(f: Function, seq: Seq<any>) {
    return fold(f, seq);
}

export function take(seq: Seq<any>, n: number) {
    const result = [];
    let i = 1;
    let v = seq.next();
    while(i <= n && !v.done) {
        result.push(v.value);
        v = seq.next();
        i++;
    }
    return result;
}

export function * fromArray(arr: any[]) {
    for(let i = 0; i < arr.length; i++) {
        yield arr[i];
    }
}

export function toArray(seq: Seq<any>) {
    return take(seq, Infinity);
};