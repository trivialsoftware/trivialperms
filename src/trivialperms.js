//----------------------------------------------------------------------------------------------------------------------
/// TrivialPerms
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import TPGroup from './group';

//----------------------------------------------------------------------------------------------------------------------

var mapping = { permissions: 'permissions', groups: 'groups' };

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
            if(permission == '*/*')
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

        var group = new TPGroup(groupDef.name, groupDef.permissions, this);
        this.groups[groupDef.name] = group;

        return group;
    } // end defineGroup

    loadGroups(groupsOrFunc)
    {
        var loadPromise = Promise.resolve(groupsOrFunc);
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
        var found = this._userHasPerm(user, perm, obj);
        if(!found)
        {
            var groups = _.map(user[mapping.groups], (name) => this.groups[name]);
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
