import {
    Injectable,
    CanActivate,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../../modules/auth/auth.types';
import { UserEntity } from '../../modules/master/user/user.entity';
import { Reflector } from '@nestjs/core';
import { MenuEntity } from '@/src/modules/master/menu/menu.entity';
import { RolePermissionEntity } from '@/src/modules/master/role_permission/role_permission.entity';
@Injectable()
export class RoleBaseGuard implements CanActivate {
    constructor(
        @InjectDataSource() private readonly connection: DataSource,
        protected readonly reflector: Reflector,
    ) { }
    async canActivate(context: GqlExecutionContext): Promise<any> {
        const ctx = GqlExecutionContext.create(context);

        // get fieldname
        const fieldName = ctx.getInfo().fieldName;

        // if not graphql
        if (fieldName === undefined) return true;

        // get headers
        const req = context.switchToHttp().getNext().req;
        const headersKey = Object.getOwnPropertySymbols(req).find((e) =>
            e.toString().includes('kHeaders'),
        );
        const headers = headersKey ? req[headersKey] : {};

        const whiteList = [
            // auth
            'register',
            'activateUserByOtp',
            'loginByEmail',
            'loginByUsername',
            'loginByApple',
            'loginByGoogle',
            'refreshToken',
            'getRefreshToken',
            'uploadImages',
        ];

        // includes on whitelist (just let it flow)
        if (whiteList.includes(fieldName)) return true;

        try {
            const token = headers?.authorization.split(' ')[1];
            const userToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const userRepo = this.connection.getRepository(UserEntity);
            const user = userToken.sub
                ? await userRepo.findOne({
                    where: {
                        id: userToken.sub,
                    },
                })
                : null;

            if (!user) return new UnauthorizedException();

            // WHERE ROLE IS ROOT THEN HAVE ALL ACCESS
            if (user?.role_id == 'b7bf1ad2-96cf-46c3-a5af-16c085ae9385') return true;

            // CHECK USER HAS ACCESS BY FIELDNAME REGISTERED ON ROLE
            const menuRepo = this.connection.getRepository(MenuEntity);
            const menu = await menuRepo.findOne({
                where: {
                    fieldname: fieldName,
                },
            });
            if (!menu) return new UnauthorizedException();

            const permissionRepo = this.connection.getRepository(RolePermissionEntity);
            const permission = await permissionRepo.findOne({
                where: {
                    role_id: user?.role_id,
                    menu_id: menu.id,
                },
            });
            if (!permission) return new UnauthorizedException();

            return true;
        } catch (err) {
            return false;
        }
    }

    getRequest(context: GqlExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        console.log('request', ctx.getInfo().fieldName);
        return ctx.getContext().req;
    }
}
