// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the base.spec.js module.
//
// @module base.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var expect = require('chai').expect;

var TPGroup = require('../src/group').default;

// ---------------------------------------------------------------------------------------------------------------------

describe('TPGroup', () =>
{
    var baseInst;
    beforeEach(() =>
    {
        baseInst = new TPGroup('test', [
            '*/canView',
            'Default/*',
            'Other/canEdit'
        ]);
    });

    it('has a `name` property', () =>
    {
        expect(baseInst.name).to.equal('test');
    });

    it('has a `permissions` list', () =>
    {
        expect(baseInst.permissions.length).to.equal(3);
    });

    describe('#hasPerm()', () =>
    {
        it('matches exact permissions', () =>
        {
            expect(baseInst.hasPerm('canEdit', 'Other')).to.be.true;
        });

        it('fails to match missing permissions', () =>
        {
            expect(baseInst.hasPerm('canEdit', 'DNE')).to.be.false;
            expect(baseInst.hasPerm('canWrite', 'Other')).to.be.false;
        });

        it('`*` matches any permission', () =>
        {
            expect(baseInst.hasPerm('canWrite', 'Default')).to.be.true;
        });

        it('`*` matches any object', () =>
        {
            expect(baseInst.hasPerm('canView', 'DNE')).to.be.true;
        });
    });

    describe('#addPerm()', () =>
    {
        it('can add permissions', () =>
        {
            baseInst.addPerm('canWrite', 'Other');
            expect(baseInst.hasPerm('canWrite', 'Other')).to.be.true;
        });
    });

    describe('#removePerm', () =>
    {
        it('can remove permissions', () =>
        {
            baseInst.removePerm('canEdit', 'Other');
            expect(baseInst.hasPerm('canEdit', 'Other')).to.be.false;
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
