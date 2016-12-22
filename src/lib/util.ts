import * as _ from 'lodash';
import mongo from 'mongojs';

interface IValidationStatus {
    isValid: boolean;
}

interface IMongoObject {
    _id?: any;
    _v?: string;
    validationResult?: IValidationStatus;
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

export { stringFormat, getIdFromString, IValidationStatus, IMongoObject };