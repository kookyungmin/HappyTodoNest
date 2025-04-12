import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ResetPwEmailEntity } from 'src/email/entity/email.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [ TypeOrmModule.forFeature([ UserEntity, ResetPwEmailEntity ]), EmailModule ],
    controllers: [ SecurityController ],
    providers: [ 
        { provide: SecurityService, useClass: SecurityService } 
    ]
})
export class SecurityModule {}
