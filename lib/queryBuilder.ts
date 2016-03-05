///<reference path="../_all.d.ts"/>

import {ISchema} from './schema';

export interface IQuery {
    encode(): any;
}

class Builder {
    constructor(schema: ISchema) {
    }
}
