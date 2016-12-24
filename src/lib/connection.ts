    /**
     * Created by clawsonk on 10/19/2016.
     */
import mongo = require('mongojs');
import {IRepository, RepositoryFactory} from "./repository";
import {ISchema} from "./schema";

export class Connection {
    private _db: any;

    constructor(connectionString: string){
        this._db = mongo(connectionString);
    }

    createRepository<TModel>(schema: string | ISchema): IRepository<TModel> {
        return RepositoryFactory.create<TModel>(schema, this._db);
    }
}