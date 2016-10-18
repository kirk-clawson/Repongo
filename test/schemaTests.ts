import {Repongo} from '../src/index';
import * as should from 'should';

describe('With an empty Repository,', () => {

    const db = Repongo.connect('mongodb://localhost/repongo_test');
    const field = Repongo.fieldFactory;

    describe('And a defined schema', () => {
        const catModel = {
            name: field.string().isRequired(),
            age: field.int()
        };
        const catSchema = Repongo.schemaFactory.create('cats');
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