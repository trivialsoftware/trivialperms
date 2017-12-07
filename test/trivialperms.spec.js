// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the trivialperms.spec.js module.
//
// @module trivialperms.spec.js
// ---------------------------------------------------------------------------------------------------------------------

const Promise = require('bluebird');
const expect = require('chai').expect;

const tp = require('../src/trivialperms');

// ---------------------------------------------------------------------------------------------------------------------

describe('Permissions', () =>
{
    let batman, stark, leo;
    beforeEach(() =>
    {
        batman = {
            name: 'batman',
            groups: ['Administrators']
        };

        stark = {
            name: 'tstark',
            permissions: ['*/*'],
            groups: ['Users']
        };

        leo = {
            name: 'lblume',
            groups: ['Users']
        };

        return tp.loadGroups([
            {
                name: "Administrators",
                permissions: [
                    "*/*"
                ]
            },
            {
                name: "Authors",
                permissions: [
                    "Posts/canView",
                    "Posts/canAdd",
                    "Posts/canEdit"
                ]
            },
            {
                name: "Users",
                permissions: [
                    "Posts/canView"
                ]
            }
        ]);
    });

    afterEach(() =>
    {
        tp.groups = {};
        tp.setUserMapping({ permissions: 'permissions', groups: 'groups' });
    });

    describe('Groups', () =>
    {
        it('can define a group', () =>
        {
            tp.defineGroup({
                name: "Test",
                permissions: []
            });

            expect(tp.groups['Test']).to.not.be.undefined;
        });

        it('throws an error if your group does not have a `name` property', () =>
        {
            function define()
            {
                tp.defineGroup({
                    permissions: []
                });
            } // end define

            expect(define).to.throw();
        });

        it('can load a groups from a list', () =>
        {
            return tp.loadGroups([
                {
                    name: "Test1",
                    permissions: [
                        "*/*"
                    ]
                },
                {
                    name: "Test2",
                    permissions: [
                        "Posts/canView",
                        "Posts/canAdd",
                        "Posts/canEdit"
                    ]
                },
                {
                    name: "Test3",
                    permissions: [
                        "Posts/canView"
                    ]
                }
            ])
            .then(() =>
            {
                expect(tp.groups['Test1']).to.not.be.undefined;
                expect(tp.groups['Test2']).to.not.be.undefined;
                expect(tp.groups['Test3']).to.not.be.undefined;
            });
        });

        it('can load a groups from a function that returns a promise', () =>
        {
            return tp.loadGroups(() => Promise.resolve([
                    {
                        name: "Test1",
                        permissions: [
                            "*/*"
                        ]
                    },
                    {
                        name: "Test2",
                        permissions: [
                            "Posts/canView",
                            "Posts/canAdd",
                            "Posts/canEdit"
                        ]
                    },
                    {
                        name: "Test3",
                        permissions: [
                            "Posts/canView"
                        ]
                    }
                ]))
                .then(() =>
                {
                    expect(tp.groups['Test1']).to.not.be.undefined;
                    expect(tp.groups['Test2']).to.not.be.undefined;
                    expect(tp.groups['Test3']).to.not.be.undefined;
                });
        });
    });

    describe('Users', () =>
    {
        it('supports setting the mapping of properties on the user object', () =>
        {
            tp.setUserMapping({ groups: 'roles' });
            const user = {
                roles: ['Users']
            };

            expect(tp.hasGroup(user, 'Users')).to.equal(true);
            expect(tp.hasPerm(user, 'canView', 'Posts')).to.equal(true);
        });

        it('user permissions override group permissions', () =>
        {
            expect(tp.hasPerm(stark, 'canEdit', 'Posts')).to.equal(true);
            expect(tp.hasPerm(stark, 'canGetAwayWith', 'Murder')).to.equal(true);
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
            it('can take the `Object/perm` form', () =>
            {
                expect(tp.hasPerm(leo, 'Posts/canView')).to.equal(true);
                expect(tp.hasPerm(leo, 'Posts/canView', undefined)).to.equal(true);
                expect(tp.hasPerm(leo, 'Posts/canEdit')).to.equal(false);
                expect(tp.hasPerm(leo, 'Posts/canEdit', undefined)).to.equal(false);
            });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
