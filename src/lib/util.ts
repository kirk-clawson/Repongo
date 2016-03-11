import * as _ from 'lodash';

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

function stringFormat(message: string, ...substitutions: any[]): string {
    let result = message;
    for (let i = 0; i < substitutions.length; ++i) {
        let token = '${' + i + '}';
        result = _.replace(result, token, substitutions[i])
    }
    return result;
}

export { stringFormat, getIdFromString, IMongoObject };