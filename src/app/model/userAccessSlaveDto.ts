export interface UserAccessSlaveDto{
    id : number,
	view : boolean,
	create : boolean,
	edit : boolean,
	canDelete : boolean,
	print : boolean,
	authorize : boolean,
	unAuthorize : boolean,
	ctq : boolean,
	cto : boolean,
	ctdn : boolean,
	cti : boolean,
	date : boolean,
	userAccessId : number,
	moduleSubMasterId : number,
	subModName : string
}