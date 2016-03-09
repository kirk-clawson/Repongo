///<reference path="../../_all.d.ts"/>
import * as _ from 'lodash';

import {IField, IFluentValidator, FieldRule} from './base';
import {stringFormat} from '../util';
import {AnyImpl} from './anyField';

export interface IIntFluent extends IFluentValidator<IIntFluent> {
    hasMaximumOf(value: number, message?: string): IIntFluent;
    hasMinimumOf(value: number, message?: string): IIntFluent;
}

export class IntImpl extends AnyImpl implements IField, IIntFluent {
    static defaultMinMessage: string = '?0: value of ?1: is less than the minimum value of ?2:';
    static defaultMaxMessage: string = '?0: value of ?1: exceeds the maximum value of ?2:';
    static defaultTypeMessage: string = '?0: does not match the specified data type (Integer)';

    max: FieldRule<number>;
    min: FieldRule<number>;
    dataTypeMessage: string;

    constructor();
    constructor(defaultValue: number);
    constructor(defaultValue?: number, message?: string);
    constructor(defaultValue: number = 0, message: string = IntImpl.defaultTypeMessage) {
        super(_.isNil(defaultValue) ? 0 : defaultValue);
        this.max = new FieldRule<number>(null, IntImpl.defaultMaxMessage);
        this.min = new FieldRule<number>(null, IntImpl.defaultMinMessage);
        this.dataTypeMessage = message;
    }

    isValid(value: any): boolean {
        let result = super.isValid(value);
        if (!_.isInteger(value)) {
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

    isRequired(): IIntFluent;
    isRequired(message?: string): IIntFluent;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): IIntFluent {
        super.isRequired(message);
        return this;
    }

    hasMaximumOf(value: number): IIntFluent;
    hasMaximumOf(value: number, message: string = IntImpl.defaultMaxMessage): IIntFluent {
        this.max.value = value;
        this.max.setNonNullMessage(message);
        return this;
    }

    hasMinimumOf(value: number): IIntFluent;
    hasMinimumOf(value: number, message: string = IntImpl.defaultMinMessage): IIntFluent {
        this.min.value = value;
        this.min.setNonNullMessage(message);
        return this;
    }
}