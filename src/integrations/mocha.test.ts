import { string, int } from '../types/primitive/index';
import hold from './index';

describe('Mocha Integration', () => {
    hold('works',
        (x: number, y:number) => x + y === y + x,
    )
    .over(int, int)
});