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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
const buffer_1 = require("buffer");
const pdf_lib_1 = require("pdf-lib");
const plainAddPlaceholder_1 = __importDefault(require("node-signpdf/dist/helpers/plainAddPlaceholder"));
const node_signpdf_1 = require("node-signpdf");
class Signer {
    _drawImage(pdfPage, pdfImage) {
        const { width, height } = { width: 60, height: 30 };
        const xPosition = 100;
        const yPosition = 43;
        pdfPage.drawImage(pdfImage, {
            x: width - width,
            y: height - height,
            width,
            height,
            opacity: 1,
        });
    }
    _drawText() {
    }
    addSignerImage(pdf, watermark, pages) {
        return new Promise((resolve, reject) => {
            pdf_lib_1.PDFDocument
                .load(pdf)
                .then((document) => __awaiter(this, void 0, void 0, function* () {
                if (!!document) {
                    const stampImage = yield document.embedPng(watermark);
                    const pages = document.getPages();
                    for (let i = 0, len = pages.length; i < len; i++) {
                        this._drawImage(pages[i], stampImage);
                    }
                    const pdfWithStamp = yield document.save();
                    return resolve(buffer_1.Buffer.from(pdfWithStamp));
                }
                else {
                    throw new Error('document not exist');
                }
            }))
                .catch(err => {
                return reject(err);
            });
        });
    }
    signPdfa(config) {
        return new Promise((resolve, reject) => {
            try {
                const pdfWithPlaceHolder = (0, plainAddPlaceholder_1.default)({
                    pdfBuffer: config.pdfToCertify,
                    reason: '',
                    contactInfo: '',
                    name: config.signerName,
                    location: '',
                    signatureLength: 15224,
                });
                const signer = new node_signpdf_1.SignPdf();
                const signedPdfBuffer = signer.sign(pdfWithPlaceHolder, buffer_1.Buffer.from(config.certificate), {
                    passphrase: config.certPassword
                });
                return resolve(signedPdfBuffer);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    addPlaceholder() {
    }
}
exports.Signer = Signer;
// const stampImage = await document.embedPng(
//   fs.readFileSync(join(__dirname, '..', 'assets', 'icp.png')),
// );
//
//
//
// document.catalog.set(
//   PDFName.of('MarkInfo'),
//   document.context.obj({
//       Marked: true
//     }
//   ),
// );
//
// if(!!config.watermark){
//   const pages = document.getPages();
//   const lastPage = pages[pages.length - 1];
//
//
// }
//# sourceMappingURL=signer.js.map