import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";
import { RoleService } from "./RoleService";
import { NotFoundError, ValidationError } from "../utils/errors";
import { CreateUserInput, UpdateUserInput } from "../types";


export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private roleService = new RoleService();

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ["role"] });
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ["role"] });
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(data:CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new ValidationError(`User with email ${data.email} already exists`);
    }

    const role = await this.roleService.findRoleById(data.roleId);
    const user = this.userRepository.create({ ...data, role });
    return this.userRepository.save(user);
  }

  async updateUser(id: number, data:UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id);
    if (data.roleId) {
      const role = await this.roleService.findRoleById(data.roleId);
      user.role = role;
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.findUserById(id);
    await this.userRepository.remove(user);
    return true;
  }
}





