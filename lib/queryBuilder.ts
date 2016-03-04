///<reference path="../_all.d.ts"/>
import * as schema from './schema';

export interface IQuery {
    encode(): any;
}

export class Builder {
    constructor(schema: schema.ISchema) {
    }
}
