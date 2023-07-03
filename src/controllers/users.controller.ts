import { ServerResponse } from 'http';
import { v4, validate } from 'uuid';
import { users } from '../data/user';
import { writeResponse } from '../helpers/helper';
import { User } from '../models/user.model';
import { ErrorMessages, StatusCode } from '../constants/error-messages';

function getUsers(response: ServerResponse, id: string) {
	if (id) {
		if (validate(id)) {
			const user = users.find(user => user.id === id);
			if (user) {
				writeResponse(user, StatusCode.OK, response);
			} else {
				writeResponse(ErrorMessages.NO_USER_WITH_ID, StatusCode.NO_FOUND, response);
			}
		} else {
			writeResponse(id + ErrorMessages.INVALID_ID, StatusCode.BAD_REQUEST, response);
		}
	} else {
		writeResponse(users, StatusCode.OK, response);
	}
}

function createUser(response: ServerResponse, id: string, body: User) {
	if(id) {
		writeResponse(ErrorMessages.ENDPOINT_NOT_EXIST, StatusCode.NO_FOUND, response);
	} else if (body.age && body.username && body.hobbies) {
		const newUser = {
			id: v4(),
			...body
		};

		users.push(newUser);

		writeResponse(newUser, StatusCode.CREATED, response);
	} else {
		writeResponse(ErrorMessages.REQUIRED_FIELDS, StatusCode.BAD_REQUEST, response);
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

				writeResponse(updatedUser, StatusCode.OK, response);
			} else {
				writeResponse(ErrorMessages.EMPTY_BODY, StatusCode.BAD_REQUEST, response);
			}
		} else {
			writeResponse(ErrorMessages.NO_USER_WITH_ID, StatusCode.NO_FOUND, response);
		}
	} else {
		writeResponse(id + ErrorMessages.INVALID_ID, StatusCode.BAD_REQUEST, response);
	}
}

function deleteUser(response: ServerResponse, id: string) {
	if (validate(id)) {
		const index = users.findIndex(user => user.id === id);

		if (index !== -1) {
			users.splice(index, 1);
			response.statusCode = StatusCode.NO_CONTENT;
		} else {
			writeResponse(ErrorMessages.NO_USER_WITH_ID, StatusCode.NO_FOUND, response);
		}
	} else {
		writeResponse(id + ErrorMessages.INVALID_ID, StatusCode.BAD_REQUEST, response);
	}
}

export { getUsers, createUser, updateUser, deleteUser };
