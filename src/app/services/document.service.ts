import { Injectable } from '@angular/core';
import { ResponseDto } from '../model/ResponseDto';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../commons/config';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private http : HttpClient,
    private config : Config
  ) { }

  public uploadDocument(file : any) : Observable<ResponseDto>{
    let input = new FormData();
    input.append('file', file);
    return this.http.post <ResponseDto>(this.config._urlUploadDocument,input, { 'headers' : new HttpHeaders('multipart/form-data')});
  };

  public downloadImage(id : any){
    this.http.get(this.config._urlGetImage+id).subscribe((image : any) => {
      FileSaver.saveAs(image, "image-Document");		
      }, error => {
        console.log(error);
        alert('Report List download excelsheet fetch wrong data');
      });
  }
  
  public downloadPdf(id : any){
    this.http.get(this.config._urlGetPdf+id).subscribe((pdf : any) => {
      FileSaver.saveAs(pdf, "pdf-Document");		
      }, error => {
        console.log(error);
        alert('Report List download excelsheet fetch wrong data');
      });
  }

  public downloadDoc(id : any){
    this.http.get(this.config._urlGetDoc+id).subscribe((doc : any) => {
      FileSaver.saveAs(doc, "Document");		
      }, error => {
        console.log(error);
        alert('Report List download excelsheet fetch wrong data');
      });
  };

  public deleteDocument(id : number):Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlDeleteDocument + id);
  }

}

