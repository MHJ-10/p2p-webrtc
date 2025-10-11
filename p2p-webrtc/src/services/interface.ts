interface CreateRoomResponse {
  roomId: string;
}

type CheckRoomExistResponse =
  | {
      exists: false;
    }
  | {
      exists: true;
      clients: number;
    };

export type { CheckRoomExistResponse, CreateRoomResponse };
