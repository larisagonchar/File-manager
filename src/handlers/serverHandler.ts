import { IncomingMessage, ServerResponse } from 'http';
import { getBody, writeResponse } from '../helpers/helper';
import { METHODS } from '../constants/methods';
import { User } from '../models/user.model';
import { ErrorMessages, StatusCode } from '../constants/error-messages';

export const serverHandler = async (request: IncomingMessage, response: ServerResponse) => {
	try {
		const url = request.url.split('/');
		url.shift();

		if (url[0] !== 'api' || url[1] !== 'users' || url[3]) {
			writeResponse(ErrorMessages.ENDPOINT_NOT_EXIST, StatusCode.NO_FOUND, response);
			return;
		}

		const method = request.method as keyof typeof METHODS;
		const id = url[2];
		const body: User = await getBody(request);
		const makeAction = METHODS[method];
		makeAction(response, id, body);
	} catch {
		writeResponse(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR, response);
	}
};