import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { AuthService } from "../services/AuthService";
import { User } from "../entities/User";

@Resolver(User)
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    return this.authService.login(email, password);
    
  }

  @Query(() => String)
  async googleOAuth(@Ctx() context: any): Promise<string> {
    if (!context.user) {
      throw new Error("OAuth failed");
    }
    return context.user; // token generated from Passport
  }
}
