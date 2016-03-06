///<reference path="../_all.d.ts"/>

import * as _ from 'lodash';

// ----------------------------------------
// base interfaces
export interface IField {
    name: string;
    defaultValue: any;
    messages: string[];
    isValid(value: any): boolean;
}

export interface IFluent {
    getField(name: string): IField;
}

interface IFluentValidator<TDerived> extends IFluent {
    isRequired(message?: string): TDerived
}

class FieldRule<TRuleType> {
    constructor(public value: TRuleType, public message: string) {
    }

    setNonNullMessage(message?: string): void {
        if (!_.isNil(message)) {
            this.message = message;
        }
    }
}

function stringFormat(message: string, ...substitutions: any[]): string {
    let result = message;
    for (let i = 0; i < substitutions.length; ++i) {
        let token = ':' + i + '?';
        result = _.replace(result, token, substitutions[i])
    }
    return result;
}

// ---------------------------------------------
// any type field interfaces and implementations
export interface IAnyFluent extends IFluentValidator<IAnyFluent> {
}

class AnyImpl implements IField, IAnyFluent {
    name: string;
    defaultValue: any;
    fieldIsRequired: FieldRule<boolean>;
    messages: string[];

    constructor(defaultValue: any) {
        this.defaultValue = defaultValue;
        this.fieldIsRequired = new FieldRule<boolean>(false, '?0: is a required field');
        this.messages = [];
    }

    isValid(value: any): boolean {
        let result = true;
        if (this.fieldIsRequired.value && _.isNil(value)) {
            this.messages.push(stringFormat(this.fieldIsRequired.message, this.name));
            result = false;
        }
        return result;
    }

    getField(name: string): IField {
        this.name = name;
        return this;
    }

    isRequired(): IAnyFluent;
    isRequired(message: string): IAnyFluent
    isRequired(message?: string): IAnyFluent {
        this.fieldIsRequired.value = true;
        this.fieldIsRequired.setNonNullMessage(message);
        return this;
    }
}

// --------------------------------------------------
// int type field interfaces and implementation
export interface IIntFluent extends IFluentValidator<IIntFluent> {
    hasMaximumOf(value: number, message?: string): IIntFluent;
    hasMinimumOf(value: number, message?: string): IIntFluent;
}

class IntImpl extends AnyImpl implements IField, IIntFluent {
    max: FieldRule<number>;
    min: FieldRule<number>;
    dataTypeMessage: string;

    constructor();
    constructor(defaultValue: number);
    constructor(defaultValue: number, message: string);
    constructor(defaultValue?: number, message?: string) {
        super(_.isNil(defaultValue) ? 0 : defaultValue);
        this.max = new FieldRule<number>(null, '?0: value of ?1: exceeds the maximum value of ?2:');
        this.min = new FieldRule<number>(null, '?0: value of ?1: is less than the minimum value of ?2:');
        if (!_.isNil(message)){
            this.dataTypeMessage = message;
        } else {
            this.dataTypeMessage = '?0: does not match the specified data type (Integer)';
        }
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
    isRequired(message: string): IIntFluent
    isRequired(message?: string): IIntFluent {
        super.isRequired(message);
        return this;
    }

    hasMaximumOf(value: number): IIntFluent;
    hasMaximumOf(value: number, message: string): IIntFluent;
    hasMaximumOf(value: number, message?: string): IIntFluent {
        this.max.value = value;
        this.max.setNonNullMessage(message);
        return this;
    }

    hasMinimumOf(value: number): IIntFluent;
    hasMinimumOf(value: number, message: string): IIntFluent;
    hasMinimumOf(value: number, message?: string): IIntFluent {
        this.min.value = value;
        this.min.setNonNullMessage(message);
        return this;
    }
}

// ----------------------------------------------
// string type field interfaces and implementation
export interface IStringFluent extends IFluentValidator<IStringFluent> {
    hasMaxLengthOf: (value: number, message?: string) => IStringFluent;
    hasMinLengthOf: (value: number, message?: string) => IStringFluent;
}

class StringImpl extends AnyImpl implements IField, IStringFluent {
    maxLength: FieldRule<number>;
    minLength: FieldRule<number>;
    dataTypeMessage: string;

    constructor();
    constructor(defaultValue: string);
    constructor(defaultValue: string, message: string);
    constructor(defaultValue?: string, message?: string) {
        super(_.isNil(defaultValue) ? '' : defaultValue);
        this.maxLength = new FieldRule<number>(null, '?0: exceeds the maximum length of ?1:');
        this.minLength = new FieldRule<number>(null, '?0: is shorter than the minimum length of ?1:');
        if (!_.isNil(message)){
            this.dataTypeMessage = message;
        } else {
            this.dataTypeMessage = '?0: does not match the specified data type (String)';
        }
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
    isRequired(message: string): IStringFluent
    isRequired(message?: string): IStringFluent {
        super.isRequired(message);
        return this;
    }

    hasMaxLengthOf(value: number): IStringFluent;
    hasMaxLengthOf(value: number, message: string): IStringFluent;
    hasMaxLengthOf(value: number, message?: string): IStringFluent {
        this.maxLength.value = value;
        this.maxLength.setNonNullMessage(message);
        return this;
    }

    hasMinLengthOf(value: number): IStringFluent;
    hasMinLengthOf(value: number, message: string): IStringFluent;
    hasMinLengthOf(value: number, message?: string): IStringFluent {
        this.maxLength.value = value;
        this.maxLength.setNonNullMessage(message);
        return this;
    }
}

export class FieldFactory {
    public static any(defaultValue: any): IAnyFluent {
        return new AnyImpl(defaultValue);
    }

    public static int(defaultValue?: number, typeValidationMessage?: string): IIntFluent {
        return new IntImpl(defaultValue, typeValidationMessage);
    }

    public static string(defaultValue?: string, typeValidationMessage?: string): IStringFluent {
        return new StringImpl(defaultValue, typeValidationMessage);
    }
}