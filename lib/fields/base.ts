///<reference path="../../_all.d.ts"/>
import * as _ from 'lodash';

interface IField {
    name: string;
    defaultValue: any;
    messages: string[];
    isValid(value: any): boolean;
}

interface IFluent {
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

export { IField, IFluent, IFluentValidator, FieldRule };