import { ConnectionOptions } from './client.types';
export default class MercuryClientFactory {
    static Client(connectionOptions: ConnectionOptions): Promise<void>;
}
