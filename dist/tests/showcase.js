"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signer_1 = require("../src/signer");
const fs_1 = __importDefault(require("fs"));
const date_fns_1 = require("date-fns");
const certificate_service_1 = require("../src/services/certificate.service");
const pdf_helper_1 = require("../src/helpers/pdf.helper");
const path_1 = require("path");
const WATERMARK_IMG = './assets/signature.png';
const PDF_TO_ASSIGN = './assets/test.pdf';
const CERT = "./assets/cert.pfx";
const CERT_PASSWORD = "123456";
const file = fs_1.default.readFileSync(PDF_TO_ASSIGN);
const certificate = fs_1.default.readFileSync(CERT);
const watermark = fs_1.default.readFileSync(WATERMARK_IMG);
const certifiedIn = (0, date_fns_1.format)(new Date(), '\'Data:\' dd/MM/yyyy HH:mm:ss XXX');
const certificateService = new certificate_service_1.CertificateService();
certificateService
    .extractPfxData(CERT, CERT_PASSWORD)
    .then(pfxData => {
    const signerModel = {
        pdfToCertify: file,
        certificate: certificate,
        certPassword: '123456',
        signerName: pfxData.subject.commonName.split(':')[0],
        document: pfxData.subject.commonName.split(':')[1],
        certifiedIn: certifiedIn,
        watermark: {
            image: watermark,
        }
    };
    const signer = new signer_1.Signer();
    const inputFilePdfa = (0, path_1.join)(__dirname, '..', 'buffer-img.pdf');
    const outputFilePdfa = (0, path_1.join)(__dirname, '..', 'output.pdf');
    signer.addSignerImage(signerModel.pdfToCertify, signerModel.watermark.image, [])
        .then(pdfBuffer => {
        fs_1.default.writeFileSync('buffer-img.pdf', pdfBuffer);
    })
        .then(() => {
        const pdfHelper = new pdf_helper_1.PdfHelper((0, path_1.join)(__dirname, '..', 'ghostscript/win32/gswin64.exe'));
        return pdfHelper.convertToPDFA(inputFilePdfa, outputFilePdfa);
    })
        .then((pdfaFilePath) => {
        console.log(pdfaFilePath);
        // signerModel.pdfToCertify = Buffer.from(fs.readFileSync(pdfaFilePath));
        return signer.signPdfa(signerModel);
    })
        .then((assignedFile) => {
        fs_1.default.writeFileSync('assignedFile.pdf', assignedFile);
    });
})
    .catch(err => {
    console.log(err);
});
//# sourceMappingURL=showcase.js.map