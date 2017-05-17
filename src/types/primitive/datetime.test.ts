import { expect } from 'chai';
import { isDate } from 'lodash';
import { date } from './datetime';

describe('Arbitrary Datetime', () => {
    describe('Date', () => {
        it('name is Date', () => {
            expect(date.get('name')).eq('Date');
        });
        it('should return date.', () => {
            const d = date.random;
            return isDate(d);
        });
        it('takes two date for range.', () => {
            const d1 = new Date(1999, 1, 1);
            const d2 = new Date(2000, 3, 22);
            const d3 = date.choose({ start: d1, end: d2 }).random;
            const inRange = () => {
                const t1 = d1.getTime();
                const t2 = d2.getTime();
                const t3 = d3.getTime();
                return t1 <= t3 && t3 <= t2;
            };
            return isDate(d3) && inRange();
        });
    });
});