import { v4 } from "uuid";
import { ActionType } from "../constants/constants";
import { RoomModel } from "../models/room.model";
import { getClientId } from "./client";
import { getUsers } from "./user";
import { UsersModel } from "../models/user.model";
import { WebSocket } from "ws";

let rooms: RoomModel[] = [];

export function getRooms(): RoomModel[] {
    return rooms;
}

export function createRoom(socket: WebSocket): void {
    const roomId = v4();
    const { index, name } = getNameAndIndex(socket);

    setRoom(roomId, index, name);
}

export function addUserToRoom(roomId: string, socket: WebSocket): void {
    const index = rooms.findIndex(room => room.roomId === roomId);
    rooms[index].roomUsers.push(getNameAndIndex(socket));
}

export function getUpdatedRooms(): string {
    return JSON.stringify({
        type: ActionType.UPDATE_ROOM,
        data:
            JSON.stringify(rooms),
        id: 0
    });
}

export function getUsersInRoom(roomId: string): UsersModel[] {
    return rooms.find(room => room.roomId === roomId).roomUsers;
}

export function setAllRooms(rooms: RoomModel[]) {
    rooms = rooms;
}

export function deleteRoom(roomId: string) {
    rooms = rooms.filter(room => room.roomId !== roomId);
}

function getNameAndIndex(socket: WebSocket): UsersModel {
    const userId = getClientId(socket);
    const users = getUsers();
    const name = users.find(user => user.index === userId).login;

    return {
        name,
        index: userId
    }
}

function setRoom(roomId: string, index: string, name: string): void {
    rooms.push({
        roomId,
        roomUsers: [{
            index,
            name
        }]
    });
}