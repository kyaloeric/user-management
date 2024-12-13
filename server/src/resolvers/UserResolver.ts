import { Resolver, Query, Mutation, Arg, Authorized, ID, Ctx } from "type-graphql";
import { UserService } from "../services/UserService";
import { User } from "../entities/User";
import { CreateUserInput, UpdateUserInput } from "../types";

@Resolver(User)
export class UserResolver {
  private userService = new UserService();

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User | null> {
    return this.userService.findUserById(id);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => User)
  async createUser(
    @Arg("data") data: CreateUserInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => User)
  async updateUser(
    @Arg("id", () => ID) id: number,
    @Arg("data") data:UpdateUserInput
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => ID) id: number): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @Query(() => User)
  async me(@Ctx() context: any): Promise<User> {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    return this.userService.findUserById(context.user.id);
  }
}



