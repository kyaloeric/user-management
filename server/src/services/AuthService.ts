import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { RoleService } from "./RoleService";
import { AppDataSource } from "../dataSource";
import {Profile } from "passport-google-oauth20";
import { NotFoundError, ValidationError } from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private roleService = new RoleService();

  async register(email: string, password: string, roleId: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const role = await this.roleService.findRoleById(roleId);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ["role"] });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new ValidationError("Incorrect password");
    }

    return this.generateToken(user);

    
  }

 async googleOAuth(profile: Profile): Promise<string> {
  if (!profile.emails || profile.emails.length === 0) {
    throw new ValidationError("No email found in the Google profile");
  }

  const email = profile.emails[0].value;

  let user = await this.userRepository.findOne({ where: { email }, relations: ["role"] });

  if (!user) {
    const role = await this.roleService.findRoleById(2); 

    user = this.userRepository.create({
      email,
      firstName: profile.name?.givenName,  
      lastName: profile.name?.familyName,  
      role,
      googleId: profile.id,
    });

    user = await this.userRepository.save(user);
  }

  return this.generateToken(user);
}

  generateToken(user: User): string {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    console.log("Generated JWT Token:", token); // Log the token to the console
    return token;
  }

  // generateToken(user: User): string {
  //   return jwt.sign(
  //     {
  //       id: user.id,
  //       email: user.email,
  //       role: user.role.name,
  //     },
  //     JWT_SECRET,
  //     { expiresIn: "1h" }
  //   );
  // }

  verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
