import * as should from 'should';

import { Connection, FieldFactory, SchemaFactory, ISchema, IRepository, IMongoObject } from '../src/main';

interface ICatEntity extends IMongoObject {
    name: string | null; //only added |null so I could force a validation error
    age: number;
}

describe('With an empty Repository,', () => {

    const db: Connection = new Connection('mongodb://localhost/repongo_test');

    describe('And a defined schema', () => {
        // note that catModel must not implement the ICatEntity interface
        // these properties are of type FieldDefinition<T>, which has nothing to do with
        // the ultimate data returned by the repository
        const catModel = {
            name: FieldFactory.string().isRequired(),
            age: FieldFactory.int()
        };
        const catSchema: ISchema = SchemaFactory.create('cats');
        catSchema.addModel(catModel);

        const repoUnderTest: IRepository<ICatEntity> = db.createRepository<ICatEntity>(catSchema);

        beforeEach(() => {
            repoUnderTest.clear();
        });

        describe('when an invalid cat is inserted', () => {
            it('causes an error', (done: () => void) => {
                const badCat = { name: null, age: 55.3 };
                repoUnderTest.save(badCat)
                    .catch((err: any) => {
                        should.exist(err);
                        err.message.should.not.equal('');
                        should.exist(err.data);
                        should.exist(err.data.validationResult);
                        err.data.validationResult.isValid.should.equal(false);
                        done();
                    });
            });
        });
    });
});