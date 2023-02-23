# TrivialPermissions

A simple RBAC implementation that is datasource agnostic. I've designed it to be easy to integrate into existing 
projects, while being flexible and very simple to use. It may not be the most powerful permission system ever devised, 
but it is one of the easiest to get up and running with in very little time.

## Installation

### Node.js

Simply install with `npm`:

```bash
$ npm add trivialperms
```

or `yarn`:

```bash
$ yarn add trivialperms
```

## Usage

TrivialPermissions is built on the concept of 'role based access control'. In essence, a `user` is a member of a 
`group`. That group has specific `permissions`. A user may also have specific `permissions` granted. A user is allowed 
access if either they, or one of their groups they have the `permission` being tested.

### Permissions

In TrivialPermissions, a `permission` is any string (other than `*` or `*/*`):

```typescript
'PermissionDescriptor'
```

TrivialPermissions supports whatever roles you want to use. It supports any arbitrary string. Previous versions were 
built around a `Object/Permission` styles, and those still work, but in the spirit of simplification and flexibility,
we've dropped the concept of 'object level' permissions, since those were never really implemented in a useful way.

#### Glob Matching

TrivialPermissions has special support for `*` and `*/*`. These strings, when used as a permission name, are 
considered wildcards. All permission checks will pass if a user or group has `*` or `*/*` as a permission.

### Groups

Groups are small objects with a name and a list of permissions. TrivialPermissions requires you to define (or load) 
these groups before you attempt to use them. This is generally considered part of the initial setup for 
TrivialPermissions. While TrivialPermissions allows you to use your own objects for users, it requires you to preload 
your groups.

#### Defining a Group

* `defineGroup({ name: '...', permissions: [...] })` - Returns the created group object.

Defining an individual group is very simple:

```typescript
import tp from 'trivialperms'

// Create an 'Admins' group
const admGroup = tp.defineGroup({ name: 'Admins', permissions: ['*/*'] });
```

#### Loading Groups

* `loadGroups(list)` - Returns a list of all loaded groups.

More usefully, you will want to load multiple groups at once. TrivialPermissions supports loading a list of groups.

_Note:_ Previous versions allowed for you to pass in a promise or a function, and it would resolve it, but in the 
world of `async`/`await`, there's no reason to support this anymore.

```typescript
import tp from 'trivialperms';

// Load from a list
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
```

This should make it very easy to integrate with a database library, for example.

### Users

You are expected to be providing your own user objects. Generally, this would come from either an authentication system, 
or a database of some kind. Because of this, we did not want to force you to preload all your users; rather, you provide
TrivialPermissions with the object when you want to check permissions. TrivialPermissions requires an object that looks 
like this:

```typescript
export interface TPUser {
    permissions ?: string[];
    groups ?: string[];
}
```

While both `permissions` and `groups` are optional, the user will have no permissions if one of the two isn't set.

#### Checking Permissions

* `hasPerm(user, perm)` - Returns `true` if the user has that permission on that object, otherwise false.

This is the heart of the system: checking permissions. It's very simply; you pass the user object, and the permission 
descriptor (string). Here are a few examples:

```javascript
import tp from 'trivialperms';

// Setup
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

// Define Users
const batman = {
    name: 'batman',
    groups: ['Administrators']
};

const stark = {
    name: 'tstark',
    permissions: ['*'],
    groups: ['Users']
};

const leo = {
    name: 'lblume',
    groups: ['Users']
};

// Batman can edit posts
console.log(tp.hasPerm(batman, 'canEditPosts'));			// true

// Tony Start can do anything
console.log(tp.hasPerm(stark, 'canEditPosts'));				// true
console.log(tp.hasPerm(stark, 'canGetAwayWithMurder'));		// true

// Leo can read posts
console.log(tp.hasPerm(leo, 'canViewPosts'));				// true

// Leo can not edit posts
console.log(tp.hasPerm(leo, 'canEditPosts'));				// false
```

### Checking Group membership

* `hasGroup(user, groupName)` - Returns true if the user is a member of the group and the group has been defined, 
  otherwise false.

Checking for group membership is also a very simple thing to do in TrivialPermissions. However, we add one additional 
check about simply seeing if `groupName` is in the list of groups on the user: `hasGroup()` returns false for groups 
that have not been defined, regardless of is the user has that group name in their list of groups.

```javascript
import tp from 'trivialperms';

// Setup
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

// Define Users
const batman = {
    name: 'batman',
    groups: ['Administrators']
};

const stark = {
    name: 'tstark',
    permissions: ['*'],
    groups: ['Users']
};

const leo = {
    name: 'lblume',
    groups: ['Users']
};

// Batman is an admin
console.log(tp.hasGroup(batman, 'Administrators'));				// true

// Tony Start is not an admin
console.log(tp.hasGroup(stark, 'Administrators'));				// false

// Leo is a user
console.log(tp.hasGroup(leo, 'Users'));							// true
```
