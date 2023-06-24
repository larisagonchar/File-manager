import { EOL, arch, cpus, homedir, userInfo } from 'os';
import { OS_ARGUMENTS } from '../constants/os-arguments.js';

class OperatingSystem {
    eol = EOL.split('');

    homedir = homedir();

    username = userInfo().username;

    architecture = arch();

    cpus = cpus();

    printCpusInfo() {
        console.log(`Overall amount of cpus: ${this.cpus.length}`);
        console.log(`Model: ${this.cpus[0].model}`);
        
        const info = this.cpus.map(cpu => {
            return {
                model: cpu.model,
                speed: `${cpu.speed / 1000} GHz`
            }
        });

        console.log(info);
    }

    printOperatingSystemInfo(argument) {
        switch(argument) {
            case OS_ARGUMENTS.eol:
                console.log(this.eol);
                break;
            case OS_ARGUMENTS.cpus:
                this.printCpusInfo();
                break;
            case OS_ARGUMENTS.homedir:
                console.log(this.homedir);
                break;
            case OS_ARGUMENTS.username:
                console.log(this.username);
                break;
            case OS_ARGUMENTS.arch:
                console.log(this.architecture);
                break;
            default: console.log('Invalid input');
        }
    }
}

export const operatingSystem = new OperatingSystem();