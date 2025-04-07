import { Injectable } from '@nestjs/common';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class SecurityService {
    async createUser(name: string, email: string, password: string): Promise<void> {
        // return;
    }
}
