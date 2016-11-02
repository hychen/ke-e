import ke from '../lib';

describe('Int', () => {
  ke.hold(
    '> 0',       // property name.
    x => x > 0   // predicate.
  )
  .over(0)       // first especially case.
  .over(2)       // second especially case.
  .over(ke.int.choose(-10, 10))  // universal case.
})
