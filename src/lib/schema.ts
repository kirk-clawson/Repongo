import _ = require('lodash');
import {IMongoObject, getIdFromString} from './util';
import {IFluent, IField} from "./fields/base";

export interface ISchema {
    catalogName: string;
    validate(object: any): void;
    j2m(json: any): IMongoObject | IMongoObject[];
    m2j(bson: IMongoObject | IMongoObject[]): any;
    addField(fieldName: string, fieldDefinition: IFluent): void;
    addModel(model: any): void;
}

class Schema implements ISchema {
    public catalogName: string;
    private allowExtraJsonFields: boolean;
    private fields: IField[];

    constructor(catalogName: string);
    constructor(catalogName: string, allowExtraJsonFields?: boolean)
    constructor(catalogName: string, allowExtraJsonFields: boolean = true) {
        this.catalogName = catalogName;
        this.allowExtraJsonFields = allowExtraJsonFields;
        this.fields = [];
    }

    public addField(fieldName: string, fieldDefinition: IFluent): void {
        if (_.isNil(fieldName)) throw 'Cannot add an unnamed field to the schema';
        if (_.isNil(fieldDefinition)) throw 'Cannot add a null or undefined field to the schema';
        this.fields.push(fieldDefinition.getField(fieldName));
    }

    public addModel(model: any): void {
        if (_.isNil(model)) throw 'Cannot add a null or undefined model to the schema';
        for (let field in model) {
            if (model.hasOwnProperty(field)) {
                let prop: IFluent = model[field];
                if (prop.getField !== undefined && typeof prop.getField === 'function') {
                    let fieldActual: IField = prop.getField(field);
                    this.fields.push(fieldActual);
                }
            }
        }
    }

    public validate(object: any): void {
        if (_.isNil(object)) {
            throw 'Cannot validate null or undefined.';
        }

        const result: any = {
            isValid: true,
        };
        const definedFields: string[] = [];

        // loop through the defined fields
        for (let i = 0; i < this.fields.length; ++i) {
            const currentField: IField = this.fields[i];
            // so we can back track when we check for extra JSON fields
            definedFields.push(currentField.name);
            // do the actual validation on the object's field
            if (!currentField.isValid(object[currentField.name])) {
                result[currentField.name] = currentField.messages.concat([]);
                result.isValid = false;
                currentField.messages.length = 0;
            }
        }

        if (!this.allowExtraJsonFields) {
            for (let fn in object) {
                //noinspection JSUnfilteredForInLoop
                if (fn.substring(0, 1) !== '_' && !_.includes(definedFields, fn)) {
                    result.isValid = false;
                    //noinspection JSUnfilteredForInLoop
                    result[fn] = ['Extraneous field ' + fn + ' is not defined by the schema']
                }
            }
        }

        // attach the validation result
        object.validationResult = result;
    }

    public j2m(json: any): IMongoObject | IMongoObject[] {
        let bson: any = null;
        if (_.isArray(json)) {
            bson = [];
            for (let i = 0; i < json.length; ++i) {
                const current = <any>json[i];
                this.validate(current);
                if (current.validationResult.isValid) {
                    bson.push(Schema.convertJsonToBson(current));
                } else {
                    bson.push(current);
                }
            }
        } else {
            this.validate(json);
            if (json.validationResult.isValid) {
                bson = Schema.convertJsonToBson(json);
            } else {
                bson = json;
            }
        }
        return bson;
    }

    public m2j(bson: IMongoObject | IMongoObject[]): any {
        let json: any = null;
        if (_.isArray(bson)) {
            json = [];
            for (let i = 0; i < bson.length; i++) {
                const current = Schema.convertBsonToJson(bson[i]);
                this.validate(current);
                if (current.validationResult.isValid) {
                    json.push(current);
                }
            }
        } else {
            let current = Schema.convertBsonToJson(bson);
            this.validate(current);
            if (current.validationResult.isValid) {
                json = current;
            }
        }
        return json;
    }

    private static convertJsonToBson(validatedJson: any): IMongoObject {
        const result = validatedJson;
        // validation check is done before we get here
        if (validatedJson._id && _.isString(validatedJson._id) && validatedJson._id != '') {
            validatedJson._id = getIdFromString(validatedJson._id); //convert _id from string to mongo id object
        }
        // TODO: data type conversion
        return result;
    }

    private static convertBsonToJson(bson: IMongoObject): any {
        // assumes bson object will always have an _id property, which will always be true with a doc returned from mongo
        const json = bson;
        json._id = bson._id.toString(); // convert mongo id object to string
        return json;
    }
}

export class SchemaFactory {
    public static create(catalogName: string): ISchema;
    public static create(catalogName: string, allowExtraFields?: boolean): ISchema;
    public static create(catalogName: string, allowExtraFields: boolean = true): ISchema {
        return new Schema(catalogName, allowExtraFields);
    }
}