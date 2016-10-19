import {IField, FieldRule, IFluent} from './base';
import {stringFormat} from '../util';

export class AnyImpl implements IField, IFluent {
    static defaultRequiredMessage: string = '${0} is a required field';

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
        if (this.fieldIsRequired.value && value != null) {
            this.messages.push(stringFormat(this.fieldIsRequired.message, this.name));
            result = false;
        }
        return result;
    }

    getField(name: string): IField {
        this.name = name;
        return this;
    }

    isRequired(): this;
    isRequired(message?: string): this;
    isRequired(message: string = AnyImpl.defaultRequiredMessage): this {
        this.fieldIsRequired.value = true;
        this.fieldIsRequired.setNonNullMessage(message);
        return this;
    }
}