var mongo = require('mongojs');

import {FieldFactory} from './lib/fields/factory';
import {ISchema, SchemaFactory} from './lib/schema';
import {RepositoryFactory, IRepository} from './lib/repository';


class Connection {
    private _db: any;

    constructor(connectionString: string){
        this._db = mongo(connectionString);
    }

    createRepository(catalog: string): IRepository;
    createRepository(schema: ISchema): IRepository;
    createRepository(schema: any): IRepository {
        return RepositoryFactory.create(schema, this._db);
    }
}

export {Connection, FieldFactory as fieldFactory, SchemaFactory as schemaFactory};