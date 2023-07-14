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

    const isValid = isPasswordValid(userInfo.password);
    
    const user: Message = {
        type: ActionType.REG,
        data: JSON.stringify({
            name: userInfo.name,
            index: userId,
            error: !isValid,
            errorText: !isValid ? 'Password must contain: lower letter, capital letter, at list 1 number' : null
        }),
        id: 0
    };

    if (isValid) setUser(userInfo, userId);

    return JSON.stringify(user);
}

function isPasswordValid(password: string): boolean {
    let isPasswordContainNumber = false;
    let isPasswordContainCapitalLetter = false;
    let isPasswordContainLowerLetter = false;

    const characters = password.split('');

    characters.forEach(character => {
        if (!isNaN(+character)) isPasswordContainNumber = true;
        else if (character === character.toUpperCase()) isPasswordContainCapitalLetter = true;
        else if (character === character.toLowerCase()) isPasswordContainLowerLetter = true;
    });

    return isPasswordContainCapitalLetter && isPasswordContainLowerLetter && isPasswordContainNumber;
}

function setUser(userInfo: { name: string; password: string; }, userId: string): void {

    users.push({
        login: userInfo.name,
        password: userInfo.password,
        index: userId
    });
    
}
