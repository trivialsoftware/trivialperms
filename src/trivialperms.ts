//----------------------------------------------------------------------------------------------------------------------
// TrivialPerms
//----------------------------------------------------------------------------------------------------------------------

import { TPUser } from './interfaces/user';
import { TPGroupDef } from './interfaces/group';

import { TPGroup } from './group';

import { checkPerm } from './utils';

//----------------------------------------------------------------------------------------------------------------------

class TPManager
{
    groups : Map<string, TPGroup> = new Map();

    _userHasPerm(user : TPUser, perm : string) : boolean
    {
        return checkPerm(user.permissions ?? [], perm);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Public
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Defines a group and it's permissions.
     *
     * @param groupDef - The definition for the group.
     */
    defineGroup(groupDef : TPGroupDef) : TPGroup
    {
        if(!groupDef.name)
        {
            throw new Error("Must specify a 'name' property.");
        }

        const group = new TPGroup(groupDef.name, groupDef.permissions);
        this.groups.set(groupDef.name,  group);

        return group;
    }

    /**
     * Loads an array of groups at once.
     *
     * @param groups - an array of group definitions
     */
    loadGroups(groups : TPGroupDef[]) : TPGroup[]
    {
        // Build the groups
        groups.forEach((groupDef) =>
        {
            this.defineGroup(groupDef);
        });

        return Array.from(this.groups.values());
    }

    /**
     * Check to see if the user has a given permission.
     *
     * @param user - The user to check.
     * @param perm - The permission to look for.
     */
    hasPerm(user : TPUser, perm : string) : boolean
    {
        let found = this._userHasPerm(user, perm);
        if(!found)
        {
            const groups = (user.groups ?? [])
                .map((name) => this.groups.get(name));

            found = groups.some((group) =>
            {
                if(group)
                {
                    return group.hasPerm(perm)
                }

                return false;
            });
        }

        return found;
    }

    /**
     * Checks to see if the user has the given group, but also returns false if the group hasn't been defined yet.
     *
     * @param user - The user to check.
     * @param groupName - The name of the group to check for.
     */
    hasGroup(user : TPUser, groupName : string) : boolean
    {
        // Returns false for groups that haven't been loaded yet
        return this.groups.has(groupName) && (user.groups ?? []).includes(groupName);
    }
}

//----------------------------------------------------------------------------------------------------------------------

export { TPUser, TPGroupDef as TPGroup };

export default new TPManager();

//----------------------------------------------------------------------------------------------------------------------
