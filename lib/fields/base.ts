///<reference path="../../_all.d.ts"/>
import * as _ from 'lodash';

export interface IField {
    name: string;
    defaultValue: any;
    messages: string[];
    isValid(value: any): boolean;
}

export interface IFluent {
    getField(name: string): IField;
}

export interface IFluentValidator<TDerived> extends IFluent {
    isRequired(message?: string): TDerived
}

export class FieldRule<TRuleType> {
    constructor(public value: TRuleType, public message: string) {
    }

    setNonNullMessage(message?: string): void {
        if (!_.isNil(message)) {
            this.message = message;
        }
    }
}
