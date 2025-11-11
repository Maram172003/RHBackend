import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        // Rôles requis (depuis le decorator @Roles)
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!required || required.length === 0) return true;

        // Utilisateur injecté par JwtStrategy.validate()
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as { id: string; email: string; roles?: Role[] };

        if (!user || !Array.isArray(user.roles)) return false;
        const roles = user.roles as Role[];
        return required.some((r) => roles.includes(r));
    }
}
