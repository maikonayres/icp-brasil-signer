import { SignPdf } from "node-signpdf";

import { ISignerModel } from "./models/i-signer.model";
import { PDFDocument, PDFName } from 'pdf-lib';

export class Signer {

  sign(config: ISignerModel): Promise<any> {
    return new Promise(() => {
      const signer = new SignPdf();

      PDFDocument
        .load(config.fileToCertify)
        .then(document => {

          document.catalog.set(
            PDFName.of('MarkInfo'),
            document.context.obj({
                Marked: true
              }
            ),
          );

          if(!!config.watermark){
            const pages = document.getPages();
            const lastPage = pages[pages.length - 1];
          }



        })
        .catch(err => {
          console.log(err);
        });
    })
  }



  addPlaceholder(): void {

  }

}