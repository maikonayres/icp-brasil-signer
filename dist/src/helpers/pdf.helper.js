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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfHelper = void 0;
const child_process_1 = require("child_process");
const pdf_lib_1 = require("pdf-lib");
class PdfHelper {
    constructor(driverBin) {
        this._spawnScript = '/ghostscript-script';
        this._driverBin = '';
        // join(__dirname, '..', 'ghostscript/win32/gswin64.exe')
    }
    pdfCountPages(pdfBuffer) {
        return new Promise((resolve, reject) => {
            try {
                pdf_lib_1.PDFDocument.load(pdfBuffer)
                    .then((document) => __awaiter(this, void 0, void 0, function* () {
                    const pages = document.getPages();
                    return resolve(pages.length);
                }));
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    convertToPDFA(inputFile, outputFile) {
        return new Promise((resolve, reject) => {
            try {
                const cmd = [
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
                const spawn = (0, child_process_1.fork)(__dirname + this._spawnScript, {});
                spawn.on('message', (message) => {
                    if (message.event.type === 'close') {
                        spawn.kill();
                        if (message.event.code === 0) {
                            return resolve(outputFile);
                        }
                        else {
                            return reject("error in conversion to PDF/A");
                        }
                    }
                });
                const cmdArgs = {
                    driverBin: this._driverBin,
                    cmd: cmd
                };
                spawn.send(cmdArgs);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.PdfHelper = PdfHelper;
//# sourceMappingURL=pdf.helper.js.map