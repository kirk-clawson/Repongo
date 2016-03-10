import {Connection} from '../index';
import * as should from 'should';

describe('With an empty Repository,', () => {

    const db = new Connection('mongodb://localhost/repongo_test');
    const repoUnderTest = db.createRepository('cats');

    describe('when a cat is inserted', () => {
        it('Inserts one record that can be read back', (done: () => void) => {
            let id: string;
            repoUnderTest.save({name: 'Mr. Puggles', age: 6})
                .then((result: any) => {
                    should.exist(result);
                    result.should.have.property('_id');
                    id = result._id;
                    return repoUnderTest.getAll();
                })
                .then((result: any) => {
                    should.exist(result);
                    result.length.should.equal(1);
                    id.should.equal(result[0]._id);
                    done();
                })
                .catch((err: any) => {
                    should.not.exist(err);
                    done();
                });
        });
    });

    afterEach(() => {
        repoUnderTest.clear();
    });
});

