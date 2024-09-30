import { Buffer } from "buffer";
export interface cmdArgs {
    driverBin: string;
    cmd: any[];
}
export declare class PdfHelper {
    private readonly _spawnScript;
    private _driverBin;
    constructor(driverBin: string);
    pdfCountPages(pdfBuffer: Buffer): Promise<number>;
    convertToPDFA(inputFile: string, outputFile: string): Promise<string>;
}
