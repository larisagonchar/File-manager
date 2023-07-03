import * as UserController from '../controllers/users.controller';

export const METHODS = {
	'GET': UserController.getUsers,
	'POST': UserController.createUser,
	'PUT': UserController.updateUser,
	'DELETE': UserController.deleteUser
};