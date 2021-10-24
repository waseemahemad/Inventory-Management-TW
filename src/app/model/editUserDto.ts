export interface EditUserDto {
    id : string;
	username : string;
	password : string;
	name : string;
	email : string;
	mobile : string;
	status : string;
	roles : Array<string>;
}