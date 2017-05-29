import * as C from './combinators';
import * as T from './types/index';
import * as S from './seq';
import { Arbitrary } from './arbitrary';
import hold from './integrations/index';
import { property, TestResult, forAll, ForAll } from './property';

const namespace = Object.assign({}, C, T, {
    seq: S,
    forAll: forAll,
    property: property,
    hold: hold,
    register: function register(name: string, module: Object) {
        if (namespace.hasOwnProperty(name)) {
            throw new Error(`${name} is registered.`);
        }
        namespace[name] = module;
        return true;
    }
});

export default namespace;