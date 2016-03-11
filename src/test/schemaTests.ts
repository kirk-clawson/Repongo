import * as repongo from '../index';
import * as should from 'should';

describe('With an empty Repository,', () => {

    const db = new repongo.Connection('mongodb://localhost/my_database');
    const field = repongo.fieldFactory;

    describe('And a defined schema', () => {
        const catModel = {
            name: field.string().isRequired(),
            age: field.int()
        };
        const catSchema = repongo.schemaFactory.create('cats');
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