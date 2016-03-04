///<reference path="../_all.d.ts"/>
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as Schema from './schema';
import {IQuery} from './queryBuilder';
import {IMongoObject, getIdFromString} from './util';

export interface IRepository {
    getAll(): Promise<any[]>;
    get(id: string): Promise<any>;
    query(query: IQuery): Promise<any[]>;
    save(item: any): Promise<any>;
    delete(id: string): Promise<void>;
    clear(): void;
}

class Repository implements IRepository {
    private _promiseApi: any;
    private _schema: Schema.ISchema;
    private _dbCollection: any;

    constructor(schema: Schema.ISchema, db:any) {
        this._schema = schema;
        this._dbCollection = db.collection(this._schema.catalogName);

        var contextOpts = {
            context: this._dbCollection
        };
        this._promiseApi = {
            find: Promise.promisify(this._dbCollection.find, contextOpts),
            findOne: Promise.promisify(this._dbCollection.findOne, contextOpts),
            save: Promise.promisify(this._dbCollection.save, contextOpts),
            remove: Promise.promisify(this._dbCollection.remove, contextOpts)
        };
    }

    public getAll(): Promise<any[]> {
        return this._promiseApi.find({}).then((doc: any) => this._schema.m2j(doc));
    }

    public get(id: string): Promise<any> {
        return this._promiseApi
            .findOne({ _id: getIdFromString(id) })
            .then((doc: any) => this._schema.m2j(doc));
    }

    public query(query: IQuery): Promise<any[]> {
        return this._promiseApi.find(query.encode()).then((doc: any) => this._schema.m2j(doc));
    }

    public save(item: any): Promise<any> {
        // assume that item is singular
        var result = this._schema.j2m(item);
        var validResult: any;
        if (_.isArray(result)) {
            validResult = [];
            for (var i = 0; i < result.length; ++i){
                if(result[i] && result[i]._validationResult && result[i]._validationResult.isValid) {
                    delete result[i]._validationResult; // don't want to persist this field in the DB
                    validResult.push(result);
                }
            }
            return this._promiseApi.save(validResult).then((doc: any) => this._schema.m2j(doc));
        } else {
            validResult = <IMongoObject>result;
            if (validResult && validResult._validationResult && validResult._validationResult.isValid) {
                delete validResult._validationResult; // don't want to persist this field in the DB
                return this._promiseApi.save(validResult).then((doc:any) => this._schema.m2j(doc));
            } else {
                return Promise.reject({ message: 'Item failed schema validation check.', data: result});
            }
        }
    }

    //noinspection ReservedWordAsName
    public delete(id: string): Promise<any> {
        return undefined;
    }

    public clear(): void {
        this._dbCollection.remove({});
    }
}

export function create(schema: string | Schema.ISchema, db: any) : IRepository {
    if (_.isString(schema)) {
        var tempSchema = Schema.create(schema);
        return new Repository(tempSchema, db);
    } else {
        return new Repository(schema, db);
    }
}