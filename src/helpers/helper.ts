import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../models/user.model';

export function writeResponse<T>(message: T, status: number, response: ServerResponse) {
	response.statusCode = status;
	response.setHeader('Content-Type', 'application/json');
	response.end(JSON.stringify(message));
}

export async function getBody(request: IncomingMessage): Promise<User> {
	return new Promise((resolve, reject) => {
		const bodyParts: Uint8Array[] = [];

		request.on('data', (chunk: Uint8Array) => {
			bodyParts.push(chunk);
		}).on('end', () => {
			try {
				if (bodyParts.length) {
					const body: User = JSON.parse(Buffer.concat(bodyParts).toString());
					resolve(body);
				}

				resolve(null);
			} catch {
				reject();
			}
		});
	});
}