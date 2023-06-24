import { readdir } from 'fs/promises';
import { resolve, sep } from 'path';
import { chdir, cwd } from 'process';

class Navigation {
    currentDirectory = '';

    async printListOfFiles() {
        try {
            const data = await readdir(this.currentDirectory);
            const tableData = data.map((item) => {
                if (item.includes('.')) {//another condition
                    return {
                        name: item,
                        type: 'file'
                    }
                } else {
                    return {
                        name: item,
                        type: 'directory'
                    }
                }
            }).sort((a, b) => a.type.localeCompare(b.type));
    
            console.table(tableData);
        } catch {
            console.log('Operation failed');
        }
    }

    async navigateToDirectory(pathToDirectory) {
        const newPath = resolve(this.currentDirectory, pathToDirectory);

        try {
            chdir(newPath);
            this.currentDirectory = cwd();
        } catch {
            console.log('Operation failed');
        }
    }

    navigateToUpperDirectory() {
        const directories = this.currentDirectory.split(sep);
        if (directories.length !== 1) {
            directories.pop();
            this.currentDirectory = resolve(...directories);
        }
    }

    printCurrentDirectory() {
        console.log(`\nYou are currently in ${this.currentDirectory}\n`);
    }

    setCurrrentDirectory(currentDirectory) {
        this.currentDirectory = currentDirectory;
    }
}

export const navigation = new Navigation();