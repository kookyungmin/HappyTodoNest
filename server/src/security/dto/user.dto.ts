
import { UnauthorizedException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export const userRole = {
    "SYSADMIN": 0,
    "ADMIN": 2,
    "USER": 4
}

export type UserRoleKeyType = keyof typeof userRole;
export type UserRoleValueType = (typeof userRole) [UserRoleKeyType];

export const getUserRole = (id: number): UserRoleKeyType  => {
    for(let role in userRole) {
        if (userRole[role] === id) {
            return role as UserRoleKeyType;
        }
    }
    throw new UnauthorizedException("User has not role");
}

export const userStatus = {
    "ACTIVATE": 0,
    "DEACTIVATE": 1
} as const;

export type UserStatusKeyType = keyof typeof userStatus;
export type UserStatusValueType = (typeof userStatus) [UserStatusKeyType];

export const getUserStatus = (id: number): UserStatusKeyType  => {
    for(let status in userStatus) {
        if (userStatus[status] === id) {
            return status as UserStatusKeyType;
        }
    }
    throw new UnauthorizedException("User has not status");
}

export class UserDomain {
    id?: number;
    email: string;
    name: string;
    password?: string;
    role: UserRoleKeyType;
    status: UserStatusKeyType;
}

export class UserRequest {
    @Transform(params => params.value.trim())
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: '비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다'
    })
    readonly password: string;
}

export class LoginRequest {
    @IsEmail()
    readonly email: string;
    @IsString()
    readonly password: string;
}

export class LoginToken {
    atk: string;
    rtk: string;
}

export class UserResponse {
    id: number;
    email: string;
    name: string;
    role: UserRoleKeyType;
    status: UserStatusKeyType;
    isSysAdmin: boolean;
}
