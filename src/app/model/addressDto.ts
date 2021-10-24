import { CityDto } from "./cityDto";
import { StateDto } from "./stateDto";
import { CountryDto } from "./countryDto";

export interface AddressDto{
    id : number;
	type : string;
	attension : string;
	address : string;
	street : string;
	zipCode : string;
	phoneNo : string;
	fax : string;
	city : CityDto;
	state : StateDto;
	country : CountryDto;
}