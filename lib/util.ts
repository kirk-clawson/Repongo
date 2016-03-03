///<reference path="ref.d.ts"/>
var mongo = require('mongojs');

export interface IValidationStatus {
    isValid: boolean;
}

export interface IMongoObject {
    _id: any;
    _v: string;
    _validationResult: IValidationStatus;
}

export function getIdFromString(id: string): any {
    return mongo.ObjectId(id);
}