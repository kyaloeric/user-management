import { AppDataSource } from "../dataSource";
import { Role } from "../entities/Role";
import { NotFoundError, ValidationError } from "../utils/errors";

export class RoleService {
  private roleRepository = AppDataSource.getRepository(Role);

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundError(`Role with id ${id} not found`);
    }
    return role;
  }

  async createRole(name: string): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ValidationError(`Role with name ${name} already exists`);
    }
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async updateRole(id: number, data: Partial<Role>): Promise<Role> {
    const role = await this.findRoleById(id);
    Object.assign(role, data);
    return this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<boolean> {
    const role = await this.findRoleById(id);
    await this.roleRepository.remove(role);
    return true;
  }
}
