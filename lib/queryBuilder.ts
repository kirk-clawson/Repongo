import {ISchema} from './schema';

interface IQuery {
    encode(): any;
}

class Builder {
    constructor(schema: ISchema) {
    }
}

export { IQuery };