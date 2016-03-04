///<reference path="_all.d.ts"/>
import * as validators from './validators';
import * as utils from './util';
import * as _ from 'lodash';

interface IField {
    fieldName: string;
    isRequired?: boolean;
    requiredMessage?: string;
    typeValidator?: validators.IValidator;
    typeMessage?: string;
    customValidator?: (value: any) => string | string[];
}

export interface ISchemaOptions {
    catalogName: string;
    allowExtraJsonFields?: boolean;
    fields?: IField[];
}

export interface ISchema {
    catalogName: string;
    validate(object: any): void;
    j2m(json: any): utils.IMongoObject | utils.IMongoObject[];
    m2j(bson: utils.IMongoObject | utils.IMongoObject[]): any;
}

var defaultField: IField = {
    fieldName: null,
    isRequired: false,
    requiredMessage: ':? is required',
    typeValidator: validators.factory.any(true),
    typeMessage: ':? is the wrong data type',
    customValidator: function () {
        return null;
    }
};

var defaultOptions: ISchemaOptions = {
    catalogName: null,
    allowExtraJsonFields: true,
    fields: []
};


class Schema implements ISchema {
    public catalogName: string;
    private allowExtraJsonFields: boolean;
    private fields: IField[];

    constructor(init: ISchemaOptions) {
        this.catalogName = init.catalogName;
        this.allowExtraJsonFields = init.allowExtraJsonFields;
        this.fields = _.map(init.fields, _.cloneDeep);
    }

    public validate(object: any): void {
        if (_.isNil(object)) {
            throw 'Cannot validate null or undefined.';
        }

        var result : any = {
            isValid: true
        };
        var definedFields: string[] = [];

        // loop through the defined fields
        for (var i = 0; i < this.fields.length; ++i) {
            var currentField: IField = <IField>_.defaultsDeep(this.fields[i], defaultField);
            // so we can back track when we check for extra JSON fields
            definedFields.push(currentField.fieldName);
            // do the actual validation on the object's field
            var validationResults = Schema.validateField(currentField, object[currentField.fieldName]);
            if (validationResults.length > 0) {
                result.isValid = false;
                result[currentField.fieldName] = validationResults;
            }
        }

        if (!this.allowExtraJsonFields) {
            for (var fn in object) {
                //noinspection JSUnfilteredForInLoop
                if (fn.substring(0, 1) !== '_' && !_.includes(definedFields, fn)) {
                    result.isValid = false;
                    //noinspection JSUnfilteredForInLoop
                    result[fn] = ['Extraneous field ' + fn + ' is not defined by the schema']
                }
            }
        }

        // attach the validation result
        object._validationResult = result;
    }

    public j2m(json: any): utils.IMongoObject | utils.IMongoObject[] {
        var bson: any = null;
        if (_.isArray(json)) {
            bson = [];
            for (var i = 0; i < json.length; ++i) {
                var current = json[i];
                this.validate(current);
                if (current._validationResult.isValid) {
                    bson.push(Schema.convertJsonToBson(current));
                } else {
                    bson.push(current);
                }
            }
        } else {
            this.validate(json);
            if (json._validationResult.isValid) {
                bson = Schema.convertJsonToBson(json);
            } else {
                bson = json;
            }
        }
        return bson;
    }

    public m2j(bson: utils.IMongoObject | utils.IMongoObject[]): any {
        var json: any = null;
        if (_.isArray(bson)) {
            json = [];
            for (var i = 0; i < bson.length; i++) {
                let current = Schema.convertBsonToJson(bson[i]);
                this.validate(current);
                if (current._validationResult.isValid) {
                    json.push(current);
                }
            }
        } else {
            let current = Schema.convertBsonToJson(bson);
            this.validate(current);
            if (current._validationResult.isValid) {
                json = current;
            }
        }
        return json;
    }

    private static validateField(field: IField, fieldValue: any): string[] {
        var result: string[] = [];
        // Required validation
        if (field.isRequired && (fieldValue == null || fieldValue == undefined)) {
            result.push(_.replace(field.requiredMessage, ':?', field.fieldName));
        }
        // data type validation
        if (field.typeValidator && !field.typeValidator.validate(fieldValue)) {
            result.push(_.replace(field.typeMessage, ':?', field.fieldName));
        }
        // custom validator
        if (field.customValidator && typeof field.customValidator === 'function') {
            var customResult: string|string[] = field.customValidator(fieldValue);
            if (_.isArray(customResult)) {
                Array.prototype.push.apply(result, customResult);
            } else if (customResult && _.isString(customResult) && customResult != '') {
                result.push(customResult);
            }
        }
        return result;
    }

    private static convertJsonToBson(validatedJson: any): utils.IMongoObject {
        var result = validatedJson;
        // validation check is done before we get here
        if (validatedJson._id && _.isString(validatedJson._id) && validatedJson._id != '') {
            validatedJson._id = utils.getIdFromString(validatedJson._id); //convert _id from string to mongo id object
        }
        // TODO: data type conversion
        return result;
    }

    private static convertBsonToJson(bson: utils.IMongoObject): any {
        // assumes bson object will always have an _id property, which will always be true with a doc returned from mongo
        var json = bson;
        json._id = bson._id.toString(); // convert mongo id object to string
        return json;
    }
}

export function create(init: string | ISchemaOptions): ISchema {
    var opts: ISchemaOptions;
    if (_.isString(init)) {
        opts = <ISchemaOptions>_.defaultsDeep({catalogName: init}, defaultOptions);
    } else {
        opts = <ISchemaOptions>_.defaultsDeep(init, defaultOptions);
    }
    if (_.isNil(opts.catalogName) || opts.catalogName === '') {
        throw 'Cannot create a Schema instance with an empty catalog name.'
    }
    return new Schema(opts);
}