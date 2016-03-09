import * as _ from 'lodash';

import {IField, IFluentValidator, FieldRule} from './base';
import {stringFormat} from '../util';
import {AnyImpl} from './anyField';

interface IFloatFluent extends IFluentValidator<IFloatFluent> {
    hasMaximumOf(value: number, message?: string): IFloatFluent;
    hasMinimumOf(value: number, message?: string): IFloatFluent;
}

class FloatImpl extends AnyImpl implements IField, IFloatFluent {
    static defaultMinMessage: string = '?0: value of ?1: is less than the minimum value of ?2:';
    static defaultMaxMessage: string = '?0: value of ?1: exceeds the maximum value of ?2:';
    static defaultTypeMessage: string = '?0: does not match the specified data type (Float)';

    max: FieldRule<number>;
    min: FieldRule<number>;
    dataTypeMessage: string;

    constructor();
    constructor(defaultValue: number);
    constructor(defaultValue?: number, message?: string);
    constructor(defaultValue: number = 0, message: string = FloatImpl.defaultTypeMessage) {
        super(_.isNil(defaultValue) ? 0 : defaultValue);
        this.max = new FieldRule<number>(null, FloatImpl.defaultMaxMessage);
        this.min = new FieldRule<number>(null, FloatImpl.defaultMinMessage);
        this.dataTypeMessage = message;
    }

    isValid(value: any): boolean {
        let result = super.isValid(value);
        if (!_.isNumber(value)) {
            this.messages.push(stringFormat(this.dataTypeMessage, this.name));
            return false;
        }
        if (value > this.max.value) {
            this.messages.push(stringFormat(this.max.message, this.name, value, this.max.value));
            result = false;
        }
        if (value < this.min.value) {
            this.messages.push(stringFormat(this.min.message, this.name, value, this.min.value));
            result = false;
        }
        return result;
    }

    isRequired(): IFloatFluent;
    isRequired(message?: string): IFloatFluent;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): IFloatFluent {
        super.isRequired(message);
        return this;
    }

    hasMaximumOf(value: number): IFloatFluent;
    hasMaximumOf(value: number, message: string = FloatImpl.defaultMaxMessage): IFloatFluent {
        this.max.value = value;
        this.max.setNonNullMessage(message);
        return this;
    }

    hasMinimumOf(value: number): IFloatFluent;
    hasMinimumOf(value: number, message: string = FloatImpl.defaultMinMessage): IFloatFluent {
        this.min.value = value;
        this.min.setNonNullMessage(message);
        return this;
    }
}

export { IFloatFluent, FloatImpl };