"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TerminalSimulator {
    constructor() {
        this.currentDirectory = '/home/erre503';
        this.fileSystem = {
            '/home/erre503/github_stats.txt': '',
            '/home/erre503/github_detailed.txt': '',
            '/home/erre503/.bashrc': '# Erre503 Terminal Configuration',
            '/home/erre503/README.md': '# Welcome to Erre503\'s Terminal\n\nUse commands like ls, cat, pwd, whoami, help'
        };
        // Load file contents
        this.loadFileContents();
    }
    loadFileContents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statsResponse = yield fetch('./github_stats.txt');
                const detailedResponse = yield fetch('./github_detailed.txt');
                this.fileSystem['/home/erre503/github_stats.txt'] = yield statsResponse.text();
                this.fileSystem['/home/erre503/github_detailed.txt'] = yield detailedResponse.text();
            }
            catch (error) {
                console.error('Error loading files:', error);
            }
        });
    }
    executeCommand(command) {
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        switch (cmd) {
            case 'ls':
                return this.ls(args);
            case 'cat':
                return this.cat(args);
            case 'pwd':
                return this.pwd();
            case 'whoami':
                return this.whoami();
            case 'help':
                return this.help();
            case 'clear':
                return 'CLEAR_TERMINAL';
            case 'cd':
                return this.cd(args);
            case 'echo':
                return this.echo(args);
            case 'date':
                return this.date();
            case 'uname':
                return this.uname(args);
            case 'neofetch':
                return this.neofetch();
            default:
                return `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }
    ls(args) {
        const files = Object.keys(this.fileSystem)
            .filter(path => path.startsWith(this.currentDirectory) && path !== this.currentDirectory)
            .map(path => path.replace(this.currentDirectory + '/', ''))
            .filter(name => !name.includes('/'));
        if (files.length === 0) {
            return 'total 0';
        }
        return files.map(file => {
            var _a;
            const isDir = this.fileSystem[file] && file.includes('/');
            return `${isDir ? 'd' : '-'}rw-r--r-- 1 erre503 erre503 ${((_a = this.fileSystem[this.currentDirectory + '/' + file]) === null || _a === void 0 ? void 0 : _a.length) || 0} ${new Date().toLocaleDateString()} ${file}`;
        }).join('\n');
    }
    cat(args) {
        if (args.length === 0) {
            return 'cat: missing file operand';
        }
        const fileName = args[0];
        const filePath = this.currentDirectory + '/' + fileName;
        if (this.fileSystem[filePath]) {
            return this.fileSystem[filePath];
        }
        else {
            return `cat: ${fileName}: No such file or directory`;
        }
    }
    pwd() {
        return this.currentDirectory;
    }
    whoami() {
        return 'erre503';
    }
    help() {
        return `Available commands:
ls              - List directory contents
cat <file>      - Display file contents
pwd             - Print working directory
whoami          - Print current user
cd <dir>        - Change directory
echo <text>     - Display text
date            - Display current date
uname           - Print system information
neofetch        - Display system info
clear           - Clear terminal
help            - Show this help

GitHub files:
- github_stats.txt     - Basic GitHub statistics
- github_detailed.txt  - Detailed GitHub analytics`;
    }
    cd(args) {
        if (args.length === 0) {
            this.currentDirectory = '/home/erre503';
            return '';
        }
        const dir = args[0];
        if (dir === '..') {
            const parts = this.currentDirectory.split('/');
            parts.pop();
            this.currentDirectory = parts.join('/') || '/';
        }
        else if (dir === '~' || dir === '/home/erre503') {
            this.currentDirectory = '/home/erre503';
        }
        else {
            return `cd: ${dir}: No such file or directory`;
        }
        return '';
    }
    echo(args) {
        return args.join(' ');
    }
    date() {
        return new Date().toString();
    }
    uname(args) {
        if (args.includes('-a')) {
            return 'Linux erre503-desktop 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux';
        }
        return 'Linux';
    }
    neofetch() {
        return `
            .-/+oossssoo+/-.               erre503@erre503-desktop
        \`:+ssssssssssssssssss+\`           -----------------------------
      -+ssssssssssssssssssyyssss+-         OS: Erre503 Linux Terminal
    .ossssssssssssssssssdMMMNysssso.       Host: GitHub Profile Terminal
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: 5.15.0
  +ssssssssshmydMMMMMMMNddddyssssssss+     Uptime: 99 days
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Packages: 1337 (apt)
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Shell: erre503-terminal
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Resolution: 1920x1080
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   DE: Terminal
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   WM: Black Terminal
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Theme: Dark Terminal
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Icons: GitHub Icons
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/    Terminal: erre503-terminal
  +sssssssssdmydMMMMMMMMddddyssssssss+     CPU: Intel Core i7
   /ssssssssssshdmNNNNmyNMMMMhssssss/      GPU: NVIDIA RTX 3080
    .ossssssssssssssssssdMMMNysssso.       Memory: 32768MB / 65536MB
      -+sssssssssssssssssyyyssss+-         GitHub: Erre503
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.

`;
    }
    goated() {
        return `
        I am actually the GOAT. 
                                
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠠⠴⠶⠾⠿⠿⠿⢶⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢿⣿⣆⠐⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⠆⠹⠦⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⣀⠐⣶⣶⣶⣶⣶⣶⡀⢀⣀⣀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⢿⣿⡆⢹⡿⠻⢿⣿⣿⣷⠈⠿⠛⠁⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣴⣾⣷⣤⣉⣠⣾⣷⣦⣼⣿⣿⣿⣧⠀⠀⠀⠀⠀
    ⠀⣶⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀
    ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀
    ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣛⠻⢧⣘⡷⠀⠀⠀
    ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⣉⠛⠿⣷⣦⣌⠁⠀⠀⠀
    ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⣠⠘⠀⠀⢹⣿⣶⣶⠀⠀⠀⠀⠀⠀
    ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⢺⣿⠀⠀⠀⠘⣿⣿⡟⠀⠀⠀⠀⠀⠀
    ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠁⠀⠀⠀⠀⠻⡟⠃⠀⠀⠀⠀⠀⠀
    ⠀⠛⠛⠛⠛⠛⠛⠛⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;
    }
}
window.TerminalSimulator = TerminalSimulator;
