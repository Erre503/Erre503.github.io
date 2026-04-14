interface FileSystem {
    [key: string]: string;
}

class TerminalSimulator {
    private currentDirectory: string = '/home/erre503';
    private fileSystem: FileSystem = {
        '/home/erre503/github_stats.txt': '',
        '/home/erre503/github_detailed.txt': '',
        '/home/erre503/.bashrc': '# Erre503 Terminal Configuration',
        '/home/erre503/README.md': '# Welcome to Erre503\'s Terminal\n\nUse commands like ls, cat, pwd, whoami, help'
    };

    constructor() {
        // Load file contents
        this.loadFileContents();
    }

    private async loadFileContents(): Promise<void> {
        try {
            const statsResponse = await fetch('./github_stats.txt');
            const detailedResponse = await fetch('./github_detailed.txt');

            this.fileSystem['/home/erre503/github_stats.txt'] = await statsResponse.text();
            this.fileSystem['/home/erre503/github_detailed.txt'] = await detailedResponse.text();
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    public executeCommand(command: string): string {
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

    private ls(args: string[]): string {
        const files = Object.keys(this.fileSystem)
            .filter(path => path.startsWith(this.currentDirectory) && path !== this.currentDirectory)
            .map(path => path.replace(this.currentDirectory + '/', ''))
            .filter(name => !name.includes('/'));

        if (files.length === 0) {
            return 'total 0';
        }

        return files.map(file => {
            const isDir = this.fileSystem[file] && file.includes('/');
            return `${isDir ? 'd' : '-'}rw-r--r-- 1 erre503 erre503 ${this.fileSystem[this.currentDirectory + '/' + file]?.length || 0} ${new Date().toLocaleDateString()} ${file}`;
        }).join('\n');
    }

    private cat(args: string[]): string {
        if (args.length === 0) {
            return 'cat: missing file operand';
        }

        const fileName = args[0];
        const filePath = this.currentDirectory + '/' + fileName;

        if (this.fileSystem[filePath]) {
            return this.fileSystem[filePath];
        } else {
            return `cat: ${fileName}: No such file or directory`;
        }
    }

    private pwd(): string {
        return this.currentDirectory;
    }

    private whoami(): string {
        return 'erre503';
    }

    private help(): string {
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

    private cd(args: string[]): string {
        if (args.length === 0) {
            this.currentDirectory = '/home/erre503';
            return '';
        }

        const dir = args[0];
        if (dir === '..') {
            const parts = this.currentDirectory.split('/');
            parts.pop();
            this.currentDirectory = parts.join('/') || '/';
        } else if (dir === '~' || dir === '/home/erre503') {
            this.currentDirectory = '/home/erre503';
        } else {
            return `cd: ${dir}: No such file or directory`;
        }
        return '';
    }

    private echo(args: string[]): string {
        return args.join(' ');
    }

    private date(): string {
        return new Date().toString();
    }

    private uname(args: string[]): string {
        if (args.includes('-a')) {
            return 'Linux erre503-desktop 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux';
        }
        return 'Linux';
    }

    private neofetch(): string {
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
}

// Export for use in HTML
declare global {
    interface Window {
        TerminalSimulator: typeof TerminalSimulator;
    }
}

window.TerminalSimulator = TerminalSimulator;