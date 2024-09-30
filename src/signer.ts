import { Buffer } from "buffer";


import { PDFDocument, PDFImage, PDFPage } from 'pdf-lib';
import plainAddPlaceholder from 'node-signpdf/dist/helpers/plainAddPlaceholder';
import { SignPdf } from "node-signpdf";

import { ISignerModel } from "../models/i-signer.model";

export class Signer {

  private _drawImage(pdfPage: PDFPage, pdfImage: PDFImage): void {
    const {width, height} = {width: 60, height: 30};
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

  private _drawText(): void {

  }

  addSignerImage(pdf: Buffer, watermark: Buffer, pages: number[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      PDFDocument
        .load(pdf)
        .then(async (document) => {
          if (!!document) {
            const stampImage = await document.embedPng(watermark);
            const pages = document.getPages();
            for (let i = 0, len = pages.length; i < len; i++) {
              this._drawImage(pages[i], stampImage);
            }
            const pdfWithStamp = await document.save();
            return resolve(Buffer.from(pdfWithStamp));
          } else {
            throw new Error('document not exist');
          }
        })
        .catch(err => {
          return reject(err);
        });
    })
  }

  signPdfa(config: ISignerModel): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {

        const pdfWithPlaceHolder = plainAddPlaceholder({
          pdfBuffer: config.pdfToCertify,
          reason: '',
          contactInfo: '',
          name: config.signerName,
          location: '',
          signatureLength: 15224,
        });
        const signer = new SignPdf();





        const signedPdfBuffer = signer.sign(pdfWithPlaceHolder, Buffer.from(config.certificate), {
          passphrase: config.certPassword
        });
        return resolve(signedPdfBuffer)
      } catch (e) {
        reject(e)
      }
    });

  }


  addPlaceholder(): void {

  }

}

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