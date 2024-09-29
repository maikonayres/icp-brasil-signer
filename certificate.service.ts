import fs from "fs";
import * as forge from 'node-forge';
import { IPfxDataModel } from "./models/i-pfx-data.model";


export class CertificateService {

  extractPfxData(certificatePath: string, password: string): Promise<IPfxDataModel> {

    return new Promise((resolve, reject) => {
      try {
        const blob = fs.readFileSync(certificatePath, {encoding: 'base64'});
        const pkcs12 = forge.pkcs12;
        const p12Der = forge.util.decode64(blob);
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        const pkcs12Pfx = pkcs12.pkcs12FromAsn1(p12Asn1, password);

        const bags = pkcs12Pfx.getBags({bagType: forge.pki.oids.certBag});
        const certBag = bags[forge.pki.oids.certBag];

        if (certBag == undefined || !Array.isArray(certBag) || !certBag.length) {
          return reject('certBag dont exist');
        }

        const cert = certBag[0].cert;

        if (cert == undefined) {
          return reject('cert is undefined');
        }

        const subject: any = {};
        cert.subject.attributes.forEach((attribute) => {
          if (!!attribute?.name) {
            subject[attribute.name!] = attribute.value
          }
        });

        const issuer: any = {};
        cert.issuer.attributes.forEach((attribute) => {
          if (!!attribute?.name) {
            issuer[attribute.name!] = attribute.value
          }
        });

        const serialNumber = cert.serialNumber;
        const validFrom = cert.validity.notBefore;
        const validTo = cert.validity.notAfter;

        return resolve({
          subject,
          issuer,
          serialNumber,
          validFrom,
          validTo
        });

      } catch (error) {
        return reject(error);
      }
    });
  }

}