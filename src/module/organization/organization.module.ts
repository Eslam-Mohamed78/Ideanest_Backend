import { Module } from "@nestjs/common";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";
import { OrganizationDBModule } from "../../DataBase/organization/organization-db.module";
import { UserDBModule } from "../../DataBase/user/user-db.module";

@Module({
    imports: [OrganizationDBModule, UserDBModule],
    controllers: [OrganizationController],
    providers: [OrganizationService],
})
export class OrganizationModule {}