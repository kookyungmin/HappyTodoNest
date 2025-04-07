import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomValidationPipe } from 'src/pipe/custom-validation.pipe';
import { ResponseUserDto } from './dto/response-user.dto';
import { SecurityService } from './security.service';

@Controller('/api/security')
export class SecurityController {
    constructor(private readonly securityService: SecurityService) {}

    @Post('/join/user')
    // async joinUser(@Body(CustomValidationPipe) dto: CreateUserDto): Promise<void> {
    async joinUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;
        await this.securityService.createUser(name, email, password);
    }
}
