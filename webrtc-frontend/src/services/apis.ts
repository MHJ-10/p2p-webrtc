import httpService from "./http";
import type {
  CreateRoomPayload,
  CreateRoomResponse,
  JoinRoomPayload,
  JoinRoomResponse,
} from "./interface";

export const createRoom = async (payload: CreateRoomPayload) => {
  return await httpService.post<CreateRoomResponse>("/create-room", payload);
};

export const joinRoom = async (payload: JoinRoomPayload) => {
  return await httpService.post<JoinRoomResponse>("/join-room", payload);
};
