import { AppDataSource } from "../config/database.js";
import { User } from "../models/User.js";
import type { IUser } from "../types/index.js";

const userRepository = AppDataSource.getRepository(User);

export const findOrCreateUser = async (user: IUser) => {
  const userData = await userRepository.findOne({
    where: { email: user.email },
  });

  if (!userData) {
    const newUser = userRepository.create({
      email: user.email,
      name: user.name,
      role: user.group,
      isOnboarded: false,
    });

    await userRepository.save(newUser);

    return { user: newUser, isNew: true };
  }

  return { user, isNew: false };
};

export const getUser = async (email: string) => {
  const userData = await userRepository.findOne({
    where: { email },
  });

  return userData;
};

export const getUsers = async (page: number, limit: number) => {
  const users = await userRepository.find({
    skip: page * limit,
    take: limit + 1,
  });

  return users;
};
