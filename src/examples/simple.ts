//----------------------------------------------------------------------------------------------------------------------
// Example file
//----------------------------------------------------------------------------------------------------------------------

import tp from '../trivialperms';

//----------------------------------------------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------------------------------------------

tp.loadGroups([
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

const bender = {
    name: 'benderIsGreat',
    permissions: [ 'isGreat' ]
}

//----------------------------------------------------------------------------------------------------------------------
// Use
//----------------------------------------------------------------------------------------------------------------------

console.log('Batman is an Administrator:', tp.hasGroup(batman, 'Administrators'), '(expected: true)');
console.log('Batman can edit your posts:', tp.hasPerm(batman, 'Posts/canEdit'), '(expected: true)');

console.log('Tony Stark is an Administrator:', tp.hasGroup(stark, 'Administrators'), '(expected: false)');
console.log('Tony Stark can do anything:', tp.hasPerm(stark, 'Murder/canGetAwayWith'), '(expected: true)');

console.log('Leo Blume is a user:', tp.hasGroup(leo, 'Users'), '(expected: true)');
console.log('Leo Blume can read your posts:', tp.hasPerm(leo, 'Posts/canView'), '(expected: true)');
console.log('Leo Blume can edit your posts:', tp.hasPerm(leo, 'Posts/canEdit'), '(expected: false)');

console.log('Bender can do anything:', tp.hasPerm(bender, 'isGreat'), '(expected: true)');

//----------------------------------------------------------------------------------------------------------------------
