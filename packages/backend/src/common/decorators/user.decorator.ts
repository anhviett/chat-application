import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract user from JWT token in request
 * Usage: @User() user: any
 */
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
