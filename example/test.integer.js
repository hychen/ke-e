import hc from '../lib';

describe('Int', () => {
  hc.hold(
    '> 0',       // property name.
    x => x > 0   // predicate.
  )
  .over(0)       // first especially case.
  .over(2)       // second especially case.
  .over(hc.int.choose(-10, 10))  // universal case.
})
