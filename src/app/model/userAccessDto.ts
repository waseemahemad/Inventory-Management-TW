import { UserAccessSlaveDto } from "./userAccessSlaveDto";

export interface UserAccessDto {
    id: number,
    userId: number,
    moduleId: number,
    masteraccess: boolean,
    useraccessslave: Array<UserAccessSlaveDto>,
}