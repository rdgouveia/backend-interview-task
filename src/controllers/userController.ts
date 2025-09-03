import type { Context } from "koa";
import { findOrCreateUser, getUser } from "../services/userServices.js";
import { signUp, login } from "../services/cognitoService.js";
import type { IUser } from "../types";
import userValidate from "./userSchema.js";

export const auth = async (ctx: Context) => {
  try {
    const params = userValidate.validate(ctx.request.body);

    if (params.error) {
      if (params.error.details[0]?.path[0] === "password") {
        ctx.status = 400;
        ctx.body = {
          error:
            "Password is required and must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and at least 8 characters",
        };
      } else {
        ctx.status = 400;
        ctx.body = { error: params.error.details[0]?.message };
      }
      return;
    }

    const user: IUser = {
      name: params.value.name,
      email: params.value.email,
      password: params.value.password,
      group: params.value.group,
    };

    const userData = await findOrCreateUser(user);

    const token = userData.isNew ? await signUp(user) : await login(user);

    if (token?.success === false) {
      return (ctx.body = { error: "Username or password incorrect." });
    }

    return (ctx.body = token?.AuthenticationResult);
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal server error" };
  }
};

export const getMe = async (ctx: Context) => {
  try {
    const userData = await getUser(ctx.state.user.username);

    return (ctx.body = userData);
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal server error" };
  }
};
