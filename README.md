[![Build Status](https://travis-ci.org/hychen/hycheck.svg?branch=master)](https://travis-ci.org/hycheck/hycheck)
[![Coverage STatus](https://coveralls.io/repos/github/hychen/hycheck/badge.svg?branch=master)](https://coveralls.io/github/hychen/hycheck?branch=master)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org/)

HyCheck is a property-based testing library, inspired by QuickCheck, Hypothesis, JSVerify.

- warrning: shrinking is not implemented.
- more details see [Documents](http://hychen.me/hycheck/index.html).

## Getting Started

### Node.js

install the module with: npm install hycheck 

```javascript
import hc from `hycheck`

describe('Integer', () => {
  hc.hold(
    'x + y = y + x'
    hc.int, hc.int,
    (x, y) => x + y === y + x
    );
});
```

### Browser using script tag

Download hycheck.js and place it in your project, then add it as the follwoing.

```html
<script src="dist/hycheck.js"></script>
<script>
describe('Integer', () => {
  hc.hold(
    'x + y = y + x'
    hc.int, hc.int,
    (x, y) => x + y === y + x
    );
});
</script>
```

## Usage

By default, `hc.hold` runs 100 tests. it reports a counter example does not satisfy the property 
if any test fail.

for example, the following test.

```
describe('Int', () => {
  hc.hold('> 0', hc.int, (x) => x > 0);
})
```

will report:

```
1) Int > 0:

      AssertionError: > 0 doesn't hold, counter example: -5, tried: 1/100
      + expected - actual

      -false
      +true
```

### Exception-based Testing

You can still use `chai` to do the testing with random test values 
generated by `hycheck`.

```
describe('Nat', () => {
  it('>= 0',  () => {
    hc.forall(hc.nat).expect((n) => {
      expect(nat > 0).eq(true);
    });
  }
})
```

### License

The MIT License (MIT)
