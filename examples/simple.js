//----------------------------------------------------------------------------------------------------------------------
/// Brief description for simple.js module.
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

const tp = require('../dist/trivialperms');

//----------------------------------------------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------------------------------------------

const loading = tp.loadGroups([
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

// Define Users

const batman = {
    name: 'batman',
    groups: ['Administrators']
};

const stark = {
    name: 'tstark',
    permissions: ['*/*'],
    groups: ['Users']
};

const leo = {
    name: 'lblume',
    groups: ['Users']
};

//----------------------------------------------------------------------------------------------------------------------
// Use
//----------------------------------------------------------------------------------------------------------------------

loading.then(() =>
{
    console.log('Batman is an Administrator: ', tp.hasGroup(batman, 'Administrators'));
    console.log('Batman can edit your posts: ', tp.hasPerm(batman, 'canEdit', 'Posts'));

    console.log('Tony Stark is not an Administrator: ', !tp.hasGroup(stark, 'Administrators'));
    console.log('Tony Stark can do anything: ', tp.hasPerm(stark, 'canGetAwayWith', 'Murder'));

    console.log('Leo Blume is a user: ', tp.hasGroup(leo, 'Users'));
    console.log('Leo Blume can read your posts: ', tp.hasPerm(leo, 'canView', 'Posts'));
    console.log('Leo Blume can not edit your posts: ', !tp.hasPerm(leo, 'canEdit', 'Posts'));
});

//----------------------------------------------------------------------------------------------------------------------
