import { Item } from "./item";
import { Game } from './Game';

export class Clip implements Item {
    public "@id"?: string;

    constructor(
        public streamer: string,
        public title: string,
        public url: string,
        public thumbnailUrl: string,
        _id?: string,
        public id?: any,
        public game?: Game,
        public duration?: any,
        public createdAt?: any,
    ) {
        this["@id"] = _id;
    }
}
