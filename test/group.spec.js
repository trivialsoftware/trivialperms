// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the base.spec.js module.
//
// @module base.spec.js
// ---------------------------------------------------------------------------------------------------------------------

const expect = require('chai').expect;

const TPGroup = require('../src/group').default;

// ---------------------------------------------------------------------------------------------------------------------

describe('Groups', () =>
{
    let groupInst, god;
    beforeEach(() =>
    {
        groupInst = new TPGroup('test', [
            '*/canView',
            'Default/*',
            'Other/canEdit'
        ]);

        god = new TPGroup('test', [
            '*/*'
        ]);
    });

    it('has a `name` property', () =>
    {
        expect(groupInst.name).to.equal('test');
    });

    it('has a `permissions` list', () =>
    {
        expect(groupInst.permissions.length).to.equal(3);
    });

    describe('#hasPerm()', () =>
    {
        it('can take the `Object/perm` form', () =>
        {
            expect(groupInst.hasPerm('Other/canEdit')).to.be.true;
        });

        it('matches exact permissions', () =>
        {
            expect(groupInst.hasPerm('canEdit', 'Other')).to.be.true;
        });

        it('fails to match missing permissions', () =>
        {
            expect(groupInst.hasPerm('canEdit', 'DNE')).to.be.false;
            expect(groupInst.hasPerm('canWrite', 'Other')).to.be.false;
        });

        it('`*` matches any permission', () =>
        {
            expect(groupInst.hasPerm('canWrite', 'Default')).to.be.true;
        });

        it('`*` matches any object', () =>
        {
            expect(groupInst.hasPerm('canView', 'DNE')).to.be.true;
        });

        it('`*/*` matches any permission on any object', () =>
        {
            expect(god.hasPerm('canView', 'DNE')).to.be.true;
        });
    });

    describe('#addPerm()', () =>
    {
        it('can add permissions', () =>
        {
            groupInst.addPerm('canWrite', 'Other');
            expect(groupInst.hasPerm('canWrite', 'Other')).to.be.true;
        });
    });

    describe('#removePerm', () =>
    {
        it('can remove permissions', () =>
        {
            groupInst.removePerm('canEdit', 'Other');
            expect(groupInst.hasPerm('canEdit', 'Other')).to.be.false;
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
