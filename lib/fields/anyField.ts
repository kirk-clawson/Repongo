import * as _ from 'lodash';

import {IField, IFluentValidator, FieldRule} from './base';
import {stringFormat} from '../util';

interface IAnyFluent extends IFluentValidator<IAnyFluent> {
}

class AnyImpl implements IField, IAnyFluent {
    static defaultRequiredMessage: string = '?0: is a required field';

    name: string;
    defaultValue: any;
    fieldIsRequired: FieldRule<boolean>;
    messages: string[];

    constructor(defaultValue: any) {
        this.defaultValue = defaultValue;
        this.fieldIsRequired = new FieldRule<boolean>(false, AnyImpl.defaultRequiredMessage);
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
    isRequired(message?: string): IAnyFluent;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): IAnyFluent {
        this.fieldIsRequired.value = true;
        this.fieldIsRequired.setNonNullMessage(message);
        return this;
    }
}

export { IAnyFluent, AnyImpl };