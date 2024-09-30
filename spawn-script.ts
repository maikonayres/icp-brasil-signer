import {spawn} from 'child_process';

process.on('message', (args: any) => {
    const child = spawn(args.driverBin, args.cmd);

    // console.log(args.cmd.join(' '));

    child.stdout.on('data', (data: any) => {
        args.event = {
            type: 'stdout',
            data: data
        }
        // console.log(data.toString());
        // @ts-ignore
        process.send(args);
    });

    child.stderr.on('data', (data: any) => {
        args.event = {
            type: 'stderr',
            error: `${data}`
        }
        // console.log(data.toString());
        // @ts-ignore
        process.send(args);
    });

    child.on('error', (error: any) => {
        args.event = {
            type: 'error',
            error: error
        }
        // console.log(error.toString());
        // @ts-ignore
        process.send(args);
    });

    child.on('close', (code: any) => {
        args.event = {
            type: 'close',
            code: code
        }
        // @ts-ignore
        process.send(args);
    });
})
