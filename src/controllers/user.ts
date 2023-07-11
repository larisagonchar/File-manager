import { WebSocket } from "ws";
import { ActionType } from "../constants/constants";
import { Message, UserModel } from "../models/user.model";
import { getClientId, setClient } from "./client";

const users: UserModel[] = [];

export function getUsers(): UserModel[] {
    return users;
}

export function getUserAfterRegistration(message: Message, socket: WebSocket): string {
    setClient(socket);

    const userInfo: {
        name: string;
        password: string;
    } = JSON.parse(message.data);

    const userId = getClientId(socket);

    setUser(userInfo, userId);
    
    const user: Message = {
        type: ActionType.REG,
        data: JSON.stringify({
            name: userInfo.name,
            index: userId,
            error: false
        }),
        id: 0
    };

    return JSON.stringify(user);
}

function setUser(userInfo: { name: string; password: string; }, userId: string): void {

    users.push({
        login: userInfo.name,
        password: userInfo.password,
        index: userId
    });
    
}
