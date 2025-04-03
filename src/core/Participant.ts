import { Logger } from '@nestjs/common';
import { types } from 'mediasoup';
import {
  IParticipant,
  IClientProducer,
} from 'src/interfaces/Participant.interface';

export default class Participant implements IParticipant {
  participantId: string;
  userId: string;
  roomId: string;
  producerTransport: types.WebRtcTransport<types.AppData> | null = null;
  consumerTransport: types.WebRtcTransport<types.AppData> | null = null;
  producers: IClientProducer = {};
  consumers: Map<string, types.Consumer<types.AppData>> = new Map();
  isConnected: boolean = false;
  mediaState: { audio: boolean; video: boolean } = {
    audio: false,
    video: false,
  };
  constructor(userId: string, roomId: string, uniqueId: string) {
    this.roomId = roomId;
    this.userId = userId;
    this.participantId = uniqueId;
    this.logData();
  }
  private logger = new Logger('Participant');

  logData() {}

  log(data: any) {
    this.logger.log(data);
  }

  addProducerTransport(transport: types.WebRtcTransport) {
    this.producerTransport = transport;
  }
  addConsumerTransport(transport: types.WebRtcTransport) {
    this.consumerTransport = transport;
  }
  getProducerTransport() {
    return this.producerTransport;
  }
  getConsumerTransport() {
    return this.consumerTransport;
  }
  async cleanUp() {
    if (this.producerTransport) {
      await this.producerTransport.close();
      this.producerTransport = null;
    }
    if (this.consumerTransport) {
      await this.consumerTransport.close();
      this.consumerTransport = null;
    }
    this.producers.audio?.close();
    this.producers.video?.close();
    this.consumers.forEach((consumer) => consumer.close());
    this.consumers.clear();
    this.log(`Cleaned up participant ${this.participantId}`);
  }

  addConsumer(consumer: types.Consumer<types.AppData>) {
    this.consumers.set(consumer.id, consumer);
  }

  removeConsumer(consumerId: string) {
    this.consumers.delete(consumerId);
  }
  getConsumer(consumerId: string) {
    return this.consumers.get(consumerId);
  }
  setConnected(connected: boolean) {
    this.isConnected = connected;
    this.log(`Participant ${this.participantId} connected: ${connected}`);
  }
  updateMediaState(audio: boolean, video: boolean) {
    this.mediaState.audio = audio;
    this.mediaState.video = video;
  }
  replaceProducerTransport(transport: types.WebRtcTransport) {
    if (this.producerTransport) {
      this.producerTransport.close();
    }
    this.producerTransport = transport;
    this.log(`Replaced producer transport for ${this.participantId}`);
  }
  async produceAudio({ kind, appData, rtpParameters }: any) {
    if (!this.producerTransport) {
      throw 'Producer Transport not found';
    }
    const producer = await this.producerTransport.produce({
      kind: kind,
      appData: appData,
      rtpParameters: rtpParameters,
    });
    this.producers.audio = producer;
    return producer;
  }
  async produceVideo({ kind, appData, rtpParameters }: any) {
    if (!this.producerTransport) {
      throw 'Producer Transport not found';
    }
    const producer = await this.producerTransport.produce({
      kind: kind,
      appData: appData,
      rtpParameters: rtpParameters,
    });
    this.producers.video = producer;
    return producer;
  }
}
