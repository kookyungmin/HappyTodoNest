import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
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