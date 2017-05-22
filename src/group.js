//----------------------------------------------------------------------------------------------------------------------
/// TPGroup
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import find from 'lodash/find';
import uniq from 'lodash/uniq';
import remove from 'lodash/remove';

const _ = {
    find,
    uniq,
    remove
};

//----------------------------------------------------------------------------------------------------------------------

class TPGroup {
    constructor(name, permissions, manager)
    {
        this.name = name;
        this.permissions = permissions || [];
        this.manager = manager;

        // Ensure our permissions are unique
        this.permissions = _.uniq(this.permissions);
    } // end constructor

    hasPerm(perm, obj)
    {
        if(arguments.length === 1)
        {
            const parts = perm.split('/');
            obj = parts[0];
            perm = parts[1];
        } // end if

        return !!_.find(this.permissions, (permission) =>
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
    } // end hasPerm

    addPerm(perm, obj)
    {
        this.permissions.push(`${ obj }/${ perm }`);

        // Ensure our permissions are unique
        this.permissions = _.uniq(this.permissions);
    } // end addPerm

    removePerm(perm, obj)
    {
        return _.remove(this.permissions, (item) => item === `${ obj }/${ perm }`);
    } // end removePerm
} // end TPGroup

//----------------------------------------------------------------------------------------------------------------------

export default TPGroup;

//----------------------------------------------------------------------------------------------------------------------
