//----------------------------------------------------------------------------------------------------------------------
// TPGroup
//----------------------------------------------------------------------------------------------------------------------

import { TPGroupDef } from './interfaces/group';
import { checkPerm, uniq } from './utils';

//----------------------------------------------------------------------------------------------------------------------

export class TPGroup implements TPGroupDef
{
    name : string;
    permissions : string[];

    constructor(name : string, permissions : string[])
    {
        this.name = name;
        this.permissions = permissions ?? [];

        // Ensure our permissions are unique
        this.permissions = uniq(permissions);
    }

    hasPerm(perm : string) : boolean
    {
        return checkPerm(this.permissions, perm);
    }

    addPerm(perm : string) : void
    {
        this.permissions.push(perm);

        // Ensure our permissions are unique
        this.permissions = uniq(this.permissions);
    }

    removePerm(perm : string) : void
    {
        this.permissions = this.permissions.filter((item) => item !== perm);
    }
}

//----------------------------------------------------------------------------------------------------------------------
