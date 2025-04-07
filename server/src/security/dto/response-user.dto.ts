
type userRoleStr = "SYSADMIN" | "ADMIN" | "USER";

const USER_ROLE_LIST: UserRole[] = [
    { id : 0, str: "SYSADMIN" },
    { id : 2, str: "ADMIN" },
    { id : 4, str: "USER" },
];

interface UserRole {
    id: number;
    str: userRoleStr;
}

export class ResponseUserDto {
    id: number;
    email: string;
    name: string;
    role: UserRole[];
    isSysAdmin: boolean;
}