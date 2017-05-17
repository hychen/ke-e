/**
 * @module
 */
import { Engine } from 'random-js';
import { Definitions } from '../../definition';
import { Arbitrary } from '../../arbitrary';
import { array, oneOf } from '../../combinators';
import { nat } from '../primitive/index';

import definitions from './definitions/index';
const defs = new Definitions(definitions);

/**
 * Arbitrary to represent a word.
 */
const word = defs.arbitrary('words').set('name', 'Word');

/**
 * Arbitrary to represent a space separated list of words.
 */
const words = array(word).choose({ min: 3, max: 3 })
  .transform((ws: string[]) => ws.join(' '))
  .set('name', 'Words');

/**
 * Arbitrary to represent a sentence.
 */
const sentence = words.transform(s => {
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}).set('name', 'Sentence');

type sentencesGenOpts = {
  min: number,
  max: number,
  sep: string
};

function sentencesGen({ min, max, sep }: sentencesGenOpts) {
  return function (engine: Engine, locale: string) {
    const ss = array(sentence)
      .choose({ min: min, max: max })
      .makeGenerator()(engine, locale);
    return ss.join(sep);
  };
};

/**
 * Arbitrary to represent a sentences.
 */
const sentences = new Arbitrary({
  gen: sentencesGen,
  genOpts: { min: 2, max: 6, sep: ' ' }
}).set('name', 'Sentences');

/**
 * Arbitrary to represent a paragraph.
 */
const paragraph = sentences.choose({ min: 3, max: 3 }).set('name', 'Paragraph');

type paragraphsGenOpts = {
  count: number,
  sep: string
};

function paragraphsGen({ count, sep }: paragraphsGenOpts) {
  return function (engine: Engine, locale: string) {
    const ps = array(paragraph)
      .choose({ min: count, max: count })
      .makeGenerator()(engine, locale);
    return ps.join(sep);
  };
}

/**
 * Arbitrary to represent paragraphs separated by `'\n'`.
 * @type {Arbitrary}
 */
const paragraphs = new Arbitrary({
  gen: paragraphsGen,
  genOpts: { count: 3, sep: '\r\n' }
}).set('name', 'Paragraphs');

/**
 * Arbitrary to represent lines of sentences separated by `'\n'`.
 * @type {Arbitrary}
 */
const lines = sentences
  .choose({ min: 1, max: 5, sep: '\n' })
  .set('name', 'Lines');

/**
 * Arbitrary to represent any text based string.
 * @type {Arbitrary}
 */
const text = oneOf([
  word,
  sentence,
  sentences,
  paragraph,
  paragraphs,
  lines
]).set('name', 'Text');

export const literate = {
  word,
  words,
  sentence,
  sentences,
  paragraph,
  paragraphs,
  lines,
  text
};
