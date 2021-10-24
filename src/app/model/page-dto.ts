export class PageDto {

    constructor(page : number, size : number) {
        this.page = page;
        this.size = size;
    }
    page : number;
    size : number;
    data : any;
    totalCount : number;
}