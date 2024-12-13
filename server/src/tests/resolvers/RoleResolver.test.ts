import { Role } from "../../entities/Role";
import { RoleResolver } from "../../resolvers/RoleResolver";
import { RoleService } from "../../services/RoleService";
import { UpdateRoleInput } from "../../types";
import { NotFoundError } from "../../utils/errors";


jest.mock('../../services/RoleService');

describe('RoleResolver', () => {
  let roleResolver: RoleResolver;
  let mockRoleService: jest.Mocked<RoleService>;

  beforeEach(() => {
    mockRoleService = new RoleService() as jest.Mocked<RoleService>;
    roleResolver = new RoleResolver();
    (roleResolver as any).roleService = mockRoleService;
  });

  describe('roles', () => {
    it('should return all roles', async () => {
      const mockRoles = [{ id: 1, name: 'Admin' }, { id: 2, name: 'User' }];
      mockRoleService.findAllRoles.mockResolvedValue(mockRoles as Role[]);

      const result = await roleResolver.roles();

      expect(result).toEqual(mockRoles);
      expect(mockRoleService.findAllRoles).toHaveBeenCalled();
    });
  });

  describe('role', () => {
    it('should return a role by id', async () => {
      const mockRole = { id: 1, name: 'Admin' };
      mockRoleService.findRoleById.mockResolvedValue(mockRole as Role);

      const result = await roleResolver.role(1);

      expect(result).toEqual(mockRole);
      expect(mockRoleService.findRoleById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError if role not found', async () => {
        mockRoleService.findRoleById.mockRejectedValue(new NotFoundError('Role not found'));
  
        await expect(roleResolver.role(999)).rejects.toThrow(NotFoundError);
        expect(mockRoleService.findRoleById).toHaveBeenCalledWith(999);
      });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const mockRole = { id: 1, name: 'NewRole' };
      mockRoleService.createRole.mockResolvedValue(mockRole as Role);

      const result = await roleResolver.createRole('NewRole');

      expect(result).toEqual(mockRole);
      expect(mockRoleService.createRole).toHaveBeenCalledWith('NewRole');
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const mockRole = { id: 1, name: 'UpdatedRole' };
      const updateData: UpdateRoleInput = { name: 'UpdatedRole' };
      mockRoleService.updateRole.mockResolvedValue(mockRole as Role);

      const result = await roleResolver.updateRole(1, updateData);

      expect(result).toEqual(mockRole);
      expect(mockRoleService.updateRole).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      mockRoleService.deleteRole.mockResolvedValue(true);

      const result = await roleResolver.deleteRole(1);

      expect(result).toBe(true);
      expect(mockRoleService.deleteRole).toHaveBeenCalledWith(1);
    });


    it('should return false if role deletion fails', async () => {
        mockRoleService.deleteRole.mockResolvedValue(false);
  
        const result = await roleResolver.deleteRole(999);
  
        expect(result).toBe(false);
        expect(mockRoleService.deleteRole).toHaveBeenCalledWith(999);
      });
    });
  
    // Test for authorization
    describe('Authorization', () => {
      it('should have Authorized decorator with ADMIN role for createRole', () => {
        const createRoleDescriptor = Object.getOwnPropertyDescriptor(RoleResolver.prototype, 'createRole');
        expect(createRoleDescriptor?.value['@Authorized']).toEqual(['ADMIN']);
      });
  
      it('should have Authorized decorator with ADMIN role for updateRole', () => {
        const updateRoleDescriptor = Object.getOwnPropertyDescriptor(RoleResolver.prototype, 'updateRole');
        expect(updateRoleDescriptor?.value['@Authorized']).toEqual(['ADMIN']);
      });
  
      it('should have Authorized decorator with ADMIN role for deleteRole', () => {
        const deleteRoleDescriptor = Object.getOwnPropertyDescriptor(RoleResolver.prototype, 'deleteRole');
        expect(deleteRoleDescriptor?.value['@Authorized']).toEqual(['ADMIN']);
      });
    });
  });