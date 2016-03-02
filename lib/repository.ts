///<reference path="../typings/node.d.ts"/>
///<reference path="../typings/bluebird.d.ts"/>

var mongo = require('mongojs');

import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as utils from './util';
import * as Schema from "./schema";
import {IQuery} from "./queryBuilder";

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

    getAll(): IRepositoryPromise<any[]> {
        return this._promiseApi.find({}).then((doc) => this._schema.m2j(doc));
    }

    get(id: string): IRepositoryPromise<any> {
        return this._promiseApi
            .findOne({ _id: utils.getIdFromString(id) })
            .then((doc) => this._schema.m2j(doc));
    }

    query(query: IQuery): IRepositoryPromise<any[]> {
        return this._promiseApi.find(query.encode()).then((doc) => this._schema.m2j(doc));
    }

    save(item: any): IRepositoryPromise<any> {
        // assume that item is singular
        var result = this._schema.j2m(item);
        if (result && result._validationResult && result._validationResult.isValid) {
            delete result._validationResult; // don't want to persist this field in the DB
            return this._promiseApi.save(result).then((doc) => this._schema.m2j(doc));
        } else {
            return Promise.reject({ message: 'Item failed schema validation check.', data: result});
        }
    }

    delete(id: string): IRepositoryPromise<any> {
        return undefined;
    }

    clear(): void {
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