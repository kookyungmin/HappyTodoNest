import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from 'src/pipe/custom-validation.pipe';
import { LoginRequest, LoginToken, UserDomain, UserRequest, UserResponse, userRole, UserRoleKeyType } from './dto/user.dto';
import { SecurityService } from './security.service';

@Controller('/api/security')
export class SecurityController {
    constructor(private readonly securityService: SecurityService) {}

    @Post('/join/user')
    // async joinUser(@Body(CustomValidationPipe) dto: UserRequest): Promise<void> {
    async joinUser(@Body(ValidationPipe) dto: UserRequest): Promise<void> {
        const { name, email, password } = dto;
        await this.securityService.joinUser({
            name,
            email,
            password,
            role: "USER",
            status: "ACTIVATE"
        });
    }

    @HttpCode(200)
    @Post('/email/reset-password-link')
    async sendResetPasswordLinkEmail(@Body('email') email: string): Promise<void> {
        await this.securityService.sendResetPasswordLinkEmail(email);
    }

    @HttpCode(200)
    @Post('/login')
    async login(@Body(ValidationPipe) dto: LoginRequest): Promise<LoginToken> {
        return await this.securityService.login(dto.email, dto.password);
    }

    @Get('/login-user')
    async getLoginUser(@Req() request): Promise<UserResponse> {
        const token = request.headers.authorization?.split('Bearer ') [1] || '';
        const loginUser = await this.securityService.getLoginUser(token);
        return {
            id: loginUser.id || 0,
            name: loginUser.name,
            email: loginUser.email,
            role: loginUser.role,
            status: loginUser.status,
            isSysAdmin: ("SYSTEM" as UserRoleKeyType) === loginUser.role
        }
    }
}
