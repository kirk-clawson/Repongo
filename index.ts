///<reference path="_all.d.ts"/>
var mongo = require('mongojs');

import {IAnyFluent, IIntFluent, IStringFluent, FieldFactory} from './lib/fields';
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

    static createSchema(catalogName: string): ISchema;
    static createSchema(catalogName: string, allowExtraJsonFields: boolean): ISchema;
    static createSchema(catalogName: string, allowExtraJsonFields?: boolean): ISchema {
        return SchemaFactory.create(catalogName, allowExtraJsonFields);
    }
}

class Fields {
    public static any(name: string, defaultValue: any): IAnyFluent {
        return FieldFactory.any(name, defaultValue);
    }

    public static int(name: string, defaultValue?: number, typeValidationMessage?: string): IIntFluent {
        return FieldFactory.int(name, defaultValue, typeValidationMessage);
    }

    public static string(name: string, defaultValue?: string, typeValidationMessage?: string): IStringFluent {
        return FieldFactory.string(name, defaultValue, typeValidationMessage);
    }
}

export {Connection, Fields}