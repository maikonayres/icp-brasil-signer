import { Signer } from "../src/signer";
import fs from "fs";

import { format } from 'date-fns';
import { CertificateService } from "../src/services/certificate.service";
import { ISignerModel } from "../models";
import { PdfHelper } from "../src/helpers/pdf.helper";
import { join } from "path";

const WATERMARK_IMG = './assets/signature.png';
const PDF_TO_ASSIGN = './assets/test.pdf';
const CERT = "./assets/cert.pfx";
const CERT_PASSWORD = "123456";

const file = fs.readFileSync(PDF_TO_ASSIGN);
const certificate = fs.readFileSync(CERT);
const watermark = fs.readFileSync(WATERMARK_IMG);

const certifiedIn = format(
  new Date(),
  '\'Data:\' dd/MM/yyyy HH:mm:ss XXX',
);

const certificateService = new CertificateService();

certificateService
  .extractPfxData(CERT, CERT_PASSWORD)
  .then(pfxData => {

    const signerModel: ISignerModel = {
      pdfToCertify: file,
      certificate: certificate,
      certPassword: '123456',
      signerName: pfxData.subject.commonName.split(':')[0],
      document: pfxData.subject.commonName.split(':')[1],
      certifiedIn: certifiedIn,
      watermark: {
        image: watermark,
      }
    }

    const signer = new Signer();
    const inputFilePdfa = join(__dirname, '..', 'buffer-img.pdf');
    const outputFilePdfa = join(__dirname, '..', 'output.pdf');

    signer.addSignerImage(signerModel.pdfToCertify, signerModel.watermark!.image, [])
      .then(pdfBuffer => {
        fs.writeFileSync('buffer-img.pdf', pdfBuffer);
      })
      .then(() => {
        const pdfHelper = new PdfHelper(join(__dirname, '..', 'ghostscript/win32/gswin64.exe'));
        return pdfHelper.convertToPDFA(inputFilePdfa, outputFilePdfa)
      })
      .then((pdfaFilePath) => {
        console.log(pdfaFilePath);
        // signerModel.pdfToCertify = Buffer.from(fs.readFileSync(pdfaFilePath));
        return signer.signPdfa(signerModel);
      })
      .then((assignedFile) => {
        fs.writeFileSync('assignedFile.pdf', assignedFile);
      })

  })
  .catch(err => {
    console.log(err);
  })


