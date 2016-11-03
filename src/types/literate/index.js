/**
 * @module
 */
import {fromDefinition} from '../../utils';
import {fromGenMaker} from '../../arbitrary';
import {array, oneOf} from '../../combinators';
import {nat} from '../number';
import definitions from './definitions';

/**
 * Arbitrary to represent a word.
 * @type {Arbitrary}
 */
const word = fromDefinition(definitions, 'words').name('Word');

/**
 * Arbitrary to represent a space seperated list of words.
 * @type {Arbitrary}
 */
const words = array(word).choose(3, 3)
        .transform(ws => ws.join(' '))
        .name('Words');

/**
 * Arbitrary to represent a sentence.
 * @type {Arbitrary}
 */
const sentence = words.transform(s => {
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}).name('Sentence');

/**
 * Arbitrary to represent a sentences.
 * @type {Arbitrary}
 */
const sentences = fromGenMaker(function(min = 2, max = 6, sep = ' ') {
  return function(engine, locale) {
    let ss = array(sentence).choose(min, max).makeGen()(engine, locale);
    return ss.join(sep);
  };
}).name('Sentences');

/**
 * Arbitrary to represent a paragraph.
 * @type {Arbitrary}
 */
const paragraph = sentences.choose(3, 3).name('Paragraph');

/**
 * Arbitrary to represent paragraphs seprated by `'\n'`.
 * @type {Arbitrary}
 */
const paragraphs = fromGenMaker(function(count = 3, sep = '\n \r') {
  return function(engine, locale) {
    let ps = array(paragraph).choose(3, 3).makeGen()(engine, locale);
    return ps.join(sep);
  };
}).name('Paragraphs');

/**
 * Arbitrary to represent lines of sentences seprated by `'\n'`.
 * @type {Arbitrary}
 */
const lines = sentences.choose(1, 5, '\n').name('Lines');

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
]).name('Text');

export default {
  word,
  words,
  sentence,
  sentences,
  paragraph,
  paragraphs,
  lines,
  text
};
