/// <reference path="../typings/lodash.d.ts" />
import * as _ from 'lodash';

module validators {

    export interface IValidator {
        validate(value: any): boolean;
        convert(value: any): any;
    }

    interface IValidatorOptions {
        allowNull: boolean;
    }

    export interface IIntValidatorOptions extends IValidatorOptions {
        max?: number;
        min?: number;
        floorMax?: boolean;
        ceilMin?: boolean;
    }

    export interface IStringValidatorOptions extends IValidatorOptions {
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

        private _options: IValidatorOptions = {
            allowNull: false
        };

        constructor(options?: IValidatorOptions) {
            _.assignIn(this._options, options || {});
        }

        validate(value: any): boolean {
            return (value !== undefined && (this._options.allowNull || value != null));
        }

        convert(value: any): any {
            if (_.isNil(value)) {
                if (this._options.allowNull)
                    return null;
                throw 'Can\'t convert null or undefined any() type to a non-null value.'
            }
            return value;
        }
    }

    class IntValidator implements IValidator {

        private _options: IIntValidatorOptions = {
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
            return (this._options.allowNull && value == null);
        }

        convert(value: any): any {
            if (_.isNil(value) && this._options.allowNull) return null;
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
            if (_.isString(value)) {
                if (!_.isNil(this._options.maxLength)) {
                    maxValid = (this._options.maxLength >= value.length);
                }
                if (!_.isNil(this._options.minLength)) {
                    minValid = (this._options.minLength <= value.length) || (value.length == 0 && this._options.allowEmpty);
                }
                return maxValid && minValid;
            }
            return (!!this._options.allowNull && (value == null));
        }

        convert(value: any): any {
            if (_.isNil(value) && this._options.allowNull) return null;
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
        static any(allowNull: boolean) : IValidator {
            return new AnyValidator({ allowNull: allowNull});
        }
        static int(options: IIntValidatorOptions): IValidator {
            return new IntValidator(options);
        }
        static string(options: IStringValidatorOptions) : IValidator {
            return new StringValidator(options);
        }
    }

}

