import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
   n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
   received_n_array = new Array();
   value : any;
  public convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
   
    if (n_length <= 9) {
        
        for (var i = 0; i < n_length; i++) {
            this.received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
          this. n_array[i] =   this.received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (  this.n_array[i] == 1) {
                  this.n_array[j] = 10 + Number(this.n_array[j]);
                  this.n_array[i] = 0;
                }
            }
        }
        
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                this.value = this.n_array[i] * 10;
            } else {
              this.value = this.n_array[i];
            }
            if (this.value != 0) {
                words_string += words[this.value] + " ";
            }
            if ((i == 1 && this.value != 0) || (i == 0 && this.value != 0 && this.n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && this.value != 0) || (i == 2 && this.value != 0 && this.n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && this.value != 0) || (i == 4 && this.value != 0 && this.n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && this.value != 0 && (this.n_array[i + 1] != 0 && this.n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && this.value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}
}
