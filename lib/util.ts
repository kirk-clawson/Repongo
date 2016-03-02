///<reference path="../typings/node.d.ts"/>

var mongo = require('mongojs');

export interface IMongoObject {
    _id: any;
    _v: string;
}

export function getIdFromString(id: string): any {
    return mongo.ObjectId(id);
}