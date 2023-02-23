// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for TrivialPerms
// ---------------------------------------------------------------------------------------------------------------------

import { expect } from 'chai';
import tp from '../src/trivialperms';
import { TPGroupDef } from '../src/interfaces/group';

// ---------------------------------------------------------------------------------------------------------------------

describe('TrivialPermissions', () =>
{
    let batman, stark, mel, leo, azira, crowley;
    beforeEach(() =>
    {
        batman = {
            name: 'batman',
            groups: ['Administrators']
        };

        stark = {
            name: 'tstark',
            permissions: ['*'],
            groups: ['Users']
        };

        leo = {
            name: 'lblume',
            groups: ['Users']
        };

        mel = {
            name: 'projektMelody',
            groups: ['Users', 'Authors']
        };

        azira = {
            name: 'aziraphale',
            permissions: ['*/canView']
        }

        crowley = {
            name: 'bentleyLover666',
            permissions: ['*/*']
        }

        tp.loadGroups([
            {
                name: "Administrators",
                permissions: [
                    "*"
                ]
            },
            {
                name: "Authors",
                permissions: [
                    "canViewPosts",
                    "canAddPosts",
                    "canEditPosts"
                ]
            },
            {
                name: "Users",
                permissions: [
                    "canViewPosts"
                ]
            }
        ]);
    });

    afterEach(() =>
    {
        // Clear loaded
        tp.groups.clear();
    });

    describe('Groups', () =>
    {
        it('can define a group', () =>
        {
            tp.defineGroup({
                name: "Test",
                permissions: []
            });

            expect(tp.groups.get('Test')).to.not.be.undefined;
        });

        it('throws an error if your group does not have a `name` property', () =>
        {
            function define()
            {
                // WE ARE INTENTIONALLY BREAKING TYPESCRIPT TO TEST THIS
                tp.defineGroup({} as unknown as TPGroupDef);
            }

            expect(define).to.throw();
        });

        it('can load a groups from a list', () =>
        {
            tp.loadGroups([
                {
                    name: "Test1",
                    permissions: [
                        "*"
                    ]
                },
                {
                    name: "Test2",
                    permissions: [
                        "canView",
                        "canAdd",
                        "canEdit"
                    ]
                },
                {
                    name: "Test3",
                    permissions: [
                        "canView"
                    ]
                }
            ]);

            expect(tp.groups.get('Test1')).to.not.be.undefined;
            expect(tp.groups.get('Test2')).to.not.be.undefined;
            expect(tp.groups.get('Test3')).to.not.be.undefined;
        });
    });

    describe('Users', () =>
    {
        it('user permissions override group permissions', () =>
        {
            expect(tp.hasPerm(stark, 'canEditPosts')).to.equal(true);
            expect(tp.hasPerm(stark, 'canGetAwayWithMurder')).to.equal(true);
        });

        it('all group permissions are checked', () =>
        {
            expect(tp.hasPerm(mel, 'canEditPosts')).to.equal(true);
        });

        it('can check the groups of a user', () =>
        {
            expect(tp.hasGroup(leo, 'Users')).to.equal(true);
        });

        it('returns false when checking the groups of a user if the group is not registered', () =>
        {
            const user = {
                groups: ['Users', 'Fakes']
            };

            expect(tp.hasGroup(user, 'Fakes')).to.equal(false);
        });

        describe('#hasPerm()', () =>
        {
            it('supports arbitrary strings for permission names', () =>
            {
                expect(tp.hasPerm(batman, 'canRock')).to.be.true;
                expect(tp.hasPerm(mel, 'canEditPosts')).to.be.true;
                expect(tp.hasPerm(leo, 'canViewPosts')).to.be.true;
            });

            it('supports `*` matching any permission', () =>
            {
                expect(tp.hasPerm(stark, 'canRock')).to.be.true;
            });

            it('fails to match missing permissions', () =>
            {
                expect(tp.hasPerm(leo, 'canEdit')).to.be.false;
            });

            describe('legacy support', () =>
            {
                it('supports the legacy `*/perm` form in the group definition', () =>
                {
                    expect(tp.hasPerm(azira, 'canView')).to.be.true;
                });

                it('supports the legacy `*/*` matching any permission in the group definition', () =>
                {
                    expect(tp.hasPerm(crowley, 'canView')).to.be.true;
                });
            });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
