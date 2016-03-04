///<reference path="lib/_all.d.ts"/>
var mongo = require('mongojs');

import * as _ from 'lodash';
import * as _schema from './lib/schema';
import * as repository from './lib/repository';
import {factory} from './lib/validators';
import {create} from './lib/schema';

class Connection {
    private _db: any;
    constructor(connectionString: string){
        this._db = mongo(connectionString);
    }

    createRepository(schema: string | _schema.ISchema): repository.IRepository {
        return repository.create(schema, this._db);
    }
}

export {Connection, factory as validators, create as schemaFactory};