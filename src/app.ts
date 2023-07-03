import { createServer } from 'http';
import { config } from 'dotenv';
import { serverHandler } from './handlers/serverHandler';

config();

const server = createServer(serverHandler);
	
const host = process.env.HOST;
const port = +process.env.PORT;
	
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});

