// ---------------------------------------------------------------------------------------------------------------------
// Simple utilities
// ---------------------------------------------------------------------------------------------------------------------

export function uniq<T>(someArray : T[]) : T[]
{
    return Array.from(new Set(someArray));
}

export function checkPerm(permissions : string[], perm : string) : boolean
{
    return permissions.some((permission) =>
    {
        return permission === '*'
            || permission === '*/*' // Legacy form
            || permission === `*/${ perm }` // Legacy form
            || permission === perm;
    });
}

// ---------------------------------------------------------------------------------------------------------------------
