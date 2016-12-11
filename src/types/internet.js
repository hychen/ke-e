/**
 * @module
 */
import {fromGenMaker} from '../arbitrary';
import person from './person';
import {nat} from './number';
import {oneOf,
        pair,
        nearray,
        elements,
        object,
        constant} from '../combinators';

const userNameSep = elements(['.', '_', '']);
const userNameSuffix = oneOf([nat.choose(1, 99), constant('')]);
const userNameOpts = {
  firstName: person.firstName,
  lastName: person.lastName,
  sep: userNameSep,
  suffix: userNameSuffix
};

/**
 * Arbitrary to produce internet user name.
 *
 * @type {Arbitrary}
 * @example
 *
 * // returns jack or jack.hand or jack.hand34.
 * ke.internet.userName.generate();
 *
 */
const userName = fromGenMaker(function(opts) {
  return function(engine) {
    const gen = object(_.defaults(opts, userNameOpts)).makeGen();
    const {firstName, lastName, sep, suffix} = gen(engine, 'en');
    const n = nat.choose(0, 1).makeGen()(engine);
    if (n === 0) {
      return `${firstName}`;
    }
    else {
      return `${firstName}${sep}${lastName}${suffix}`;
    }
  };
}).name('Internet User Name');

const freeEmailProvider = elements([
  'gmail.com',
  'yahoo.com',
  'hotmail.com'
]).name('Free Email Provider');

/**
 * Arbitrary to produce an email.
 *
 * @type {Arbitrary}
 * @example
 * // returns jack.hand@gmail.com
 * ke.internet.email.generate();
 */
const email = fromGenMaker(function(userName, provider) {
  return function(engine) {
    const a = userName.makeGen()(engine);
    const b = provider.makeGen()(engine);
    return `${a}@${b}`;
  };
}, [userName, freeEmailProvider]).name('Email');

const proto = elements(['http', 'https']).name('Internet Protocol');

const domainWord = person.firstName.transform((name) => {
  return name.replace(/([\\~#&*{}/:<>?|\"'])/ig, '').toLowerCase();
}).name('Domain Word');

const domainSuffix = elements([
  'com',
  'org',
  'io',
  'info',
  'today'
]).name('Domain Suffix');

const domainName = pair(domainWord, domainSuffix)
        .transform((arr) => `${arr[0]}.${arr[1]}`).name('Domain Name');

/**
 * Arbitrary to produce an url.
 *
 * @type {Arbitrary}
 */
const url = pair(proto, domainName).
        transform((arr) => `${arr[0]}://${arr[1]}`).name('URL');

const ipRange = nat.choose(0, 255).name('IP Range');

/**
 * Arbitrary to produce an IP v4 address.
 *
 * @type {Arbitrary}
 */
const ip = nearray(ipRange).choose(4, 4)
        .transform(arr => arr.join('.'))
        .name('IP v4 Address');

const ipV6Range = nat.choose(0, 15)
        .transform(n => n.toString(16))
        .name('IPV6 Range');

const ipv6Block = nearray(ipV6Range)
        .choose(4, 4)
        .transform(arr => arr.join(''))
        .name('IPV6 Block');

/**
 * Arbitrary to produce an IP v6 address.
 *
 * @type {Arbitrary}
 */
const ipv6 = nearray(ipv6Block)
        .choose(8, 8)
        .transform(arr => arr.join(':'))
        .name('IP v6 Address');

export default {
  userName,
  email,
  url,
  ip,
  ipv6
};
