import { Buffer } from "buffer";
import { fork } from "child_process";

import { PDFDocument } from 'pdf-lib';

export interface cmdArgs {
  driverBin: string;
  cmd: any[];
}


export class PdfHelper {

  private readonly _spawnScript = '/ghostscript-script';
  private _driverBin: string = '';

  constructor(driverBin: string) {
    // join(__dirname, '..', 'ghostscript/win32/gswin64.exe')
  }

  pdfCountPages(pdfBuffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {

      try {
        PDFDocument.load(pdfBuffer)
          .then(async document => {
            const pages = document.getPages();
            return resolve(pages.length);
          })
      } catch (err) {
        return reject(err);
      }
    });
  }


  convertToPDFA(inputFile: string, outputFile: string,): Promise<string> {
    return new Promise((resolve, reject) => {
      try {

        const cmd: any [] = [
          '-q',
          '-dPDFACompatibilityPolicy=1',
          `-dPDFA=1`,
          '-dBATCH',
          '-dNOPAUSE',
          '-sColorConversionStrategy=UseDeviceIndependentColor',
          '-sDEVICE=pdfwrite',
          `-sOutputFile=${outputFile}`,
          `${inputFile}`
        ];

        const spawn = fork(__dirname + this._spawnScript, {});
        spawn.on('message', (message: any) => {

          if (message.event.type === 'close') {
            spawn.kill();
            if (message.event.code === 0) {
              return resolve(outputFile);
            } else {
              return reject("error in conversion to PDF/A");
            }
          }
        });

        const cmdArgs: cmdArgs = {
          driverBin: this._driverBin,
          cmd: cmd
        }
        spawn.send(cmdArgs);

      } catch (e) {
        reject(e);
      }
    });
  }

}
