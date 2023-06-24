import { cwd } from 'process';

export class Helper {
    static GetFullPath(pathToFile) {
        return cwd() + '\\' + pathToFile;
    }
}