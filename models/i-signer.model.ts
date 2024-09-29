import { Buffer } from "buffer";

import { PDFImage } from "pdf-lib";


export interface ISignerModel {
  pdfToCertify: Buffer,
  certificate: Buffer,
  certPassword: string,
  signerName: string,
  document: string,
  certifiedIn: string,
  watermark?: {
    image: PDFImage
  },

}