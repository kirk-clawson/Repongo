import * as _ from 'lodash';

import {IField, IFluent, FieldRule} from './base';
import {stringFormat} from '../util';
import {AnyImpl} from './anyField';

interface IStringFluent extends IFluent {
    hasMaxLengthOf(value: number, message?: string): this;
    hasMinLengthOf(value: number, message?: string): this;
}

class StringImpl extends AnyImpl implements IField, IStringFluent {
    static defaultMaxLengthMessage: string = '${0} exceeds the maximum length of ${1}';
    static defaultMinLengthMessage: string = '${0} is shorter than the minimum length of ${1}';
    static defaultTypeMessage: string = '${0} does not match the specified data type (String)';

    maxLength: FieldRule<number>;
    minLength: FieldRule<number>;
    dataTypeMessage: string;

    constructor();
    constructor(defaultValue: string);
    constructor(defaultValue?: string, message?: string);
    constructor(defaultValue: string = '', message: string = StringImpl.defaultTypeMessage) {
        super(defaultValue);
        this.maxLength = new FieldRule<number>(null, StringImpl.defaultMaxLengthMessage);
        this.minLength = new FieldRule<number>(null, StringImpl.defaultMinLengthMessage);
        this.dataTypeMessage = message;
    }

    isValid(value: any): boolean {
        var result = super.isValid(value);
        if (!_.isString(value)) {
            this.messages.push(stringFormat(this.dataTypeMessage, this.name));
            return false;
        }
        if (value.length > this.maxLength.value) {
            this.messages.push(stringFormat(this.maxLength.message, this.name, this.maxLength.value));
            result = false;
        }
        if (value.length < this.minLength.value) {
            this.messages.push(stringFormat(this.minLength.message, this.name, this.minLength.value));
            result = false;
        }
        return result;
    }

    hasMaxLengthOf(value: number): this;
    hasMaxLengthOf(value: number, message: string = StringImpl.defaultMaxLengthMessage): this {
        this.maxLength.value = value;
        this.maxLength.setNonNullMessage(message);
        return this;
    }

    hasMinLengthOf(value: number): this;
    hasMinLengthOf(value: number, message: string = StringImpl.defaultMinLengthMessage): this {
        this.maxLength.value = value;
        this.maxLength.setNonNullMessage(message);
        return this;
    }
}

export { IStringFluent, StringImpl };