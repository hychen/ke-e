[![Build Status](https://travis-ci.org/hychen/hycheck.svg?branch=master)](https://travis-ci.org/hycheck/hycheck)
[![Coverage STatus](https://coveralls.io/repos/github/hychen/hycheck/badge.svg?branch=master)](https://coveralls.io/github/hychen/hycheck?branch=master)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org/)

HyCheck is a property-based testing library, inspired by QuickCheck, Hypothesis, JSVerify.

- warrning: only arbitraries are implemented now.
- more details see [Documents](http://hychen.me/hycheck/index.html).

## Getting Started

### Node.js

install the module with: npm install hycheck 

```javascript
import hc from `hycheck`

// generate a random integer.
hc.int.generate()

// generate a random integer betwen -10 and 10.
hc.int.choose(-10, 10).generate()
```

### Browser using script tag

Download hycheck.js and place it in your project, then add it as the follwoing.

```html
<script src="dist/hycheck.js"></script>
<script>
// generate a random integer betwen -10 and 10.
hc.default.int.choose(-10, 10).generate()
</script>
```

### License

The MIT License (MIT)
