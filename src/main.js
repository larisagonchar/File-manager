import { argv } from 'process';
import { COMMANDS } from './constants/commands.js';
import { createInterface } from 'readline';
import { fileSystem } from './file-system/fs.js';
import { operatingSystem } from './operating-system/os.js';
import { hash } from './hash/hash.js';
import { compress } from './compress/compress.js';
import { navigation } from "./navigation/navigation.js";

export class FileManager {
    username = '';

    startApp() {
        this.username = argv.slice(2)[0].split('=')[1];
        console.log(`Welcome to the File Manager, ${this.username}!`);

        navigation.setCurrrentDirectory(operatingSystem.homedir);
        navigation.printCurrentDirectory();

        this.addListeners();
    }

    async addListeners() {
        const readline = createInterface({ 
            input: process.stdin, 
            output: process.stdout
        });

        readline.on('line', async (data) => {
            const command = String(data).split('\r\n')[0].split(' ');
            await this.executeCommand(command);
        
            navigation.printCurrentDirectory();
        });

        readline.on('SIGINT', () => {
            this.closeApp();
        });
    }

    closeApp() {
        console.log(`Thank you for using File Manager, ${this.username}, goodbye!\n`);
        process.exit();
    }    


    async executeCommand(command) {
        const [operation, argument1, argument2] = command;

        switch(operation) {
            case COMMANDS.exit: 
                this.closeApp();
            case COMMANDS.files.read:
                if (!argument1) {
                    console.log('Invalid input');
                } else await fileSystem.readFile(argument1);
                break;
            case COMMANDS.files.create:
                if (!argument1) {
                    console.log('Invalid input');
                } else await fileSystem.createFile(argument1);
                break;
            case COMMANDS.files.rename:
                if (!argument1 || !argument2) {
                    console.log('Invalid input');
                } else await fileSystem.renameFile(argument1, argument2);
                break;
            case COMMANDS.files.copy:
                if (!argument1 || !argument2) {
                    console.log('Invalid input');
                } else await fileSystem.copyFile(argument1, argument2);
                break;
            case COMMANDS.files.delete:
                if (!argument1) {
                    console.log('Invalid input');
                } else await fileSystem.deleteFile(argument1);
                break;
            case COMMANDS.files.move:
                if (!argument1 || !argument2) {
                    console.log('Invalid input');
                } else await fileSystem.moveFile(argument1, argument2);
                break;
            case COMMANDS.os:
                if (!argument1) {
                    console.log('Invalid input');
                } else operatingSystem.printOperatingSystemInfo(argument1);
                break;
            case COMMANDS.hash:
                if (!argument1) {
                    console.log('Invalid input');
                } else await hash.printHashFile(argument1);
                break;
            case COMMANDS.compress:
                if (!argument1 || !argument2) {
                    console.log('Invalid input');
                } else await compress.compressFile(argument1, argument2);
                break;
            case COMMANDS.decompress:
                if (!argument1 || !argument2) {
                    console.log('Invalid input');
                } else await compress.decompressFile(argument1, argument2);
                break;
            case COMMANDS.navigation.list:
                await navigation.printListOfFiles();
                break;
            case COMMANDS.navigation.cd:
                if (!argument1) {
                    console.log('Invalid input');
                } else await navigation.navigateToDirectory(argument1);
                break;
            case COMMANDS.navigation.up:
                navigation.navigateToUpperDirectory();
                break;
            default: console.log('Invalid input');
        }
    }
}