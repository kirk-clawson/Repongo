import * as _ from 'lodash';

import {IField, IFluentValidator, FieldRule} from './base';
import {stringFormat} from '../util';
import {AnyImpl} from './anyField';

interface IStringFluent extends IFluentValidator<IStringFluent> {
    hasMaxLengthOf: (value: number, message?: string) => IStringFluent;
    hasMinLengthOf: (value: number, message?: string) => IStringFluent;
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

    isRequired(): IStringFluent;
    isRequired(message?: string): IStringFluent;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): IStringFluent {
        super.isRequired(message);
        return this;
    }

    hasMaxLengthOf(value: number): IStringFluent;
    hasMaxLengthOf(value: number, message: string = StringImpl.defaultMaxLengthMessage): IStringFluent {
        this.maxLength.value = value;
        this.maxLength.setNonNullMessage(message);
        return this;
    }

    hasMinLengthOf(value: number): IStringFluent;
    hasMinLengthOf(value: number, message: string = StringImpl.defaultMinLengthMessage): IStringFluent {
        this.maxLength.value = value;
        this.maxLength.setNonNullMessage(message);
        return this;
    }
}

export { IStringFluent, StringImpl };