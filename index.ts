import { Signer } from "./signer";
import fs from "fs";

import { format } from 'date-fns';
import { CertificateService } from "./certificate.service";
import { ISignerModel } from "./models/i-signer.model";

const PDF_TO_ASSIGN = './assets/coletanea-poemas.pdf';
const CERT = "./assets/cert.pfx";
const CERT_PASSWORD = "123456";

const file = fs.readFileSync(PDF_TO_ASSIGN);
const certificate = fs.readFileSync(CERT);

const certifiedIn = format(
  new Date(),
  '\'Data:\' dd/MM/yyyy HH:mm:ss XXX',
);

const certificateService = new CertificateService();

certificateService
  .extractPfxData("./assets/certificados/rafael_valido.pfx", CERT_PASSWORD)
  .then(pfxData => {

    const signerModel: ISignerModel = {
      pdfToCertify: file,
      certificate: certificate,
      certPassword: '123456',
      signerName: pfxData.subject.commonName.split(':')[0],
      document: pfxData.subject.commonName.split(':')[1],
      certifiedIn: certifiedIn
    }

    const signer = new Signer();


  })
  .catch(err => {
    console.log(err);
  })


