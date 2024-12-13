import { UserResolver } from "../../resolvers/UserResolver";
import { UserService } from "../../services/UserService";
import { NotFoundError } from "../../utils/errors";
import { mockUsers, mockCreateUserInput, mockUpdateUserInput } from "../_mocks_/testData";

jest.mock('../../services/UserService'); // Mock the service

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    userResolver = new UserResolver();
  });

  it('should return all users', async () => {
    let mockUsers: any
    (userService.findAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    
    const result = await userResolver.users();
    expect(result).toEqual(mockUsers);
  });

  it('should return a user by id', async () => {
    const user = mockUsers[0]; // Using the first mock user
    (userService.findUserById as jest.Mock).mockResolvedValue(user);
    
    const result = await userResolver.user(user.id);
    expect(result).toEqual(user);
  });

  it('should throw NotFoundError if user not found', async () => {
    (userService.findUserById as jest.Mock).mockRejectedValue(new NotFoundError('User not found'));
    
    await expect(userResolver.user(999)).rejects.toThrow(NotFoundError);
  });

  it('should create a new user', async () => {
    (userService.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      ...mockCreateUserInput,
    });

    const result = await userResolver.createUser(mockCreateUserInput);
    expect(result).toEqual({
      id: 1,
      ...mockCreateUserInput,
    });
  });

  it('should update a user', async () => {
    const updatedUser = { id: 1, ...mockUpdateUserInput };
    (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

    const result = await userResolver.updateUser(1, mockUpdateUserInput);
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(true);

    const result = await userResolver.deleteUser(1);
    expect(result).toBe(true);
  });
});
