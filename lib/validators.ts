///<reference path="_all.d.ts"/>
import * as _ from 'lodash';

export interface IValidator {
    validate(value: any): boolean;
    convert(value: any): any;
}

interface IValidatorOptions {
    allowNull: boolean;
}

interface IAnyValidatorOptions extends IValidatorOptions {
    defaultValue?: any;
}

interface IIntValidatorOptions extends IValidatorOptions {
    defaultValue?: number;
    max?: number;
    min?: number;
    floorMax?: boolean;
    ceilMin?: boolean;
}

interface IStringValidatorOptions extends IValidatorOptions {
    defaultValue?: string;
    maxLength: number;
    minLength: number;
    allowEmpty: boolean;
    trimToMax: boolean;
    padToMin: boolean;
    continuationChar: string;
    padChar: string;
    padAtEnd: boolean;
}

class AnyValidator implements IValidator {

    private _options: IAnyValidatorOptions = {
        defaultValue: null,
        allowNull: true
    };

    constructor(options?: IAnyValidatorOptions) {
        _.assignIn(this._options, options || {});
    }

    validate(value: any): boolean {
        // undefined values get caught at the object level, not the field level
        return this._options.allowNull || (value != null);
    }

    convert(value: any): any {
        if (_.isNil(value)) {
            if (this._options.allowNull) {
                return null;
            } else {
                return this._options.defaultValue;
            }
        }
        return value;
    }
}

class IntValidator implements IValidator {

    private _options: IIntValidatorOptions = {
        defaultValue: 0,
        allowNull: false,
        max: null,
        min: null,
        floorMax: false,
        ceilMin: false
    };

    constructor(options?: IIntValidatorOptions) {
        _.assignIn(this._options, options || {});
    }

    validate(value: any): boolean {
        if (_.isSafeInteger(value)) {
            var maxValid = (_.isNil(this._options.max) || (this._options.max >= value));
            var minValid = (_.isNil(this._options.min) || (this._options.min <= value));
            return maxValid && minValid;
        }
        return this._options.allowNull || (value != null);
    }

    convert(value: any): number {
        if (_.isNil(value)) {
            if (this._options.allowNull) {
                return null;
            } else {
                return this._options.defaultValue;
            }
        }
        var result = _.toSafeInteger(value); // will return 0 for null/undef
        if (this._options.floorMax && !_.isNil(this._options.max))
            result = Math.min(this._options.max, value);
        if (this._options.ceilMin && !_.isNil(this._options.min))
            result = Math.max(this._options.min, value);
        return result;
    }
}

class StringValidator implements IValidator {

    private _options: IStringValidatorOptions = {
        defaultValue: '',
        allowNull: false,
        maxLength: null,
        minLength: null,
        allowEmpty: true,
        trimToMax: false,
        padToMin: false,
        continuationChar: '…',
        padChar: ' ',
        padAtEnd: false
    };

    constructor(options?: IStringValidatorOptions) {
        _.assignIn(this._options, options || {});
    }

    validate(value: any): boolean {
        var maxValid = true;
        var minValid = true;
        var newValue = value;
        if (value == null && !this._options.allowNull) {
            newValue = this._options.defaultValue;
        }
        if (_.isString(newValue)) {
            if (!_.isNil(this._options.maxLength)) {
                maxValid = (this._options.maxLength >= newValue.length);
            }
            if (!_.isNil(this._options.minLength)) {
                minValid = (this._options.minLength <= newValue.length) || (newValue.length == 0 && this._options.allowEmpty);
            }
            return maxValid && minValid;
        }

        return false;
    }

    convert(value: any): any {
        // convert always assumes that validation has passed, i.e. defaultValue doesn't break anything
        if (_.isNil(value)) {
            if (this._options.allowNull) {
                return null;
            } else {
                return this._options.defaultValue;
            }
        }
        var result = _.toString(value); // will return '' for null/undef
        if (!_.isNil(this._options.maxLength) && this._options.trimToMax) {
            var loOpts = {
                length: this._options.maxLength,
                omission: this._options.continuationChar || ''
            };
            result = _.truncate(result, loOpts);
        }
        if (!_.isNil(this._options.minLength) && this._options.padToMin) {
            if (!((this._options.minLength <= value.length) || (value.length == 0 && this._options.allowEmpty))) {
                if (this._options.padAtEnd) {
                    result = _.padEnd(result, this._options.minLength, this._options.padChar);
                } else {
                    result = _.padStart(result, this._options.minLength, this._options.padChar);
                }
            }
        }
        return result;
    }
}

export class factory {
    static any(allowNull: boolean = true): IValidator {
        return new AnyValidator({allowNull: allowNull});
    }

    static int(options: IIntValidatorOptions): IValidator {
        return new IntValidator(options);
    }

    static string(options: IStringValidatorOptions): IValidator {
        return new StringValidator(options);
    }
}

