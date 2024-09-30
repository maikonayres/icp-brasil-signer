import { Buffer } from "buffer";
import { ISignerModel } from "../models/i-signer.model";
export declare class Signer {
    private _drawImage;
    private _drawText;
    addSignerImage(pdf: Buffer, watermark: Buffer, pages: number[]): Promise<Buffer>;
    signPdfa(config: ISignerModel): Promise<Buffer>;
    addPlaceholder(): void;
}
