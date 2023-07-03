import { ServerResponse } from 'http';
import { createUser, updateUser } from '../controllers/users.controller';
import { User } from '../models/user.model';
import { ErrorMessages, StatusCode } from '../constants/error-messages';
import { users } from '../data/user';

describe('update user method', () => {
	const response = {
		statusCode: 0,
		setHeader: (a, b) => { },
		end: (data) => { }
	} as ServerResponse;

	beforeEach(() => {
		response.end = jest.fn();

		const body = {
			username: 'user',
			age: 15,
			hobbies: ['read']
		} as User;
		createUser(response, null, body);
	});

	test('should update user', () => {
		const bodyForUpdate = {
			username: 'user2',
			age: 22
		} as User;
		updateUser(response, users[0].id, bodyForUpdate);

		expect(response.statusCode).toBe(StatusCode.OK);
		expect(users[0]).toEqual({
			id: users[0].id,
			hobbies: users[0].hobbies,
			...bodyForUpdate
		});
	});

	test('should send message in response if empty body', () => {
		const body = {} as User;
		updateUser(response, users[0].id, body);

		expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(ErrorMessages.EMPTY_BODY));
	});

	test('should send message in response if id is not valid', () => {
		const id = 'some id';
		const body = {} as User;
		updateUser(response, id, body);

		expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(id + ErrorMessages.INVALID_ID));
	});

	test('should send message in response if no user with such id', () => {
		const id = '7d3856a0-18dc-11ee-9863-55e358574727';
		const body = {} as User;
		updateUser(response, id, body);

		expect(response.statusCode).toBe(StatusCode.NO_FOUND);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify(ErrorMessages.NO_USER_WITH_ID));
	});
});