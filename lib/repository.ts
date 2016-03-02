///<reference path="../typings/bluebird.d.ts"/>

import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as Schema from "./schema";
import {IQuery} from "./queryBuilder";
import {IMongoObject, getIdFromString} from "./util";

export interface IRepositoryPromise<T> {
    then<U>(onFulfill: (value: T) => U | PromiseLike<U>, onReject?: (error: any) => U | PromiseLike<U>, onProgress?: (note: any) => any): IRepositoryPromise<U>;
    catch(onReject?: (error: any) => T | PromiseLike<T> | void | PromiseLike<void>): IRepositoryPromise<T>;
    finally<U>(handler: () => U | PromiseLike<U>): IRepositoryPromise<T>;
}

export interface IRepository {
    getAll(): IRepositoryPromise<any[]>;
    get(id: string): IRepositoryPromise<any>;
    query(query: IQuery): IRepositoryPromise<any[]>;
    save(item: any): IRepositoryPromise<any>
    delete(id: string): IRepositoryPromise<void>;
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
        }
    }

    public getAll(): IRepositoryPromise<any[]> {
        return this._promiseApi.find({}).then((doc) => this._schema.m2j(doc));
    }

    public get(id: string): IRepositoryPromise<any> {
        return this._promiseApi
            .findOne({ _id: getIdFromString(id) })
            .then((doc) => this._schema.m2j(doc));
    }

    public query(query: IQuery): IRepositoryPromise<any[]> {
        return this._promiseApi.find(query.encode()).then((doc) => this._schema.m2j(doc));
    }

    public save(item: any): IRepositoryPromise<any> {
        // assume that item is singular
        var result = this._schema.j2m(item);
        var validResult;
        if (_.isArray(result)) {
            validResult = [];
            for (var i = 0; i < result.length; ++i){
                if(result[i] && result[i]._validationResult && result[i]._validationResult.isValid) {
                    delete result[i]._validationResult;
                    validResult.push(result);
                }
            }
            return this._promiseApi.save(validResult).then((doc) => this._schema.m2j(doc));
        } else {
            validResult = <IMongoObject>result;
            if (validResult && validResult._validationResult && validResult._validationResult.isValid) {
                delete validResult._validationResult; // don't want to persist this field in the DB
                return this._promiseApi.save(validResult).then((doc) => this._schema.m2j(doc));
            } else {
                return Promise.reject({ message: 'Item failed schema validation check.', data: result});
            }
        }
    }

    public delete(id: string): IRepositoryPromise<any> {
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