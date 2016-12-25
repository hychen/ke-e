/**
 * @module
 */
import {fromGenMaker} from '../../arbitrary';
import {oneOf,
        pair,
        nearray,
        elements,
        object,
        constant} from '../../combinators';
import {Definitions} from '../../definition';
import person from '../person';
import {asciistring, nat} from '../primitive';

import definitions from './definitions';
const defs = new Definitions(definitions);

const avatar = defs.arbitrary('avatarURI').name('Avatar URI');

const userNameSep = elements(['.', '_', '']);
const userNameSuffix = oneOf([nat.choose(1, 99), constant('')]);
const userNameSpec = {
  firstName: person.firstName,
  lastName: person.lastName,
  sep: userNameSep,
  suffix: userNameSuffix,
  chance: nat.choose(0, 1)
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
const userName = object(userNameSpec)
  .transform(r => {
    if (r.chance === 0) {
      return `${r.firstName}`;
    }
    else {
      return `${r.firstName}${r.sep}${r.lastName}${r.suffix}`;
    }
  }).name('Internet User Name');

/**
 * Arbitrary to produce a 16bit password.
 *
 * @type {Arbitrary}
 * @example
 * // returns JI|m)5?!e;"_b=$p
 * ke.internet.password.random
 */
const password = asciistring
        .choose(16, 16)
        .name('Password');

const freeEmailProvider = elements([
  'gmail.com',
  'yahoo.com',
  'hotmail.com'
]).name('Free Email Provider');

const emailSpec = {
  userName: userName,
  provider: freeEmailProvider
};

/**
 * Arbitrary to produce an email.
 *
 * @type {Arbitrary}
 * @example
 * // returns jack.hand@gmail.com
 * ke.internet.email.generate();
 */
const email = object(emailSpec)
  .transform(r => `${r.userName}@${r.provider}`)
  .name('Email');

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

const domainNameSpec = {
  domainWord,
  domainSuffix
};

const domainName = object(domainNameSpec)
  .transform(r => `${r.domainWord}.${r.domainSuffix}`)
  .name('Domain Name');

const urlSpec = {
  proto,
  domainName
};

/**
 * Arbitrary to produce an url.
 *
 * @type {Arbitrary}
 */
const url = object(urlSpec)
        .transform(r => `${r.proto}://${r.domainName}`)
        .name('URL');

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
  avatar,
  userName,
  password,
  email,
  domainName,
  url,
  ip,
  ipv6
};
