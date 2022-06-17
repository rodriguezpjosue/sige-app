/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  lider: ['admin', 'lider'],
  tutor: ['admin', 'tutor'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  onlyGuest: [],
};

export default authRoles;
