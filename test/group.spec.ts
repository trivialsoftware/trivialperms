// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the TPGroup Class
// ---------------------------------------------------------------------------------------------------------------------

import { expect } from 'chai';
import { TPGroup } from '../src/group';

// ---------------------------------------------------------------------------------------------------------------------

describe('TPGroup', () =>
{
    let groupInst; let god; let godLegacy;
    beforeEach(() =>
    {
        groupInst = new TPGroup('test', [
            '*/canView',
            'canRock',
            'Other/canEdit'
        ]);

        god = new TPGroup('test', [
            '*'
        ]);

        godLegacy = new TPGroup('test', [
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
        it('supports arbitrary strings for permission names', () =>
        {
            expect(groupInst.hasPerm('canRock')).to.be.true;
            expect(groupInst.hasPerm('Other/canEdit')).to.be.true;
            expect(groupInst.hasPerm('*/canView')).to.be.true;
        });

        it('supports `*` matching any permission', () =>
        {
            expect(god.hasPerm('canView')).to.be.true;
        });

        it('fails to match missing permissions', () =>
        {
            expect(groupInst.hasPerm('canEdit')).to.be.false;
            expect(groupInst.hasPerm('Other/canWrite')).to.be.false;
        });

        describe('legacy support', () =>
        {
            it('supports the legacy `*/perm` form in the group definition', () =>
            {
                expect(groupInst.hasPerm('canView')).to.be.true;
            });

            it('supports the legacy `*/*` matching any permission in the group definition', () =>
            {
                expect(godLegacy.hasPerm('canView')).to.be.true;
            });
        });
    });

    describe('#addPerm()', () =>
    {
        it('can add permissions', () =>
        {
            groupInst.addPerm('canWrite');
            expect(groupInst.hasPerm('canWrite')).to.be.true;
        });
    });

    describe('#removePerm()', () =>
    {
        it('can remove permissions', () =>
        {
            groupInst.removePerm('Other/canEdit');
            expect(groupInst.hasPerm('Other/canEdit')).to.be.false;
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
