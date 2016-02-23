//----------------------------------------------------------------------------------------------------------------------
/// TPBase
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';

//----------------------------------------------------------------------------------------------------------------------

class TPBase {
    constructor(name, permissions, manager)
    {
        this.name = name;
        this.permissions = permissions || [];
        this.manager = manager;

        // Ensure our permissions are unique
        this.permissions = _.unique(this.permissions);
    } // end constructor

    hasPerm(perm, obj)
    {
        return !!_.find(this.permissions, (permission) =>
        {
            if(permission.match(/^.*\/\*/))
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
        this.permissions = _.unique(this.permissions);
    } // end addPerm

    removePerm(perm, obj)
    {
        return _.remove(this.permissions, (item) => item == `${ obj }/${ perm }`);
    } // end removePerm
} // end TPBase

//----------------------------------------------------------------------------------------------------------------------

export default TPBase;

//----------------------------------------------------------------------------------------------------------------------
