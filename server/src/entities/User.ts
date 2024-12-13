import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Role } from "./Role";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field(() => Role)
  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @Column({ nullable: true })
  googleId: string;
}