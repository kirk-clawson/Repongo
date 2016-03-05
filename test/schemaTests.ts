///<reference path="../_all.d.ts"/>
import {Connection as Repongo, Fields} from '../index';
import * as should from 'should';

describe('With an empty Repository,', () => {

    var db = new Repongo('mongodb://localhost/my_database');

    describe('And a defined schema', () => {
        let catSchema = Repongo.createSchema('cats');
        catSchema.addField(Fields.string('name').isRequired());
        catSchema.addField(Fields.int('age'));

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