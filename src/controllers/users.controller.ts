import { ServerResponse } from 'http';
import { v4, validate } from 'uuid';
import { users } from '../data/user';
import { writeResponse } from '../helpers/helper';
import { User } from '../models/user.model';

function getUsers(response: ServerResponse, id: string) {
	if (id) {
		if (validate(id)) {
			const user = users.find(user => user.id === id);
			if (user) {
				writeResponse(user, 200, response);
			} else {
				writeResponse('User with such id doesn\'t exist', 404, response);
			}
		} else {
			writeResponse(`${id} isn't valid id`, 400, response);
		}
	} else {
		writeResponse(users, 200, response);
	}
}

function createUser(response: ServerResponse, id: string, body: User) {
	if(id) {
		writeResponse('This endpoint doesn\'t exist', 404, response);
	} else if (body.age && body.username && body.hobbies) {
		const newUser = {
			id: v4(),
			...body
		};

		users.push(newUser);

		writeResponse(newUser, 201, response);
	} else {
		writeResponse('Add all required fields: username, age, hobbies', 400, response);
	}
}

function updateUser(response: ServerResponse, id: string, body: User) {
	if (validate(id)) {
		const index = users.findIndex(user => user.id === id);

		if (index !== -1) {
			if (body.age || body.username || body.hobbies) {
				const updatedUser: User = {
					id: users[index].id,
					username: body.username ?? users[index].username,
					age: body.age ?? users[index].age,
					hobbies: body.hobbies ?? users[index].hobbies
				};

				users[index] = updatedUser;

				writeResponse(updatedUser, 200, response);
			} else {
				writeResponse('Empty body', 400, response);
			}
		} else {
			writeResponse('User with such id doesn\'t exist', 404, response);
		}
	} else {
		writeResponse(`${id} isn't valid id`, 400, response);
	}
}

function deleteUser(response: ServerResponse, id: string) {
	if (validate(id)) {
		const index = users.findIndex(user => user.id === id);

		if (index !== -1) {
			users.splice(index, 1);
			response.statusCode = 204;
		} else {
			writeResponse('User with such id doesn\'t exist', 404, response);
		}
	} else {
		writeResponse(`${id} isn't valid id`, 400, response);
	}
}

export { getUsers, createUser, updateUser, deleteUser };
