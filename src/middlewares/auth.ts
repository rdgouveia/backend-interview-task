import type { Context, Next } from "koa";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export const authenticate = async (ctx: Context, next: Next) => {
  const verifier = CognitoJwtVerifier.create({
    tokenUse: "access",
    clientId: process.env.AWS_COGNITO_CLIENT_ID!,
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
  });

  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.status = 401;
      ctx.body = { error: "Authorization header missing or invalid" };
      return;
    }

    const token = authHeader.substring(7);
    const payload = await verifier.verify(token);

    ctx.state.user = payload;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
};

export const authorize = (roles: string[]) => {
  return async (ctx: Context, next: Next) => {
    const userRole = ctx.state.user["cognito:groups"]?.[0] || "user";

    if (!roles.includes(userRole)) {
      ctx.status = 403;
      ctx.body = { error: "Insufficient permissions" };
      return;
    }

    await next();
  };
};
