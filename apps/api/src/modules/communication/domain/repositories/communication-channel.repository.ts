import { CommunicationChannel } from '../aggregates/communication-channel.aggregate';

export interface CommunicationChannelRepository {
  findById(id: string): Promise<CommunicationChannel | null>;
  save(channel: CommunicationChannel): Promise<void>;
}
