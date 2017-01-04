/**
 * @module
 */
import {object, constant} from '../../combinators';
import {number} from '../primitive';
import person from '../person';

import {Definitions} from '../../definition';

import definitions from './definitions';
const defs = new Definitions(definitions);

/**
 * State
 *
 * @type {Arbitrary}
 * @example
 * // returns Alabama
 * ke.location.state.random
 */
const state = defs.arbitrary('state').name('State');

/**
 * State Abbr.
 *
 * @type {Arbitrary}
 * @example
 * // returns AL
 * ke.location.state.abbr.random
 */
state.abbr = defs.arbitrary('stateAbbr').name('State Abbr');

/**
 * Zip Code
 *
 * @type {Arbitrary}
 */
const zipCode = defs.arbitrary('postcode').name('Zip Code');

/**
 * County
 *
 * @type {Arbitrary}
 * @example
 * // returns Avon
 * ke.location.county.random
 */
const county = defs.arbitrary('county').name('County');

const cityPrefix  = defs.arbitrary('cityPrefix');
const citySuffix = defs.arbitrary('citySuffix');

/**
 * City
 *
 * @type {Arbitrary}
 * @example
 * // returns Port Sammybury
 * ke.location.city.random
 */
const city = object({
  firstName: person.firstName,
  lastName: person.lastName,
  suffix: citySuffix,
  prefix: cityPrefix
}).transform(defs.formater('city')).name('City');

/**
 * Street
 *
 * @type {Arbitrary}
 */
const street = object({
  firstName: person.firstName,
  lastName: person.lastName,
  suffix: defs.arbitrary('streetSuffix')
}).transform(defs.formater('street')).name('Street');

/**
 * Building Number
 *
 * @type {Arbitrary}
 */
const buildingNumber = defs.arbitrary('buildingNumber');

const streetAddress = object({
  street: street,
  buildingNumber: buildingNumber,
  secondaryAddress: defs.arbitrary('secondaryAddress')
}).transform(defs.formater('streetAddress')).name('Street Address');

/**
 * Address
 *
 * @type {Arbitrary}
 */
const address = object({
  streetAddress: streetAddress,
  state: state,
  county: county,
  city, city,
  zipCode: zipCode
}).transform(defs.formater('address')).name('Address');

/**
 * latitude
 *
 * @type {Arbitrary}
 * @example
 * // returns 19.4984.
 * ke.location.latitude.random
 */
const latitude = number.choose(0, 180 * 10000)
  .transform(n => (n / 10000.0 - 90.0).toFixed(4));

/**
 * longtitude
 *
 * @type {Arbitrary}
 * @example
 * // returns 132.9634.
 * ke.location.longtitude.random
 */
const longtitude = number.choose(0, 360 * 10000)
  .transform(n => (n / 10000.0 - 180.0).toFixed(4));

/**
 * coordinates
 *
 * @type {Arbitrary}
 * @example
 * // returns 19.4984, 132.9634.
 * ke.location.coordinates.random
 */
const coordinates = object({
  latitude: latitude,
  longtitude: longtitude
}).transform(c => `${c.latitude}, ${c.longtitude}`)
  .name('Coordinate');

export default {
  address,
  streetAddress,
  state,
  zipCode,
  county,
  city,
  street,
  buildingNumber,
  latitude,
  longtitude,
  coordinates
}
