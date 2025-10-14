export interface User {
  id: string;
  name: string;
}

export interface CreateRoomPayload {
  user: User;
}

export interface CreateRoomResponse {
  roomId: string;
  success: boolean;
}

export interface JoinRoomPayload {
  roomId: string;
  user: User;
}

export interface JoinRoomResponse {
  success: boolean;
  message?: string;
}
