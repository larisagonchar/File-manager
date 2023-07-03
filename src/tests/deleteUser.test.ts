import { ServerResponse } from 'http';
import { createUser, deleteUser } from '../controllers/users.controller';
import { ErrorMessages, StatusCode } from '../constants/error-messages';
import { users } from '../data/user';
import { User } from '../models/user.model';

describe('delete user method', () => {
	const response = {
		statusCode: 0,
		setHeader: (a, b) => {},
		end: (data) => {}
	} as ServerResponse;

	beforeEach(() => {
		response.end = jest.fn();
	});

	test('should delete user if id is valid and provided', () => {
		const body = {
			username: 'user',
			age: 15,
			hobbies: ['read']
		} as User;
		createUser(response, null, body);
		deleteUser(response, users[0].id);

		expect(users).toEqual([]);
		expect(response.statusCode).toBe(StatusCode.NO_CONTENT);
	});

	test('should send message in response if id is not valid', () => {
		const id = 'some id';
		deleteUser(response, id);

		expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(id + ErrorMessages.INVALID_ID));
	});

	test('should send message in response if no user with such id', () => {
		deleteUser(response, '7d3856a0-18dc-11ee-9863-55e358574727');

		expect(response.statusCode).toBe(StatusCode.NO_FOUND);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(ErrorMessages.NO_USER_WITH_ID));
	});
});