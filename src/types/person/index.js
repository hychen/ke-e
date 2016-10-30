/**
 * @module
 */
import {Arbitrary} from '../../arbitrary';
import {elements} from '../../combinators';
import {getDef} from '../../utils';

import definietions from './definitions';

const firstName = new Arbitrary({
  gen: function() {
    return function(engine, locale) {
      let pool = getDef(definietions, locale, 'firstName');
      return elements(pool).engine(engine).generate();
    }
  }
});

export default {
  firstName
}
