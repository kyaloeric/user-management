

import { Resolver, Query, Mutation, Arg, Authorized, ID } from "type-graphql";
import { RoleService } from "../services/RoleService";
import { Role } from "../entities/Role";
import { UpdateRoleInput } from "../types";

@Resolver(Role)
export class RoleResolver {
  private roleService = new RoleService();

  @Authorized(["ADMIN"])
  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }
 
  @Query(() => Role, { nullable: true })
  async role(@Arg("id", () => ID) id: number): Promise<Role | null> {
    return this.roleService.findRoleById(id);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Role)
  async createRole(@Arg("name") name: string): Promise<Role> {
    return this.roleService.createRole(name);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Role)
  async updateRole(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateRoleInput
  ): Promise<Role> {
    return this.roleService.updateRole(id, data);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Boolean)
  async deleteRole(@Arg("id", () => ID) id: number): Promise<boolean> {
    return this.roleService.deleteRole(id);
  }
}























