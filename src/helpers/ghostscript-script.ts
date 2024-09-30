import { spawn } from 'child_process';

process.on('message', (args: any) => {
    const child = spawn(args.driverBin, args.cmd);

    child.stdout.on('data', (data: any) => {
        args.event = {
            type: 'stdout',
            data: data
        }
        process.send!(args);
    });

    child.stderr.on('data', (data: any) => {
        args.event = {
            type: 'stderr',
            error: `${data}`
        }
        process.send!(args);
    });

    child.on('error', (error: any) => {
        args.event = {
            type: 'error',
            error: error
        }
        process.send!(args);
    });

    child.on('close', (code: any) => {
        args.event = {
            type: 'close',
            code: code
        }
        process.send!(args);
    });
})
