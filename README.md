# TrivialPermissions

A simple RBAC implementation with object level permissions that is datasource agnostic. I've designed it to be easy to 
integrate into existing projects, while being flexible and very simple to use. It may not be the most powerful 
permission system ever devised, but it is one of the easiest to get up and running with in very little time.

## Installation

### Node.js / Browserify

Simply install with NPM:

```bash
$ npm install --save trivialperms
```

### Bower

```bash
$ bower install --save trivialperms
```

### Generic

Download the latest release from the [Releases][] page, and put it in your project.

[Releases]: https://github.com/trivialsoftware/TrivialPermissions/releases

## Usage

TrivialPermissions is built on the concept of 'role based access control'. In essence, a `user` is a member of a 
`group`. That group has specific `permissions`. A user may also have specific `permissions` granted. These permissions 
are on an `object` basis.

### Permissions

In TrivialPermissions, a `permission` is a string that looks like the following:

```javascript
'ObjectDescriptor/PermissionDescriptor'
```

This allows us to specify permissions on a per object basis. If you want to specify the permissions on an object from 
the database, simply use that id as the object in the permission: `3dqZ7/somePerm`. Alternatively, you may wish to use
more generic object descriptors, like, `'Accounting'`, or `'Posts'`. TrivialPermissions does not care, so long as you 
specify an object descriptor and a permission descriptor.

#### Glob Matching

TrivialPermissions has special support for `*`. It can be used as either an object descriptor, or a permission descriptor.
It matches any permissions passed in. If you want a user or group to have all permissions for all objects, specify
`'*/*'`.

### Groups

Groups are small objects with a name and a list of permissions. TrivialPermissions requires you to define (or load) these
groups before you attempt to use them. This is generally considered part of the initial setup for TrivialPermissions. While
TrivialPermissions allows you to use your own objects for users, it requires you to pre-load your groups. Our assumption is
that you will not have more than 50 or so groups, and even if you do, loading under 1000 shouldn't be difficult for your
application.

#### Defining a Group

* `defineGroup({ name: '...', permissions: [...] })` - Returns the created group object.

Defining an individual group is very simple:

```javascript
const tp = require('../dist/trivialperms');

// Create an 'Admins' group
const admGroup = tp.defineGroup({ name: 'Admins', permissions: ['*/*'] });
```

#### Loading Groups

* `loadGroups(listOrFunc)` - Returns a promise that resolves once all data has been loaded.

More usefully, you will want to load multiple groups at once. TrivialPermissions supports loading from either a list of groups, or a function that returns a promise that resolves to a list of groups. The loading function itself always returns a promise.

(Note: You _will_ need to wait until after the loading promise resolves before attempting to use the permissions system.)

```javascript
const tp = require('../dist/trivialperms');

// Load from a list
var loading = tp.loadGroups([
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

loading.then(function()
{
	// Do work here!
});

// Load from a function
var loading = tp.loadGroups(function()
{
	return Promise.resolve([
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

loading.then(function()
{
	// Do work here!
});
```

This should make it very easy to integrate with a database library, for example.

### Users

You are expected to be providing your own user objects. Generally, this would come from either an authentication system, 
or a database of some kind. Because of this, we did not want to force you to preload all your users; rather, you provide
TrivialPermissions with the object when you want to check permissions. By default, TrivialPermissions expect an object that looks like this:

```javascript
{
	permissions: [...],  // A list of permissions strings
	groups: [...],       // A list of group names (strings)
	...
}
```

If you want to change that, you can with `setUserMapping()`.

#### Setting Mapping

* `setUserMapping({ permissions: '...', groups: '...' })` - Returns nothing.

If your user object has it's permissions or groups under a different key name, you can change what TrivialPermissions
looks for using this method. Simply pass an object with the `permissions` and/or `groups` key(s) to map to your object's structure.

```javascript
const tp = require('../dist/trivialperms');

const user = {
	name: "John Snow",
	allowed: ["Foo/canView", "Bar/canView"],
	roles: ["Posters"]
};

// This must be done before your attempt to use the permission system.
tp.setUserMapping({ permissions: 'allowed', groups: 'roles' });
```

#### Checking Permissions

* `hasPerm(user, perm, object)` - Returns true if the user has that permission on that object, otherwise false.

This is the heart of the system: checking permissions. It's very simply; you pass the user object, the permission descriptor (string), and the object descriptor (string). Here are a few examples:

```javascript
const tp = require('../dist/trivialperms');

// Setup
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

// Wait until the loading is complete
loading.then(() =>
{
    // Batman can edit posts
    console.log(tp.hasPerm(batman, 'canEdit', 'Posts'));			// true
    
    // Tony Start can do anything
    console.log(tp.hasPerm(stark, 'canEdit', 'Posts'));				// true
    console.log(tp.hasPerm(stark, 'canGetAwayWith', 'Murder'));		// true
    
    // Leo can read posts
    console.log(tp.hasPerm(leo, 'canView', 'Posts'));				// true
    
    // Leo can not edit posts
    console.log(tp.hasPerm(leo, 'canEdit', 'Posts'));				// false
});
```

### Checking Group membership

* `hasGroup(user, groupName)` - Returns true if the user is a member of the group and the group exists, otherwise false.

Checking for group membership is also a very simple thing to do in TrivialPermissions. However, we add one aditional check
about simply seeing if `groupName` is in the list of groups on the user: `hasGroup()` returns false for groups that have 
not been defined, regardless of is the user has that group name in their list of groups.

```javascript
const tp = require('../dist/trivialperms');

// Setup
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

// Wait until the loading is complete
loading.then(() =>
{
	// Batman is an admin
    console.log(tp.hasGroup(batman, 'Administrators'));				// true

	// Tony Start is not an admin
    console.log(tp.hasGroup(stark, 'Administrators'));				// false

	// Leo is a user
    console.log(tp.hasGroup(leo, 'Users'));							// true
});
```
