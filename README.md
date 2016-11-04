[![Build Status](https://travis-ci.org/hychen/ke-e.svg?branch=master)](https://travis-ci.org/hychen/ke-e)
[![Coverage STatus](https://coveralls.io/repos/github/hychen/ke-e/badge.svg?branch=master)](https://coveralls.io/github/hychen/ke-e?branch=master)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org/)

# ké--ê

`ké--ê` is a property-based testing library, inspired by [QuickCheck](https://hackage.haskell.org/package/QuickCheck),
[Hypothesis](https://github.com/HypothesisWorks/hypothesis-python), [JSVerify](https://github.com/jsverify/jsverify) and
[faker.js](https://github.com/marak/Faker.js/).

It is also available to generate fake data for many purpose like faker.js.

## What is ké--ê?

假的 (ké--ê) is a Taiwanese word. the meaning is fake things in English.

## Features

- Property-based test utilitis library.
- Repeatable random fake data generators.
- Mocha test framwork integration.
- Support for multiple localities.
- Support for browser and Node.js.

check [documents](http://hychen.me/ke-e/index.html) for more details.

### Property-Based Testing

Property-based tests make statements about the output of your code based on the input, and these statements 
are verified for many different possible inputs.

By default, `ke.hold` runs 100 tests. it reports a counter example does not satisfy the property 
if any test fail.

for example, the following test.

```
describe('Int', () => {
  ke.hold(
    '> 0',       // property name.
    x => x > 0   // predicate.
  )
  .over(0)       // first especially case.
  .over(2)       // second especially case.
  .over(ke.int)  // universal case.
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

### Exception-Based Testing

You can still use `chai` to do the testing with random test values 
generated by `ke-e`.

```
describe('Nat', () => {
  it('>= 0',  () => {
    ke.forall(ke.nat).eval((n) => {
      expect(n >= 0).eq(true);
    });
  }
})
```

### Repeatable

test results are repeatable.

```
$ mocha
1) Int >0:
AssertionError: >0 doesn't hold, seed: -1764850555, counter example: -5265798245849472, tried: 3/3`

```

```
KESeed=-1764850555 mocha
1) Int >0:
AssertionError: >0 doesn't hold, seed: -1764850555, counter example: -5265798245849472, tried: 3/3`
```

### Localization

This project follows unicode CLDR specification. `en` is default locale id.

```
// Generate English first name.
ke.person.firstName.generate();

// Generate Tranditional Chinese first name.
ke.person.firstName.locale('zh-Hant-TW').generate();
```

## Arbitraries

The pupose of a arbitraries is random generation and shrinking of values 
in property-based testing, but you could use them to generate fake data 
individually.

some of difinitions of arbitraries took from 
[faker.js](https://github.com/marak/Faker.js/) project.

### Primitive

- any - produce any primtive types.
- boolean — produce true and false with equal probability. 
- falsy — produce falsy values: false, null, undefined, '', 0, and NaN.
- nat — produce a natural number.
- int — produce a integer. 
- pint — produce a positive integer.
- nint — produce a negative integer.
- number — produce a float numbers.
- pnumber — produce a positive float numbers.
- nnumber — produce negative float numbers.
- char — produce a unicode character.
- asciichar — produce an ascii character.
- string — produce a unicode string.
- nestring - produce a non-empty unicode string.
- asciistring — produce an ascii string.
- neasciistring — produce an non-empty ascii string.
- function — produce a function.

### Combinator

- constant — produce a contant value.
- elements — produce one of the given values. 
- suchThat — produce a value that satisfies a predicate.
- oneOf — randomly uses one of the given generators. 
- pair — produce a pair of two arbitraries.
- array — produce an array.
- nearray — produce a non-empty array.
- sequence — produce an array of given arbitraries in order.
- object — produce an object.

### Locale

- localeids — produce a locale id.

### Datetime

- date — produce a Date.

### Literate
- literate
 - word
 - words
 - sentence
 - sentences
 - pagraph
 - pagraphs
 - lines
 - text

### Person

- person - produce an object to reprsent a person.
 - name - produce the name of a person.
 - firstName - produce the first name of a person.
 - lastName - produce the last name of a person.
 - gender - produce the gender of a person.

### Internet

- internet
 - userName - produce a internet username.
 - email - produce an email.
 - url - produce an url.

## Installation

### Node.js

install the module with: npm install ke-e

```javascript
import ke from `ke-e`

describe('Integer', () => {
  ke.hold(
    'x + y = y + x'
    (x, y) => x + y === y + x
    ).over(ke.int, ke.int);
});
```

### Browser using script tag

Download ke-e.js and place it in your project, then add it as the follwoing.

```html
<script src="http://hychen.me/ke-e/ke-e.js"</script>
<script>
describe('Integer', () => {
  ke.hold(
    'x + y = y + x'
    (x, y) => x + y === y + x
    ).over(ke.int, ke.int);
});
</script>
```

## Get Involved

- source code : [github.com/hychen/ke-e](https://github.com/hychen/ke-e).

## License

The MIT License (MIT)
