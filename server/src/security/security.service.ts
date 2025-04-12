import { BadRequestException, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserDomain, userStatus } from './dto/user.dto';
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
        userEntity.auth = userRole["USER"];
        userEntity.status = userStatus["ACTIVATE"];

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
        <form action="${this.config.redirectClientUrl}/change-pw?uuid=${entity.uuid}">
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
}
