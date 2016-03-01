/// <reference path="typings/lodash.d.ts" />
import * as _ from 'lodash';

interface IValidator {
    validate(value: any): boolean;
    convert(value: any): any;
}

interface IValidatorOptions {
    allowNull: boolean;
}

interface IIntValidatorOptions extends IValidatorOptions {
    max?: number;
    min?: number;
    floorMax?: boolean;
    ceilMin?: boolean;
}

interface IStringValidatorOptions extends IValidatorOptions {
    maxLength: number;
    minLength: number;
    allowEmpty: boolean;
    trimToMax: boolean;
    padToMin: boolean;
    continuationChar: string;
    padChar: string;
    padAtEnd: boolean;
}

class Any implements IValidator {

    constructor(private options: IValidatorOptions){}

    validate(value:any):boolean {
        return (value !== undefined && (this.options.allowNull || value != null));
    }

    convert(value:any):any {
        if (_.isNil(value)) {
            if (this.options.allowNull)
                return null;
            throw 'Can\'t convert null or undefined any() type to a non-null value.'
        }
        return value;
    }
}