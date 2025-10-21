"use server";

import { db } from "@/lib/db";
import { User } from "@/generated/prisma";

// create user
export const createUser = async (user: User) => {
  try {
    const newUser = await db.user.create({ data: user });
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get user by user_id
export const getUserByUserId = async (user_id: string) => {
  try {
    const user = await db.user.findUnique({ where: { user_id } });
    return { error: null, data: user };
  } catch (error: any) {
    return { error, data: null };
  }
};
