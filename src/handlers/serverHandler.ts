import { IncomingMessage, ServerResponse } from 'http';
import { getBody, writeResponse } from '../helpers/helper';
import { METHODS } from '../constants/methods';
import { User } from '../models/user.model';

export const serverHandler = async (request: IncomingMessage, response: ServerResponse) => {
	try {
		const url = request.url.split('/');
		url.shift();

		if (url[0] !== 'api' || url[1] !== 'users' || url[3]) {
			writeResponse('This endpoint doesn\'t exist', 404, response);
			return;
		}

		const method = request.method as keyof typeof METHODS;
		const id = url[2];
		const body: User = await getBody(request);
		const makeAction = METHODS[method];
		makeAction(response, id, body);
	} catch {
		writeResponse('Internal server error', 500, response);
	}
};