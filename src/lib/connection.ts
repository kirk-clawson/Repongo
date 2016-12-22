    /**
     * Created by clawsonk on 10/19/2016.
     */
import mongo from 'mongojs';
import {IRepository, RepositoryFactory} from "./repository";
import {ISchema} from "./schema";

export class Connection {
    private _db: any;

    constructor(connectionString: string){
        this._db = mongo(connectionString);
    }

    createRepository<TModel>(catalog: string): IRepository<TModel>;
    createRepository<TModel>(schema: ISchema): IRepository<TModel>;
    createRepository<TModel>(schema: any): IRepository<TModel> {
        return RepositoryFactory.create<TModel>(schema, this._db);
    }
}