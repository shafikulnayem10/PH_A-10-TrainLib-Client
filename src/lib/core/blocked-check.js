export const checkUserBlocked = (user) => {
    return user?.banned === true;
};

export const ensureNotBlocked = (user, actionName = 'perform this action') => {
    if (checkUserBlocked(user)) {
        throw new Error(`Action restricted by Admin. You cannot ${actionName}.`);
    }
    return true;
};
