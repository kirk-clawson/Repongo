///<reference path="../_all.d.ts"/>
var mongo = require('mongojs');

interface IValidationStatus {
    isValid: boolean;
}

interface IMongoObject {
    _id: any;
    _v: string;
    _validationResult: IValidationStatus;
}

function getIdFromString(id: string): any {
    return mongo.ObjectId(id);
}