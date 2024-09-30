import { IPfxDataIssuerModel } from "./i-pfx-data-issuer.model";
import { IPfxDataSubjectModel } from "./i-pfx-data-subject.model";
export interface IPfxDataModel {
    subject: IPfxDataSubjectModel;
    issuer: IPfxDataIssuerModel;
    serialNumber: string;
    validFrom: Date;
    validTo: Date;
}
