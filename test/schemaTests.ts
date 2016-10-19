import * as should from 'should';

import {Connection} from '../src/index';
import {FieldFactory} from '../src/lib/fields/fieldFactory';
import {ISchema, SchemaFactory} from '../src/lib/schema';

describe('With an empty Repository,', () => {

    const db: Connection = new Connection('mongodb://localhost/repongo_test');

    describe('And a defined schema', () => {
        const catModel = {
            name: FieldFactory.string().isRequired(),
            age: FieldFactory.int()
        };
        const catSchema: ISchema = SchemaFactory.create('cats');
        catSchema.addModel(catModel);

        const repoUnderTest = db.createRepository(catSchema);

        beforeEach(() => {
            repoUnderTest.clear();
        });

        describe('when an invalid cat is inserted', () => {
            it('causes an error', (done: () => void) => {
                const badCat = {age: 'xyz'};
                repoUnderTest.save(badCat)
                    .catch((err: any) => {
                        should.exist(err);
                        err.message.should.not.equal('');
                        should.exist(err.data);
                        should.exist(err.data._validationResult);
                        err.data._validationResult.isValid.should.equal(false);
                        done();
                    });
            });
        });
    });
});