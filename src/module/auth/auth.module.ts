import { AuthService } from './auth.service';
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserDBModule } from '../../DataBase/user/user-db.module';
import { RefreshTokenDBModule } from '../../DataBase/refresh-token/refresh-token-db.module';

@Module({
    imports: [UserDBModule, RefreshTokenDBModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}