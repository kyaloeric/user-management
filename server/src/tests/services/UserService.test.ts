import { ValidationError } from "apollo-server-express";
import { RoleService } from "../../services/RoleService";
import { UserService } from "../../services/UserService";
import { CreateUserInput, UpdateUserInput } from "../../types";
import { NotFoundError } from "../../utils/errors";
import { mockNewRole } from "../_mocks_/testData"; 

jest.mock('../dataSource');
jest.mock('./RoleService');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: any;
  let mockRoleService: jest.Mocked<RoleService>;

  beforeEach(() => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };


    mockRoleService = new RoleService() as jest.Mocked<RoleService>;
    (RoleService as jest.Mock).mockImplementation(() => mockRoleService);

    userService = new UserService();
  });

  describe('findAllUsers', () => {
    it('should return all users with their roles', async () => {
      const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await userService.findAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledWith({ relations: ['role'] });
    });
  });

  describe('findUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['role'] });
    });

    it('should throw NotFoundError if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findUserById(1)).rejects.toThrow(NotFoundError);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockRole =mockNewRole;
      const mockUserInput: CreateUserInput = {
          firstName: 'Test', lastName: 'User', email: 'new@example.com', roleId: 1,
          password: ""
      };
      const mockCreatedUser = { id: 1, ...mockUserInput, role: mockRole };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleService.findRoleById.mockResolvedValue(mockRole);
      mockUserRepository.create.mockReturnValue(mockCreatedUser);
      mockUserRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(mockUserInput);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: mockUserInput.email } });
      expect(mockRoleService.findRoleById).toHaveBeenCalledWith(mockUserInput.roleId);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ ...mockUserInput, role: mockRole });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    });

    it('should throw ValidationError if user with email already exists', async () => {
        const mockUserInput: CreateUserInput = {
            firstName: 'Test', lastName: 'User', email: 'new@example.com', roleId: 1,
            password: ""
        };        
        mockUserRepository.findOne.mockResolvedValue({ id: 2, email: 'existing@example.com' });
  
        await expect(userService.createUser(mockUserInput)).rejects.toThrow(ValidationError);
      });
    });
  
    describe('updateUser', () => {
      it('should update an existing user', async () => {
        const mockUser = { id: 1, firstName: 'User 1', email: 'user1@example.com', role: { id: 1 } };
        const mockUpdateInput: UpdateUserInput = { firstName: 'Updated User' };
        const mockUpdatedUser = { ...mockUser, ...mockUpdateInput };
  
        mockUserRepository.findOne.mockResolvedValue(mockUser);
        mockUserRepository.save.mockResolvedValue(mockUpdatedUser);
  
        const result = await userService.updateUser(1, mockUpdateInput);
  
        expect(result).toEqual(mockUpdatedUser);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['role'] });
        expect(mockUserRepository.save).toHaveBeenCalledWith(mockUpdatedUser);
      });
  
      it('should update user role if roleId is provided', async () => {
        const mockUser = { id: 2, firstName: 'User 1', email: 'user1@example.com', role: { id: 1 } };
        const mockUpdateInput: UpdateUserInput = { firstName: 'Updated User', roleId: 2 };
        const mockUpdatedUser = { ...mockUser, ...mockUpdateInput, role: mockNewRole };
  
        mockUserRepository.findOne.mockResolvedValue(mockUser);
        mockRoleService.findRoleById.mockResolvedValue(mockNewRole);
        mockUserRepository.save.mockResolvedValue(mockUpdatedUser);
  
        const result = await userService.updateUser(1, mockUpdateInput);
  
        expect(result).toEqual(mockUpdatedUser);
        expect(mockRoleService.findRoleById).toHaveBeenCalledWith(mockUpdateInput.roleId);
        expect(mockUserRepository.save).toHaveBeenCalledWith(mockUpdatedUser);
      });
  
      it('should throw NotFoundError if user is not found', async () => {
        mockUserRepository.findOne.mockResolvedValue(null);
  
        await expect(userService.updateUser(1, { firstName: 'Updated User' })).rejects.toThrow(NotFoundError);
      });
    });
  
    describe('deleteUser', () => {
      it('should delete an existing user', async () => {
        const mockUser = { id: 1, name: 'User 1' };
        mockUserRepository.findOne.mockResolvedValue(mockUser);
        mockUserRepository.remove.mockResolvedValue(mockUser);
  
        const result = await userService.deleteUser(1);
  
        expect(result).toBe(true);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 }, relations: ['role'] });
        expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
      });
  
      it('should throw NotFoundError if user is not found', async () => {
        mockUserRepository.findOne.mockResolvedValue(null);
  
        await expect(userService.deleteUser(1)).rejects.toThrow(NotFoundError);
      });
    });
  });