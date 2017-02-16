/**
 * @module
 */
import {int, number, hexString} from '../primitive';
import {object} from '../../combinators';

const rgbRange = number.choose(0, 255);
const hueRange = int
        .choose(0, 360)
        .transform(n => n / 360);
const percent = number.choose(0, 1);

/**
 * Color RGBA
 *
 * @type {Arbitray}
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
}).name('Color RGBA');

/**
 * Color HSVA
 *
 * @type {Arbitray}
 */
const hsva = object({
  hue: hueRange,
  saturation: percent,
  value: percent,
  alpha: percent
}).name('Color HSVA');

/**
 * Color HSLA
 *
 * @type {Arbitray}
 */
const hsla = object({
  hue: hueRange,
  saturation: percent,
  lightness: percent,
  alpha: percent
}).name('Color HSLA ');

/**
 * Color Hex
 *
 * @type {Arbitray}
 */
const hex = int.choose(0x00000, 0xFFFFFF)
        .name('Color Hex');

/**
 * Color HexCode
 *
 * @type {Arbitray}
 * @example
 * > ke.graphic.color.hexCode.random
 * '#d7938d'
 */
const hexCode = hexString.transform(s => `#${s}`)
        .name('Color Hex Code');

export default {
  rgba,
  hsva,
  hsla,
  hex,
  hexCode
}
