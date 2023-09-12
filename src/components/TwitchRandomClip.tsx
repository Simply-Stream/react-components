import { FC, useEffect, useState } from 'react';
import { TwitchRandomClipsConfig } from './TwitchRandomClips';
import ClipRandomizer from '../util/clip-randomizer';
import TwitchClip from './TwitchClip';
import ClipHeader from './ClipHeader';
import { HelixClip, HelixUser } from '@twurple/api';

type TwitchRandomClipProps = {
    streamer: HelixUser,
    randomizer: ClipRandomizer,
    config: TwitchRandomClipsConfig
    onClipEnded?: () => void,
};

const TwitchRandomClip: FC<TwitchRandomClipProps> = ({streamer, randomizer, config, onClipEnded}) => {
    const [clip, setClip] = useState<HelixClip>();
    const [show, setShow] = useState<boolean>(!config.skipClipOnError ?? true);

    if (!config.authentication) {
        throw Error('Authentication mandatory');
    }

    useEffect(() => {
        if (streamer.id) {
            randomizer.getRandomClip(streamer).then(clip => setClip(clip));
        }
    }, [streamer])

    function clipEnded() {
        if (config.skipClipOnError) setShow(false);

        if (onClipEnded) onClipEnded();
    }

    function clipStarted() {
        if (config.skipClipOnError) setShow(true);
    }

    return (
        <>
            {clip &&
                <TwitchClip
                    clip={clip}
                    quality={config?.quality ?? '1080'}
                    onClipEnded={clipEnded}
                    onClipStarted={clipStarted}
                    skipOnError={config.skipClipOnError}>
                    {show && !config.hideInfo &&
                        <ClipHeader clip={clip}
                                    showClipTitle={config?.information?.clip ?? false}
                                    showGameName={config?.information?.game ?? false}
                                    showStreamerName={config?.information?.streamer ?? false}/>
                    }
                </TwitchClip>}
        </>
    );
}

export default TwitchRandomClip;
