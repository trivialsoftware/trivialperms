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
more generic object names, like, `'Accounting'`, or `'Posts'`, or something along those lines. TrivialPermissions does
not care, so long as you specify an object descriptor and a permission descriptor.

#### Glob Matching

TrivialPermissions has special support for `*`. It can be used as either an object descriptor, or a permission descriptor.
It matches any permissions passed in. If you want a user or group to have all permissions for all objects, specify
`'*/**'`.

### Groups

TBD.

### Checking Permissions

TBD.
