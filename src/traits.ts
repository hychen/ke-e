export type Source = {[key: string]: any};

export class Chainable<T> {
    protected attrs: T & {[key: string]: any};
    get(k: string) {
        return this.attrs[k];
    }
    /**
     * Set a private attribute.
     */
    set(k: string, v: any): this {
        this.attrs[k] = v;
        return this;
    }
    /**
     * like Object.assign.
     */
    assign(source: Source): Source {
        return Object.assign(this, source);
    };
}