/**
 * @module
 */
import { Arbitrary } from '../../arbitrary';
import { object, constant } from '../../combinators';
import { num, NumberGenOpts } from '../primitive/index';
import { person } from '../person/index';

import { Definitions } from '../../definition';

import definitions from './definitions/index';
const defs = new Definitions(definitions);

/**
 * State
 * @example
 * // returns Alabama
 * ke.location.state.random
 */
const state = defs.arbitrary('state').set('name', 'State');

/**
 * State Abbr.
 * @example
 * // returns AL
 * ke.location.state.abbr.random
 */
state.assign({
  abbr: defs.arbitrary('stateAbbr').set('name', 'State Abbr')
});

/**
 * Zip Code
 */
const zipCode = defs.arbitrary('postcode').set('name', 'Zip Code');

/**
 * County
 * @example
 * // returns Avon
 * ke.location.county.random
 */
const county = defs.arbitrary('county').set('name', 'County');

const cityPrefix = defs.arbitrary('cityPrefix');
const citySuffix = defs.arbitrary('citySuffix');

/**
 * City
 * @example
 * // returns Port Sammybury
 * ke.location.city.random
 */
const city = object({
  firstName: person.firstName,
  lastName: person.lastName,
  suffix: citySuffix,
  prefix: cityPrefix
}).transform(defs.formatter('city')).set('name', 'City');

/**
 * Street
 */
const street = object({
  firstName: person.firstName,
  lastName: person.lastName,
  suffix: defs.arbitrary('streetSuffix')
}).transform(defs.formatter('street')).set('name', 'Street');

/**
 * Building Number
 */
const buildingNumber = defs.arbitrary('buildingNumber');

const streetAddress = object({
  street: street,
  buildingNumber: buildingNumber,
  secondaryAddress: defs.arbitrary('secondaryAddress')
}).transform(defs.formatter('streetAddress')).set('name', 'Street Address');

/**
 * Address
 */
const address = object({
  streetAddress: streetAddress,
  state: state,
  county: county,
  city: city,
  zipCode: zipCode
}).transform(defs.formatter('address')).set('name', 'Address');

/**
 * latitude
 * @example
 * // returns 19.4984.
 * ke.location.latitude.random
 */
const latitude = num.choose({ min: 0, max: 180 * 10000 })
  .transform(n => (n / 10000.0 - 90.0).toFixed(4));

/**
 * longitude
 * @example
 * // returns 132.9634.
 * ke.location.longitude.random
 */
const longitude = num.choose({ min: 0, max: 360 * 10000 })
  .transform(n => (n / 10000.0 - 180.0).toFixed(4));

/**
 * coordinates
 * @example
 * // returns 19.4984, 132.9634.
 * ke.location.coordinates.random
 */
const coordinates = object({
  latitude: latitude,
  longitude: longitude
}).transform(c => `${c.latitude}, ${c.longtitude}`)
  .set('name', 'Coordinate');

export const location = {
  address,
  streetAddress,
  state,
  zipCode,
  county,
  city,
  street,
  buildingNumber,
  latitude,
  longitude,
  coordinates
}
