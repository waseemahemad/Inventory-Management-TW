export interface CreateUserDto {
	username : string;
	password : string;
	name : string;
	email : string;
	mobile : string;
	status : string;
	roles : Array<string>;
}