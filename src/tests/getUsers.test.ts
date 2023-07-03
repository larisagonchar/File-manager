import { ServerResponse } from 'http';
import { createUser, getUsers } from '../controllers/users.controller';
import { users } from '../data/user';
import { ErrorMessages, StatusCode } from '../constants/error-messages';
import { User } from '../models/user.model';

describe('get users method', () => {
	const response = {
		statusCode: 0,
		setHeader: (a, b) => {},
		end: (data) => {}
	} as ServerResponse;

	beforeEach(() => {
		response.end = jest.fn();
	});

	test('should send all users in response if id is not provided', () => {
		getUsers(response, null);

		expect(response.statusCode).toBe(StatusCode.OK);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(users));
	});

	test('should send user in response if id is valid and provided', () => {
		const body = {
			username: 'user',
			age: 15,
			hobbies: ['read']
		} as User;
		createUser(response, null, body);
		getUsers(response, users[0].id);


		expect(response.statusCode).toBe(StatusCode.OK);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify({
			id: users[0].id,
			...body
		}));
	});

	test('should send message in response if id is not valid', () => {
		const id = 'some id';
		getUsers(response, id);

		expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(id + ErrorMessages.INVALID_ID));
	});

	test('should send message in response if no user with such id', () => {
		getUsers(response, '7d3856a0-18dc-11ee-9863-55e358574727');

		expect(response.statusCode).toBe(StatusCode.NO_FOUND);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(ErrorMessages.NO_USER_WITH_ID));
	});
});