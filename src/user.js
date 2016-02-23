//----------------------------------------------------------------------------------------------------------------------
/// TPUser
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

import TPBase from './base';

//----------------------------------------------------------------------------------------------------------------------
class TPUser extends TPBase {
    constructor(userDef, manager)
    {
        super(userDef.name, userDef.permissions, manager);

        this._onPermAdd = userDef.onPermAdd || (() => {});
        this._onPermRem = userDef.onPermRem || (() => {});
        this._onGroupAdd = userDef.onGroupAdd || (() => {});
        this._onGroupRem = userDef.onGroupRem || (() => {});

        this._loadGroups(userDef.groups);
    } // end constructor

    _loadGroups(groups)
    {
        _.each(groups, (groupName) =>
        {
            var groupObj = this.manager.groups[groupName];
            if(!groupObj)
            {
                this.manager.defineGroup({ name: groupName });
            } // end if

            this.groups.push(groupObj);
        });
    } // end _loadGroups

    //------------------------------------------------------------------------------------------------------------------

    hasPerm(perm, obj)
    {
        var found = super.hasPerm(perm, obj);
        if(!found)
        {
            found = _.any(this.groups, (group) => group.hasPerm(perm, obj));
        } // end if

        return found;
    } // end hasPerm

    addPerm(perm, obj)
    {
        super.addPerm(perm, obj);
        this._onPermAdd(perm, obj);
    } // end addPerm

    removePerm(perm, obj)
    {
        var removed = super.removePerm(perm, obj);
        this._onPermRem(removed);
        return removed;
    } // end removePerm

    hasGroup(name)
    {
        return !!_.find(this.groups, { name });
    } // end hasGroup

    addGroup(group)
    {
        if(_.isString(group))
        {
            group = this.manager.defineGroup({ name: group });
        } // end if

        this.groups.push(group);
        this._onGroupAdd(group);

        return group;
    } // end addGroup

    removeGroup(name)
    {
        var removed = _.remove(this.groups, (group) => group.name == name);
        this._onGroupRem(removed);
        return removed;
    } // end removeGroup
} // end TPUser

//----------------------------------------------------------------------------------------------------------------------

export default TPUser;

//----------------------------------------------------------------------------------------------------------------------
