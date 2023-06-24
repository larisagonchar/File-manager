import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { Helper } from '../helpers/helper.js';

export class Hash {
    async printHashFile(pathToFile) {
        try {
            const data = await readFile(Helper.GetFullPath(pathToFile));
            const hash = createHash('sha256').update(data).digest('hex');
            console.log(hash);
        } catch {
            console.log('Operation failed');
        }
    }
}

export const hash = new Hash();