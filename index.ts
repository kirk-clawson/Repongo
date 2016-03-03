///<reference path="lib/ref.d.ts"/>
var mongo = require('mongojs');

import * as _ from 'lodash';
import * as _schema from './lib/schema';
import * as repository from './lib/repository';
import {factory} from './lib/validators';

class Repongo {
    private _db: any;
    constructor(connectionString: string){
        this._db = mongo(connectionString);
    }

    createRepository(schema: string | _schema.ISchema): repository.IRepository {
        return repository.create(schema, this._db);
    }

    static createSchema(options: _schema.ISchemaOptions) : _schema.ISchema {
        return _schema.create(options);
    }
}

export {Repongo as default, Repongo, factory as validatorFactory}