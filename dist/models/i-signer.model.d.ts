import { Buffer } from "buffer";
export interface ISignerModel {
    pdfToCertify: Buffer;
    certificate: Buffer;
    certPassword: string;
    signerName: string;
    document: string;
    certifiedIn: string;
    watermark?: {
        image: Buffer;
        pages?: number[];
    };
}
