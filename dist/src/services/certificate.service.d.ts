import { IPfxDataModel } from "../../models/i-pfx-data.model";
export declare class CertificateService {
    extractPfxData(certificatePath: string, password: string): Promise<IPfxDataModel>;
}
