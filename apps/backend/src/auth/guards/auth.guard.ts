import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string | null => {
        const request = ctx.switchToHttp().getRequest();
        return (
            request.headers['userid'] ||
            request.headers['x-user-id'] ||
            request.user?.id ||
            request.query?.userId ||
            null
        );
    },
);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const userId =
            request.headers['userid'] ||
            request.headers['x-user-id'] ||
            request.user?.id ||
            request.body?.userId;

        if (!userId) {
            throw new UnauthorizedException('Authentication required. Please sign in.');
        }

        request.userId = userId;
        return true;
    }
}

@Injectable()
export class OwnershipGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.userId || request.headers['userid'];
        const cvId = request.params.id || request.params.cvId;

        if (!userId) {
            throw new UnauthorizedException('User identification required');
        }

        request.ownershipContext = { userId, cvId };
        return true;
    }
}
