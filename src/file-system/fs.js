import { createReadStream, createWriteStream } from 'fs';
import { writeFile, rename, rm } from 'fs/promises';
import { stdout } from 'process';
import { Helper } from '../helpers/helper.js';

class FileSystem {
    async createFile(newFileName) {
        try {
            await writeFile(Helper.GetFullPath(newFileName), '');
        } catch {
            console.log('Operation failed');
        }
    }

    async renameFile(pathToFile, newFileName) {
        try {
            await rename(Helper.GetFullPath(pathToFile), Helper.GetFullPath(newFileName));
        } catch {
            console.log('Operation failed');
        }
    }

    async deleteFile(pathToFile) {
        try {
            await rm(Helper.GetFullPath(pathToFile));
        } catch {
            console.log('Operation failed');
        }
    }

    async readFile(pathToFile) {
        return new Promise((resolve) => {
            const readStream = createReadStream(Helper.GetFullPath(pathToFile));

            readStream.on('error', () => {
                console.log('Operation failed');
                resolve(readStream);
            });

            readStream.on('end', () => {
                resolve(readStream);
            });
    
            readStream.pipe(stdout);
        });
    }

    async copyFile(pathToFile, pathToNewFile) {
        return new Promise((resolve) => {
            const readStream = createReadStream(Helper.GetFullPath(pathToFile));

            readStream.on('error', () => {
                console.log('Operation failed');
                resolve(readStream);
            });

            readStream.on('open', () => {
                const writeStream = createWriteStream(Helper.GetFullPath(pathToNewFile));
                readStream.pipe(writeStream);
                resolve(readStream);
            });
        });
    }

    async moveFile(pathToFile, pathToNewFile) {
        await this.copyFile(pathToFile, pathToNewFile);
        await this.deleteFile(pathToFile);
    }
}

export const fileSystem = new FileSystem();