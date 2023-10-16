import { join } from 'path';
import { cwd } from 'process';

export class Helper {
    static GetFullPath(pathToFile) {
        return join(cwd(), pathToFile);
    }
}