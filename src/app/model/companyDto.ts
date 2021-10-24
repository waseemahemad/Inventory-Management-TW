import { CityDto } from "./cityDto";
import { StateDto } from "./stateDto";
import { CountryDto } from "./countryDto";

export interface CompanyDto {
    id : number;
	name : string;
	email : string;
	website : string;
	address : string;
	street : string;
	zipCode : string;
	phoneNo : string;
	mobileNo : string;
	fax : string;
	currency : string;
	trnno : string;
	city : CityDto;
	state : StateDto;
	country : CountryDto;
}