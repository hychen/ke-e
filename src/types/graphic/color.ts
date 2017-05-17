/**
 * @module
 */
import { Arbitrary } from '../../arbitrary';
import {
  pint,
  num,
  NumberGenOpts,
  hexString,
  HexStringGenOpts
} from '../primitive/index';
import { object } from '../../combinators';

const rgbRange = pint.choose({ max: 255 });
const hueRange = pint
  .choose({ max: 360 })
  .transform(n => n / 360);
const percent = pint.choose({ min: 0, max: 1 });

/**
 * Color RGBA
 *
 * @example
 * > ke.graphic.color.rgba.random
 * { red: 233.28651197533094,
 *   green: 102.16220695801994,
 *   blue: 14.784638255757336,
 *   alpha: 0.3622623854661302 }
 */
const rgba = object({
  red: rgbRange,
  green: rgbRange,
  blue: rgbRange,
  alpha: percent
}).set('name', 'Color RGBA');

/**
 * Color HSVA
 */
const hsva = object({
  hue: hueRange,
  saturation: percent,
  value: percent,
  alpha: percent
}).set('name', 'Color HSVA');

/**
 * Color HSLA
 */
const hsla = object({
  hue: hueRange,
  saturation: percent,
  lightness: percent,
  alpha: percent
}).set('name', 'Color HSLA ');

/**
 * Color Hex
 */
const hex = pint.choose({ min: 0x00000, max: 0xFFFFFF })
  .set('name', 'Color Hex');

/**
 * Color HexCode
 * @example
 * > ke.graphic.color.hexCode.random
 * '#d7938d'
 */
const hexCode = hexString.transform(s => `#${s}`)
  .set('name', 'Color Hex Code');

export const color = {
  rgba,
  hsva,
  hsla,
  hex,
  hexCode
}
