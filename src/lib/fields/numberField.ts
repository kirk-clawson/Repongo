import _ = require('lodash');

import { IField, IFluent, FieldRule } from './base';
import { stringFormat } from '../util';
import { AnyImpl } from './anyField';

export interface INumberFluent extends IFluent {
    hasMaximumOf(value: number, message?: string): this;
    hasMinimumOf(value: number, message?: string): this;
}

export class NumberImpl extends AnyImpl implements IField, INumberFluent {
    static defaultMinMessage: string = '${0} value of ${1} is less than the minimum value of ${2}';
    static defaultMaxMessage: string = '${0} value of ${1} exceeds the maximum value of ${2}';
    static defaultTypeMessage: string = '${0} does not match the specified data type (Number)';

    max: FieldRule<number>;
    min: FieldRule<number>;
    dataTypeMessage: string;

    constructor(defaultValue: number = 0, message: string = NumberImpl.defaultTypeMessage) {
        super(defaultValue);
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
        if (this.max.hasValue() && value > this.max.value) {
            this.messages.push(stringFormat(this.max.message, this.name, value, this.max.value));
            result = false;
        }
        if (this.min.hasValue() && value < this.min.value) {
            this.messages.push(stringFormat(this.min.message, this.name, value, this.min.value));
            result = false;
        }
        return result;
    }

    hasMaximumOf(value: number, message: string = NumberImpl.defaultMaxMessage): this {
        this.max.value = value;
        this.max.setMessage(message);
        return this;
    }

    hasMinimumOf(value: number, message: string = NumberImpl.defaultMinMessage): this {
        this.min.value = value;
        this.min.setMessage(message);
        return this;
    }
}