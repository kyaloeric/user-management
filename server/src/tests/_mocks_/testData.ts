import { Role } from "../../entities/Role";

export const mockUsers = [
    { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', roleId: 1 },
    { id: 2, email: 'test2@example.com', firstName: 'Second', lastName: 'User', roleId: 2 },
  ];
  
  export const mockCreateUserInput = {
    email: 'newuser@example.com',
    password: 'password',
    firstName: 'New',
    lastName: 'User',
    roleId: 1,
  };
  
  export const mockUpdateUserInput = {
    email: 'updated@example.com',
    firstName: 'Updated',
    lastName: 'User',
    roleId: 1,
  };
  
 export const mockNewRole: Role = {
    id: 2,
    name: 'New Role',
    users: [], 
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  