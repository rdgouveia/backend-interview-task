import type { Context } from "koa";
import {
  findOrCreateUser,
  getUser,
  getUsers,
  editUsers,
} from "../services/userServices.js";
import { signUp, login, editUserCognito } from "../services/cognitoService.js";
import type { IUser } from "../types";
import {
  pagination,
  createUserBody,
  editUserBody,
  editUserQuery,
} from "./userSchema.js";

export const auth = async (ctx: Context) => {
  const params = createUserBody.validate(ctx.request.body);

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

  try {
    const userExists = await getUser(user.email);

    if (userExists) {
      ctx.status = 400;
      ctx.body = { error: "User already exists" };
      return;
    }

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

export const allUsers = async (ctx: Context) => {
  const params = pagination.validate(ctx.request.query);

  if (params.error) {
    ctx.status = 400;
    ctx.body = { error: params.error.details[0]?.message };
    return;
  }

  try {
    const users = await getUsers(params.value.page, params.value.limit);

    let morePages = false;
    if (users.length > params.value.limit) {
      morePages = true;
      users.pop();
    }

    return (ctx.body = { users, morePages });
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: "Internal server error" };
  }
};

export const editUser = async (ctx: Context) => {
  const params = editUserBody.validate(ctx.request.body);
  const query = editUserQuery.validate(ctx.request.query);

  if (params.error) {
    ctx.status = 400;
    ctx.body = { error: params.error.details[0]?.message };
    return;
  }

  if (query.error) {
    ctx.status = 400;
    ctx.body = { error: query.error.details[0]?.message };
    return;
  }

  const noAdminPermission =
    ctx.state.user["cognito:groups"]?.[0] !== "admin" &&
    ctx.state.user.username !== query.value.email;

  if (noAdminPermission) {
    ctx.status = 403;
    ctx.body = { error: "Only admin users can edit other users." };
    return;
  }

  const noPermission =
    ctx.state.user["cognito:groups"]?.[0] !== "admin" && params.value.group;

  if (noPermission) {
    ctx.status = 403;
    ctx.body = { error: "Only admins can update group" };
    return;
  }

  const userToUpdate = await getUser(query.value.email);

  if (!userToUpdate) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };
    return;
  }

  try {
    await editUserCognito(query.value.email, {
      name: params.value.name,
      group: { new: params.value.group, old: userToUpdate?.role },
    });
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: "Error while editing user on Cognito" };
    return;
  }

  try {
    await editUsers(query.value.email, params.value);
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: "Error while editing user on Database" };
    return;
  }

  return (ctx.body = { success: true });
};
