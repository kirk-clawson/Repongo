import * as _ from 'lodash';

import {IField, IFluent, FieldRule} from './base';
import {stringFormat} from '../util';
import {AnyImpl} from './anyField';
import {INumberFluent, NumberImpl} from "./numberField";

class IntImpl extends NumberImpl implements IField, INumberFluent {
    static defaultTypeMessage: string = '${0} does not match the specified data type (Integer)';

    constructor();
    constructor(defaultValue: number);
    constructor(defaultValue: number, message?: string);
    constructor(defaultValue: number = 0, message: string = IntImpl.defaultTypeMessage) {
        super(defaultValue, message);
    }

    isValid(value: any): boolean {
        if (!_.isInteger(value)) {
            this.messages.push(stringFormat(this.dataTypeMessage, this.name));
            return false;
        }
        return super.isValid(value);
    }
}

export { IntImpl };