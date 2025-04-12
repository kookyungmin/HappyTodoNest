import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { getUserRole, getUserStatus, LoginToken, UserDomain, userStatus } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { userRole } from './dto/user.dto';
import { getSha512Hash } from 'src/crypto/crypto.util';
import { ResetPwEmailEntity } from 'src/email/entity/email.entity';
import * as uuid from "uuid";
import { EmailService } from 'src/email/email.service';
import { SecurityConfig } from 'src/config/register.config';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SecurityService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
                @InjectRepository(ResetPwEmailEntity) private readonly resetUserPwEmailRepository: Repository<ResetPwEmailEntity>,
                @Inject(SecurityConfig.KEY) private readonly config: ConfigType<typeof SecurityConfig>,
                private readonly emailService: EmailService) {}

    async joinUser(user: UserDomain): Promise<void> {
        const duplicatedUser = await this.findUserByEmail(user.email);
        if (duplicatedUser) {
            throw new UnprocessableEntityException("Email is already exists")
        }

        await this.saveUser(user);
    }

    async saveUser(user: UserDomain): Promise<UserEntity> {
        const userEntity = new UserEntity();

        userEntity.name = user.name;
        userEntity.email = user.email;
        userEntity.password = getSha512Hash(user.password);
        userEntity.auth = userRole[user.role];
        userEntity.status = userStatus[user.status];

        return await this.userRepository.save(userEntity);
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: { email }
        });
    }

    async sendResetPasswordLinkEmail(email: string): Promise<void> {
        const user = this.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException('The email is not exists');
        }

        //TODO: 사용자 별 unique ID 랑 만료시간 DB에 저장
        const entity = await this.saveUniqueIdForResetPassword(email);

        //TODO: Email 전송
        const html = 
        `<div>비밀번호를 변경하시려면 아래 버튼을 눌러주세요.</div>
        <form action="${this.config.redirectClientUrl}/change-pw?uuid=${entity.uuid}" method="POST">
            <button style="border: 1px solid #000; background: blue; color: #fff; padding: 10px; width: 150px; text-align: center;">비밀번호 변경</button>
        </form>`;
        this.emailService.sendEmail({
            to: email,
            subject: '[HappyTODO] 비밀번호 변경',
            html
        });
    }

    async saveUniqueIdForResetPassword(email: string): Promise<ResetPwEmailEntity> {
        const entity = new ResetPwEmailEntity();

        entity.email = email;
        entity.uuid = uuid.v1();
        entity.expiredDt = new Date(Date.now() + 3 * 60 * 1000);

        return await this.resetUserPwEmailRepository.save(entity);
    }

    async login(email: string, password: string): Promise<LoginToken> {
        const existEmail = await this.userRepository.findOne({
            select: { email: true },
            where: { email }
        });
        
        if (!existEmail) {
            throw new UnauthorizedException('Email is not exists');
        }

        const loginUser = await this.userRepository.findOne({
            select: { id: true },
            where: { email, password: getSha512Hash(password) }
        });

        if (!loginUser) {
            throw new UnauthorizedException('password is not equal');
        }
        
        //Access Token & Refresh Token 발급
        const payload = { id: loginUser.id };
        const atk = this.createJwt(payload, '30m');
        const rtk = this.createJwt(payload, '7d');
        //TODO: user id, rtk, expired dt -> DB insert
        return {
            atk,
            rtk
        };
    }

    createJwt(payload: any, expiresIn): string {
        return jwt.sign(payload, this.config.jwtSecretKey, {
            algorithm: 'HS512',
            expiresIn,
            audience: 'happykoo.net',
            issuer: 'happykoo.net'
        })

    }

    async getLoginUser(token: any): Promise<UserDomain> {
        const payload = this.verifyJwt(token);
        const entity = await this.findUserById(payload?.id || 0);
        if (!entity) {
            throw new UnauthorizedException('User is not exists');
        }

        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            status: getUserStatus(entity.status),
            role: getUserRole(entity.auth)
        }
    }

    async findUserById(id: number): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            select: { id: true, name: true, email: true, status: true, auth: true },
            where: { id }
        });
    }

    verifyJwt(token: string): any {
        try {
            const payload = jwt.verify(token, this.config.jwtSecretKey) as (jwt.JwtPayload | string);
            return payload;
        } catch(err) {
            throw new UnauthorizedException("JWT is not vaild");
        }
    }
}
