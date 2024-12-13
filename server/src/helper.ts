import bcrypt from "bcrypt";
import { AppDataSource } from "./dataSource";
import { Role } from "./entities/Role";
import { User } from "./entities/User";

export async function seedDatabase() {
  const roleRepository = AppDataSource.getRepository(Role);
  const userRepository = AppDataSource.getRepository(User);

  // Create roles if they don't exist
  const roles = ["ADMIN", "USER"];
  for (const roleName of roles) {
    const existingRole = await roleRepository.findOne({ where: { name: roleName } });
    if (!existingRole) {
      const role = new Role();
      role.name = roleName;
      await roleRepository.save(role);
      console.log(`Created role: ${roleName}`);
    }
  }

  // Create an admin user if it doesn't exist
  const adminRole = await roleRepository.findOne({ where: { name: "ADMIN" } });
  if (adminRole) {
    const existingAdmin = await userRepository.findOne({ where: { email: "admin@example.com" } });
    if (!existingAdmin) {
      const admin = new User();
      admin.email = "admin@example.com";
      admin.password = await bcrypt.hash("adminpassword", 10);
      admin.firstName = "Admin";
      admin.lastName = "User";
      admin.role = adminRole;
      await userRepository.save(admin);
      console.log("Created admin user");
    }
  }
}