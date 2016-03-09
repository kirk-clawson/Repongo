import * as _ from 'lodash';

import {IField, IFluentValidator, FieldRule } from './base';
import {stringFormat } from '../util';
import {AnyImpl} from './anyField';

interface INumberFluent extends IFluentValidator<INumberFluent> {
    hasMaximumOf(value: number, message?: string): INumberFluent;
    hasMinimumOf(value: number, message?: string): INumberFluent;
}

class NumberImpl extends AnyImpl implements IField, INumberFluent {
    static defaultMinMessage: string = '${0} value of ${1} is less than the minimum value of ${2}';
    static defaultMaxMessage: string = '${0} value of ${1} exceeds the maximum value of ${2}';
    static defaultTypeMessage: string = '${0} does not match the specified data type (Number)';

    max: FieldRule<number>;
    min: FieldRule<number>;
    dataTypeMessage: string;

    constructor();
    constructor(defaultValue: number);
    constructor(defaultValue?: number, message?: string);
    constructor(defaultValue: number = 0, message: string = NumberImpl.defaultTypeMessage) {
        super(_.isNil(defaultValue) ? 0 : defaultValue);
        this.max = new FieldRule<number>(null, NumberImpl.defaultMaxMessage);
        this.min = new FieldRule<number>(null, NumberImpl.defaultMinMessage);
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

    isRequired(): INumberFluent;
    isRequired(message?: string): INumberFluent;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): INumberFluent {
        super.isRequired(message);
        return this;
    }

    hasMaximumOf(value: number): INumberFluent;
    hasMaximumOf(value: number, message?: string): INumberFluent;
    hasMaximumOf(value: number, message: string = NumberImpl.defaultMaxMessage): INumberFluent {
        this.max.value = value;
        this.max.setNonNullMessage(message);
        return this;
    }

    hasMinimumOf(value: number): INumberFluent;
    hasMinimumOf(value: number, message?: string): INumberFluent;
    hasMinimumOf(value: number, message: string = NumberImpl.defaultMinMessage): INumberFluent {
        this.min.value = value;
        this.min.setNonNullMessage(message);
        return this;
    }
}

export { INumberFluent, NumberImpl };