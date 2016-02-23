//----------------------------------------------------------------------------------------------------------------------
/// TrivialPerms
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import TPGroup from './group';
import TPUser from './user';

//----------------------------------------------------------------------------------------------------------------------

class TPManager
{
    constructor()
    {
        this.users = {};
        this.groups = {};
    } // end constructor

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

    defineUser(userDef)
    {
        if(!userDef.name)
        {
            throw new Error("Must specify a 'name' property.");
        } // end if

        var user = new TPUser(userDef, this);
        this.users[userDef.name] = user;

        return user;
    } // end defineUser

    hasPerm(userName, perm, obj)
    {
        var user = this.users[userName];
        if(user)
        {
            return user.hasPerm(perm, obj);
        } // end if

        return false;
    } // end hasPerm

    hasGroup(userName, groupName)
    {
        var user = this.users[userName];
        if(user)
        {
            return user.hasGroup(groupName);
        } // end if

        return false;
    } // end hasGroup
} // end TPManager

//----------------------------------------------------------------------------------------------------------------------

export default new TPManager();

//----------------------------------------------------------------------------------------------------------------------
