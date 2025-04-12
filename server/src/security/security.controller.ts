import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from 'src/pipe/custom-validation.pipe';
import { UserDomain, UserRequest } from './dto/user.dto';
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
            password
        });
    }

    @HttpCode(200)
    @Post('/email/reset-password-link')
    async sendResetPasswordLinkEmail(@Body('email') email: string): Promise<void> {
        await this.securityService.sendResetPasswordLinkEmail(email);
    }
}
