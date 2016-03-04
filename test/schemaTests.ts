///<reference path="../_all.d.ts"/>
import * as repongo from '../index';
import * as should from 'should';

describe('With an empty Repository,', () => {

    var db = new repongo.Connection('mongodb://localhost/my_database');

    describe('And a defined schema', () => {
        var catFields = [
            {fieldName: 'name', isRequired: true},
            {fieldName: 'age', typeValidator: repongo.validators.int()}
        ];
        var schemaOptions = {
            catalogName: 'cats',
            fields: catFields
        };

        var catSchema = repongo.schemaFactory(schemaOptions);
        var repoUnderTest = db.createRepository(catSchema);

        beforeEach(() => {
            repoUnderTest.clear();
        });

        describe('when an invalid cat is inserted', () => {
            it('causes an error', (done: () => void) => {
                var badCat = {age: 'xyz'};
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