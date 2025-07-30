import { AuthTypes } from "@/src/modules/auth/auth.types";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthTypes.JWT) {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard{
    handleRequest(err: any, user: any) {
        return user;
    }
}