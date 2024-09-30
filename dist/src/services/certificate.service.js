"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const fs_1 = __importDefault(require("fs"));
const forge = __importStar(require("node-forge"));
class CertificateService {
    extractPfxData(certificatePath, password) {
        return new Promise((resolve, reject) => {
            try {
                const blob = fs_1.default.readFileSync(certificatePath, { encoding: 'base64' });
                const pkcs12 = forge.pkcs12;
                const p12Der = forge.util.decode64(blob);
                const p12Asn1 = forge.asn1.fromDer(p12Der);
                const pkcs12Pfx = pkcs12.pkcs12FromAsn1(p12Asn1, password);
                const bags = pkcs12Pfx.getBags({ bagType: forge.pki.oids.certBag });
                const certBag = bags[forge.pki.oids.certBag];
                if (certBag == undefined || !Array.isArray(certBag) || !certBag.length) {
                    return reject('certBag dont exist');
                }
                const cert = certBag[0].cert;
                if (cert == undefined) {
                    return reject('cert is undefined');
                }
                const subject = {};
                cert.subject.attributes.forEach((attribute) => {
                    if (!!(attribute === null || attribute === void 0 ? void 0 : attribute.name)) {
                        subject[attribute.name] = attribute.value;
                    }
                });
                const issuer = {};
                cert.issuer.attributes.forEach((attribute) => {
                    if (!!(attribute === null || attribute === void 0 ? void 0 : attribute.name)) {
                        issuer[attribute.name] = attribute.value;
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
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
exports.CertificateService = CertificateService;
//# sourceMappingURL=certificate.service.js.map