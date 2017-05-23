//----------------------------------------------------------------------------------------------------------------------
// TrivialPerms
//
// @module
//----------------------------------------------------------------------------------------------------------------------

const map = require('lodash/map');
const find = require('lodash/find');
const some = require('lodash/some');
const includes = require('lodash/includes');
const isFunction = require('lodash/isFunction');

const Promise = require('bluebird');
const TPGroup = require('./group');

//----------------------------------------------------------------------------------------------------------------------

const _ = {
    map,
    find,
    some,
    includes,
    isFunction
};

const mapping = {permissions: 'permissions', groups: 'groups'};

//----------------------------------------------------------------------------------------------------------------------

class TPManager
{
    constructor()
    {
        this.groups = {};
    } // end constructor

    _userHasPerm(user, perm, obj)
    {
        return !!_.find(user[mapping.permissions], (permission) =>
        {
            if(permission === '*/*')
            {
                return true;
            }
            else if(permission.match(/^.*\/\*/))
            {
                return !!permission.match(new RegExp(`^${ obj }/`));
            }
            else if(permission.match(/^\*\/.*/))
            {
                return !!permission.match(new RegExp(`^.*/${ perm }$`));
            }
            else
            {
                return !!permission.match(new RegExp(`^${ obj }/${ perm }$`));
            } // end if
        });
    } // end _userHasPerm

    //------------------------------------------------------------------------------------------------------------------
    // Public
    //------------------------------------------------------------------------------------------------------------------

    setUserMapping(newMapping)
    {
        mapping.groups = newMapping.groups || mapping.groups;
        mapping.permissions = newMapping.permissions || mapping.permissions;
    } // end setUserMapping

    defineGroup(groupDef)
    {
        if(!groupDef.name)
        {
            throw new Error("Must specify a 'name' property.");
        } // end if

        const group = new TPGroup(groupDef.name, groupDef.permissions, this);
        this.groups[groupDef.name] = group;

        return group;
    } // end defineGroup

    loadGroups(groupsOrFunc)
    {
        let loadPromise = Promise.resolve(groupsOrFunc);
        if(_.isFunction(groupsOrFunc))
        {
            loadPromise = groupsOrFunc();
        } // end if

        // Build the groups
        return loadPromise.each((groupDef) =>
        {
            this.defineGroup(groupDef);
        });
    } // end loadGroups

    hasPerm(user, perm, obj)
    {
        if(arguments.length === 2)
        {
            const parts = perm.split('/');
            obj = parts[0];
            perm = parts[1];
        } // end if

        let found = this._userHasPerm(user, perm, obj);
        if(!found)
        {
            const groups = _.map(user[mapping.groups], (name) => this.groups[name]);
            found = _.some(groups, (group) => group.hasPerm(perm, obj));
        } // end if

        return found;
    } // end hasPerm

    hasGroup(user, groupName)
    {
        // Returns false for groups that haven't been loaded yet
        return (groupName in this.groups) && _.includes(user[mapping.groups], groupName);
    } // end hasGroup
} // end TPManager

//----------------------------------------------------------------------------------------------------------------------

module.exports = new TPManager();

//----------------------------------------------------------------------------------------------------------------------
