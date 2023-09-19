import { UsersDbPg } from '../../repositories/UserRepository';

const database = new UsersDbPg();

const deleteUser = async (id: string): Promise<void> => {
  const userExists = await database.existingUser(id);

  if (userExists.length <= 0) {
    throw new Error('User does not exist');
  }

  database.deleteUser(id);
};

export default deleteUser;