import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Helper } from '../helpers/helper.js';

class Compress {
    async compressFile(pathToFile, pathToDestination) {
        const gzip = createBrotliCompress();
        await this.makeAction(gzip, pathToFile, pathToDestination);
    }

    async decompressFile(pathToFile, pathToDestination) {
        const gunzip = createBrotliDecompress();
        await this.makeAction(gunzip, pathToFile, pathToDestination);
    }

    async makeAction(action, pathToFile, pathToDestination) {// when fail create file
        return new Promise(async (resolve) => {
            const readStream = createReadStream(Helper.GetFullPath(pathToFile));
            
            readStream.on('open', async () => {
                const writeStream = createWriteStream(Helper.GetFullPath(pathToDestination));
                await pipeline(readStream, action, writeStream);
                resolve(readStream);
            });

            readStream.on('error', () => {
                console.log('Operation failed');
                resolve(readStream);
            });
        });
    }
}

export const compress = new Compress();