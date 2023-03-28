import { IClipFilter } from './clip-randomizer';
import { HelixClip, HelixGame } from '@twurple/api';

export class GameFilter implements IClipFilter {
    constructor(protected game: HelixGame | string, protected negate: boolean = false) {
    }

    filter(clips: HelixClip[]): HelixClip[] {
        return clips.filter(clip => {
            return this.negate ?
                clip.gameId !== (typeof this.game === 'string' ? this.game : this.game.id) :
                clip.gameId === (typeof this.game === 'string' ? this.game : this.game.id);
        });
    }
}
