import httpService from "./http";
import type { CheckRoomExistResponse, CreateRoomResponse } from "./interface";

export const createRoom = async () => {
  return await httpService.post<CreateRoomResponse>("/rooms");
};

export const checkRoomExist = async (roomId: string) => {
  return await httpService.get<CheckRoomExistResponse>(`/rooms/${roomId}`);
};
