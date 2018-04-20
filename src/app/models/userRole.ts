enum ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export class UserRole {
  static ROLES = ROLES;
  static allowedRoles: string[] = [ROLES.USER.toString(), ROLES.ADMIN.toString()];
  role: string = null;
}
