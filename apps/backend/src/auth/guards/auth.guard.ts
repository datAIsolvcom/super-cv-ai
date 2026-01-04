import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

// Key for public route metadata
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark routes as public (no auth required)
 * @example @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Decorator to extract userId from request headers
 * Works with both header-based auth (from frontend) and JWT
 * @example @CurrentUser() userId: string
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string | null => {
        const request = ctx.switchToHttp().getRequest();
        // Try multiple sources: headers, user object (JWT), query param
        return (
            request.headers['userid'] ||
            request.headers['x-user-id'] ||
            request.user?.id ||
            request.query?.userId ||
            null
        );
    },
);

/**
 * Global Auth Guard
 * Checks for userId in request headers or body
 * Can be bypassed with @Public() decorator
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        // Check for user identification
        const userId =
            request.headers['userid'] ||
            request.headers['x-user-id'] ||
            request.user?.id ||
            request.body?.userId;

        if (!userId) {
            throw new UnauthorizedException(
                'Authentication required. Please sign in.',
            );
        }

        // Attach userId to request for use in handlers
        request.userId = userId;

        return true;
    }
}

/**
 * Ownership Guard for CV resources
 * Ensures user can only access their own CVs
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.userId || request.headers['userid'];
        const cvId = request.params.id || request.params.cvId;

        if (!userId) {
            throw new UnauthorizedException('User identification required');
        }

        // Note: Actual ownership check should be done in service layer
        // This guard just ensures the userId is present for the check
        request.ownershipContext = { userId, cvId };

        return true;
    }
}
