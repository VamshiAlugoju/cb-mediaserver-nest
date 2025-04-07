import { IRoomManager } from 'src/interfaces/Roommanager.interface';
import Room from './Room';
import MediaWorker from './Worker';
import WorkerManagerInstance from './WorkerManager';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoomManager implements IRoomManager {
  public rooms: Map<string, Room> = new Map();
  constructor() {}
  private logger = new Logger('RoomManager');
  log(message: any) {
    this.logger.log(message);
  }
  async createRoom(
    owenerId: string,
    callId: string,
    roomId: string,
  ): Promise<Room> {
    const MediaWorker = await WorkerManagerInstance.getWorker();
    const router = await MediaWorker.worker.createRouter({
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
      ],
    });

    const room = new Room(router, roomId, callId, MediaWorker.workerId);
    this.rooms.set(roomId, room);
    this.registerRoom();
    return room;
  }

  private registerRoom() {}
  async getRoomById(roomId: string): Promise<Room | undefined> {
    return this.rooms.get(roomId);
  }
  getRooms(): Promise<Room[]> {
    throw new Error('Method not implemented.');
  }
  getWorker(): Promise<MediaWorker> {
    throw new Error('Method not implemented.');
  }
  joinRoom(): Promise<Room> {
    throw new Error('Method not implemented.');
  }
  async closeRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      await room.closeRoom();
      this.rooms.delete(roomId);
    }
  }

  async closeAllRooms() {
    if (process.env.NODE_ENV === 'dev') {
      this.rooms.forEach(async (room) => {
        await room.closeRoom();
      });
      this.rooms.clear();
      this.log('Closed all rooms');
      return {
        status: true,
      };
    }
  }

  logRooms() {}
}
