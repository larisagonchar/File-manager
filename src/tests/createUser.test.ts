import { ServerResponse } from 'http';
import { ErrorMessages, StatusCode } from '../constants/error-messages';
import { users } from '../data/user';
import { createUser } from '../controllers/users.controller';
import { User } from '../models/user.model';

describe('create user method', () => {
	const response = {
		statusCode: 0,
		setHeader: (a, b) => {},
		end: (data) => {}
	} as ServerResponse;

	beforeEach(() => {
		response.end = jest.fn();
	});

	test('should create user', () => {
		const body = {
			username: 'user',
			age: 15,
			hobbies: ['read']
		} as User;
		createUser(response, null, body);

		expect(response.statusCode).toBe(StatusCode.CREATED);
		expect(users[0]).toEqual({
			id: users[0].id,
			...body
		});
	});

	test('should send message in response if not all fields were provided', () => {
		const body = {
			username: 'user',
			age: 15
		} as User;
		createUser(response, null, body);

		expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(ErrorMessages.REQUIRED_FIELDS));
	});
});