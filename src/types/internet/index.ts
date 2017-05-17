/**
 * @module
 */
import { Arbitrary } from '../../arbitrary';
import {
  oneOf,
  nearray,
  elements,
  object,
  constant
} from '../../combinators';
import { Definitions } from '../../definition';
import { person } from '../person/index';
import { asciistring, nat } from '../primitive/index';

import definitions from './definitions/index';
const defs = new Definitions(definitions);

const avatar = defs.arbitrary('avatarURI').set('name', 'Avatar URI');

const userNameSep = elements(['.', '_', '']);
const userNameSuffix = oneOf([nat.choose({ min: 1, max: 99 }), constant('')]);
const userNameSpec = {
  firstName: person.firstName,
  lastName: person.lastName,
  sep: userNameSep,
  suffix: userNameSuffix,
  chance: nat.choose({ min: 0, max: 1 })
};

/**
 * Arbitrary to produce internet user name.
 * @example
 *
 * // returns jack or jack.hand or jack.hand34.
 * ke.internet.userName.generate();
 */
const userName = object(userNameSpec)
  .transform(r => {
    if (r.chance === 0) {
      return `${r.firstName}`;
    }
    else {
      return `${r.firstName}${r.sep}${r.lastName}${r.suffix}`;
    }
  }).set('name', 'Internet User Name');

/**
 * Arbitrary to produce a 16bit password.
 * @example
 * // returns JI|m)5?!e;"_b=$p
 * ke.internet.password.random
 */
const password = asciistring
  .choose({ min: 16, max: 16 })
  .set('name', 'Password');

const freeEmailProvider = elements([
  'gmail.com',
  'yahoo.com',
  'hotmail.com'
]).set('name', 'Free Email Provider');

const emailSpec = {
  userName: userName,
  provider: freeEmailProvider
};

/**
 * Arbitrary to produce an email.
 * @example
 * // returns jack.hand@gmail.com
 * ke.internet.email.generate();
 */
const email = object(emailSpec)
  .transform(r => `${r.userName}@${r.provider}`)
  .set('name', 'Email');

const proto = elements(['http', 'https']).set('name', 'Internet Protocol');

const domainWord = person.firstName.transform((name: string) => {
  return name.replace(/([\\~#&*{}/:<>?|\"'])/ig, '').toLowerCase();
}).set('name', 'Domain Word');

const domainSuffix = elements([
  'com',
  'org',
  'io',
  'info',
  'today'
]).set('name', 'Domain Suffix');

const domainNameSpec = {
  domainWord,
  domainSuffix
};

const domainName = object(domainNameSpec)
  .transform(r => `${r.domainWord}.${r.domainSuffix}`)
  .set('name', 'Domain Name');

const urlSpec = {
  proto,
  domainName
};

/**
 * Arbitrary to produce an url.
 */
const url = object(urlSpec)
  .transform(r => `${r.proto}://${r.domainName}`)
  .set('name', 'URL');

const ipRange = nat.choose({ max: 255 }).set('name', 'IP Range');

/**
 * Arbitrary to produce an IP v4 address.
 */
const ip = nearray(ipRange).choose({ min: 3, max: 4 })
  .transform(arr => arr.join('.'))
  .set('name', 'IP v4 Address');

const ipV6Range = nat.choose({ max: 15 })
  .transform(n => n.toString(16))
  .set('name', 'IPV6 Range');

const ipv6Block = nearray(ipV6Range)
  .choose({ min: 4, max: 4 })
  .transform(arr => arr.join(''))
  .set('name', 'IPV6 Block');

/**
 * Arbitrary to produce an IP v6 address.
 */
const ipv6 = nearray(ipv6Block)
  .choose({ min: 8, max: 8 })
  .transform(arr => arr.join(':'))
  .set('name', 'IP v5 Address');

export const internet = {
  avatar,
  userName,
  password,
  email,
  domainName,
  url,
  ip,
  ipv6
};
