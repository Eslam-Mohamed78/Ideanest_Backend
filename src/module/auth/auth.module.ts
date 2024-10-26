import { AuthService } from './auth.service';
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserDBModule } from '../../DataBase/user/user-db.module';

@Module({
    imports: [UserDBModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}