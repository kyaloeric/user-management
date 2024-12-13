import { AuthChecker } from "type-graphql";
import { User } from "../entities/User";
import { AppDataSource } from "../dataSource";

export const authChecker: AuthChecker<{ user: User }> = async ({ context }, roles) => {
  const { user } = context;

  if (!user) {
    return false;
  }

  const userRepository = AppDataSource.getRepository(User);
  const dbUser = await userRepository.findOne({ where: { id: user.id }, relations: ["role"] });

  if (!dbUser) {
    return false;
  }

  if (roles.length === 0) {
    return true;
  }

  if (roles.includes(dbUser.role.name)) {
    return true;
  }

  return false;
};