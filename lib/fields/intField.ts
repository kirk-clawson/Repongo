import * as _ from 'lodash';

import {IField, IFluentValidator, FieldRule} from './base';
import {stringFormat} from '../util';
import {AnyImpl} from './anyField';
import {NumberImpl} from "./numberField";

interface IIntFluent extends IFluentValidator<IIntFluent> {
    hasMaximumOf(value: number, message?: string): IIntFluent;
    hasMinimumOf(value: number, message?: string): IIntFluent;
}

class IntImpl extends NumberImpl implements IField, IIntFluent {
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

    isRequired(): IIntFluent;
    isRequired(message?: string): IIntFluent;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): IIntFluent {
        super.isRequired(message);
        return this;
    }

    hasMaximumOf(value: number): IIntFluent;
    hasMaximumOf(value: number, message?: string): IIntFluent;
    hasMaximumOf(value: number, message: string = IntImpl.defaultMaxMessage): IIntFluent {
        super.hasMaximumOf(value, message);
        return this;
    }

    hasMinimumOf(value: number): IIntFluent;
    hasMinimumOf(value: number, message?: string): IIntFluent;
    hasMinimumOf(value: number, message: string = IntImpl.defaultMinMessage): IIntFluent {
        super.hasMinimumOf(value, message);
        return this;
    }
}

export { IIntFluent, IntImpl };