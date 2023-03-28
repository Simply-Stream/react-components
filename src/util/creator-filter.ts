import { IClipFilter } from './clip-randomizer';
import { HelixClip } from '@twurple/api';

export default class CreatorFilter implements IClipFilter {
    constructor(protected creators: string[], protected negate: boolean = false) {
    }

    filter(clips: HelixClip[]): HelixClip[] {
        return clips.filter(clip => {
            let isCreator = false;

            for (let creator in this.creators) {
                console.log(clip.creatorDisplayName, this.creators[creator]);
                isCreator = clip.creatorDisplayName.toLowerCase() === this.creators[creator].toLowerCase();

                if (isCreator && !this.negate) {
                    return isCreator;
                }
            }

            return false;
        })
    }
}
