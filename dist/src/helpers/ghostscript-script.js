"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
process.on('message', (args) => {
    const child = (0, child_process_1.spawn)(args.driverBin, args.cmd);
    child.stdout.on('data', (data) => {
        args.event = {
            type: 'stdout',
            data: data
        };
        process.send(args);
    });
    child.stderr.on('data', (data) => {
        args.event = {
            type: 'stderr',
            error: `${data}`
        };
        process.send(args);
    });
    child.on('error', (error) => {
        args.event = {
            type: 'error',
            error: error
        };
        process.send(args);
    });
    child.on('close', (code) => {
        args.event = {
            type: 'close',
            code: code
        };
        process.send(args);
    });
});
//# sourceMappingURL=ghostscript-script.js.map