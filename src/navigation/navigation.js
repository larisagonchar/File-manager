import { readdir } from 'fs/promises';
import { join, resolve, sep } from 'path';
import { chdir, cwd } from 'process';
import { Helper } from '../helpers/helper.js';

class Navigation {

    async printListOfFiles() {
        try {
            const files = await readdir(cwd(), {
                withFileTypes: true
            });

            const tableData = [];

            for (let i = 0; i < files.length; i++) {
                if (files[i].isFile()) {
                    tableData.push({
                        name: files[i].name,
                        type: 'file'
                    });
                } else {
                    tableData.push({
                        name: files[i].name,
                        type: 'directory'
                    });
                }
            }

            tableData.sort((a, b) => a.type.localeCompare(b.type));
    
            console.table(tableData);
        } catch {
            console.log('Operation failed');
        }
    }

    async navigateToDirectory(pathToDirectory) {
        const newPath = resolve(cwd(), pathToDirectory);

        try {
            this.setCurrrentDirectory(newPath);
        } catch {
            console.log('Operation failed');
        }
    }

    navigateToUpperDirectory() {
        this.navigateToDirectory('..');
    }

    printCurrentDirectory() {
        console.log(`\nYou are currently in ${cwd()}\n`);
    }

    setCurrrentDirectory(currentDirectory) {
        chdir(currentDirectory);
    }
}

export const navigation = new Navigation();