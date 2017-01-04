import namespace from './namespace';
import {liftExport} from './utils';
import * as types from './types';
import * as combinators from './combinators';
import * as testable from './testable';
import * as monkey from './monkey';
import {Arbitrary, fromGenMaker} from './arbitrary';

namespace.Arbitrary = Arbitrary,
namespace.fromGenMaker = fromGenMaker,
namespace.types = types,
namespace.combinators = combinators,
namespace.testable = testable,
namespace.monkey = monkey,
namespace.hold = testable.hold,
namespace.forall = testable.forall

liftExport(namespace, 'types');
liftExport(namespace, 'combinators');

export default namespace;
