import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`${__dirname}/env/.env.${process.env.NODE_ENV}`],
            isGlobal: true,
        })
    ]
})
export class EnvConfigModule {}