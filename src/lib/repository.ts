import _ = require('lodash');
import Promise = require('bluebird');

import {ISchema} from './schema';
import {IQuery} from './queryBuilder';
import {SchemaFactory} from './schema';
import {IMongoObject, getIdFromString} from './util';

export interface IRepository<TModel> {
    getAll(): Promise<TModel[]>;
    get(id: string): Promise<TModel>;
    query(query: IQuery): Promise<TModel[]>;
    save(item: TModel): Promise<TModel>;
    remove(id: string): Promise<void>;
    clear(): void;
}

interface IPromisifiedApi {
    find: Function,
    findOne: Function,
    save: Function,
    remove: Function
}

class Repository<TModel> implements IRepository<TModel> {
    private _promiseApi: IPromisifiedApi;
    private _schema: ISchema;
    private _dbCollection: any;

    constructor(schema: ISchema, db: any) {
        this._schema = schema;
        this._dbCollection = db.collection(this._schema.catalogName);

        const contextOpts = {
            context: this._dbCollection
        };
        this._promiseApi = {
            find: Promise.promisify(this._dbCollection.find, contextOpts),
            findOne: Promise.promisify(this._dbCollection.findOne, contextOpts),
            save: Promise.promisify(this._dbCollection.save, contextOpts),
            remove: Promise.promisify(this._dbCollection.remove, contextOpts)
        };
    }

    public getAll(): Promise<TModel[]> {
        return this._promiseApi.find({}).then((doc: any) => this._schema.m2j(doc));
    }

    public get(id: string): Promise<TModel> {
        return this._promiseApi
            .findOne({_id: getIdFromString(id)})
            .then((doc: any) => this._schema.m2j(doc));
    }

    public query(query: IQuery): Promise<TModel[]> {
        return this._promiseApi.find(query.encode()).then((doc: any) => this._schema.m2j(doc));
    }

    public save(item: TModel): Promise<TModel> {
        // assume that item is singular
        const result = this._schema.j2m(item);
        let validResult: any;
        if (result !== undefined && _.isArray(result)) {
            validResult = [];
            for (let i = 0; i < result.length; ++i) {
                let currentResult: IMongoObject = result[i];
                if (currentResult && currentResult.validationResult && currentResult.validationResult.isValid) {
                    delete currentResult.validationResult; // don't want to persist this field in the DB
                    validResult.push(currentResult);
                }
            }
            return this._promiseApi.save(validResult).then((doc: any) => this._schema.m2j(doc));
        } else {
            validResult = <IMongoObject>result;
            if (validResult && validResult.validationResult && validResult.validationResult.isValid) {
                delete validResult.validationResult; // don't want to persist this field in the DB
                return this._promiseApi.save(validResult).then((doc: any) => this._schema.m2j(doc));
            } else {
                return Promise.reject({message: 'Item failed schema validation check.', data: result});
            }
        }
    }

    public remove(id: string): Promise<void> {
        return this._promiseApi.remove({_id: getIdFromString(id)}, {justOne: true});
    }

    public clear(): void {
        this._dbCollection.remove({});
    }
}

export class RepositoryFactory {

    //public static create<TModel>(schema: string, db: any): IRepository<TModel>;
    //public static create<TModel>(schema: ISchema, db: any): IRepository<TModel>;
    public static create<TModel>(schema: string | ISchema, db: any): IRepository<TModel> {
        if (_.isString(schema)) {
            const tempSchema = SchemaFactory.create(schema, true);
            return new Repository<TModel>(tempSchema, db);
        } else {
            return new Repository<TModel>(schema, db);
        }
    }

}