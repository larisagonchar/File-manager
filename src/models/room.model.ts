import { UsersModel } from "./user.model";

export interface RoomModel {
    roomId: string;
    roomUsers: UsersModel[]
}